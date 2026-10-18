import glob
import importlib
import os

from db import SessionLocal, LearningClass, LearningSubject, LearningTopic, LearningStudentProgress

# Class 6 Mathematics = union of the old NCERT book (14 chapters) and the new
# Ganita Prakash book (10 chapters, 2024). Chapters without a lesson config show as "coming soon".
CLASS6_MATH_CHAPTERS = [
    "Patterns in Mathematics",
    "Knowing Our Numbers",
    "Whole Numbers",
    "Number Play",
    "Playing with Numbers",  # also covers Ganita Prakash "Prime Time"
    "Lines and Angles",      # also covers old "Basic Geometrical Ideas"
    "Understanding Elementary Shapes",
    "Integers: The Other Side of Zero",
    "Fractions",
    "Decimals",
    "Data Handling and Presentation",
    "Perimeter and Area",
    "Introduction to Algebra",
    "Ratio and Proportion",
    "Symmetry",
    "Practical Geometry and Constructions",
]

# Old-syllabus placeholder names now merged into the chapters above
LEGACY_PLACEHOLDERS = [
    "Playing With Numbers", "Basic Geometrical Ideas", "Integers", "Data Handling",
    "Mensuration", "Algebra", "Practical Geometry",
]


def get_class6_math(db):
    class_6 = db.query(LearningClass).filter_by(level=6).first()
    if not class_6:
        class_6 = LearningClass(level=6, name="Class 6")
        db.add(class_6)
        db.flush()

    math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_6.id).first()
    if not math_subject:
        math_subject = LearningSubject(name="Mathematics", class_id=class_6.id)
        db.add(math_subject)
        db.flush()
    return math_subject


def get_class6_topic(db, name):
    math_subject = get_class6_math(db)
    topic = db.query(LearningTopic).filter_by(name=name, subject_id=math_subject.id).first()
    if not topic:
        topic = LearningTopic(subject_id=math_subject.id, name=name)
        db.add(topic)
    topic.order_idx = CLASS6_MATH_CHAPTERS.index(name) + 1
    db.flush()
    return topic


def seed_class6_structure():
    db = SessionLocal()
    try:
        for name in CLASS6_MATH_CHAPTERS:
            get_class6_topic(db, name)
        # Remove merged legacy placeholders, but never one that has content or learner progress
        math_subject = get_class6_math(db)
        for name in LEGACY_PLACEHOLDERS:
            old = db.query(LearningTopic).filter_by(name=name, subject_id=math_subject.id).first()
            if old and not old.lesson_config_json and not db.query(LearningStudentProgress).filter_by(topic_id=old.id).first():
                db.delete(old)
        db.commit()
        print(f"Seeded Class 6 Mathematics structure ({len(CLASS6_MATH_CHAPTERS)} chapters)")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 structure: {e}")
    finally:
        db.close()


def seed_class6_chapters():
    """Seeds the chapter list, then every seed_class6_<chapter>.py in this folder.
    Each chapter file defines a function with the same name as the file, so new chapters need no registration."""
    seed_class6_structure()
    here = os.path.dirname(os.path.abspath(__file__))
    for path in sorted(glob.glob(os.path.join(here, "seed_class6_*.py"))):
        name = os.path.splitext(os.path.basename(path))[0]
        if name != "seed_class6_structure":
            getattr(importlib.import_module(name), name)()


if __name__ == "__main__":
    seed_class6_structure()
