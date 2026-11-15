import glob
import importlib
import os

from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

# Class 10 Mathematics story chapters (NCERT, rationalised syllabus). The topic rows already exist from the
# curriculum seed in seed.py; story chapters look them up by name and only replace their lesson.
CLASS10_MATH_CHAPTERS = [
    "Real Numbers",
    "Polynomials",
    "Pair of Linear Equations in Two Variables",
    "Quadratic Equations",
    "Arithmetic Progressions",
    "Triangles",
    "Coordinate Geometry",
    "Introduction to Trigonometry",
    "Some Applications of Trigonometry",
    "Circles",
    "Areas Related to Circles",
    "Surface Areas and Volumes",
    "Statistics",
    "Probability",
]


def get_class10_math(db):
    class_10 = db.query(LearningClass).filter_by(level=10).first()
    if not class_10:
        class_10 = LearningClass(level=10, name="Class 10")
        db.add(class_10)
        db.flush()
    math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_10.id).first()
    if not math_subject:
        math_subject = LearningSubject(name="Mathematics", class_id=class_10.id)
        db.add(math_subject)
        db.flush()
    return math_subject


def get_class10_topic(db, name):
    """The Class 10 Maths topic with this exact name (created, in book order, if it does not exist yet)."""
    math_subject = get_class10_math(db)
    topic = db.query(LearningTopic).filter_by(name=name, subject_id=math_subject.id).first()
    if not topic:
        topic = LearningTopic(subject_id=math_subject.id, name=name, order_idx=CLASS10_MATH_CHAPTERS.index(name) + 1, board_type="BOTH")
        db.add(topic)
        db.flush()
    return topic


def seed_class10_chapters():
    """Seeds every seed_class10_story_<chapter>.py in this folder. Each defines a function with the same
    name as the file, so new chapters need no registration."""
    here = os.path.dirname(os.path.abspath(__file__))
    for path in sorted(glob.glob(os.path.join(here, "seed_class10_story_*.py"))):
        name = os.path.splitext(os.path.basename(path))[0]
        getattr(importlib.import_module(name), name)()


if __name__ == "__main__":
    db = SessionLocal()
    try:
        for chapter in CLASS10_MATH_CHAPTERS:
            get_class10_topic(db, chapter)
        db.commit()
        print(f"Class 10 Mathematics: {len(CLASS10_MATH_CHAPTERS)} chapters present")
    finally:
        db.close()
