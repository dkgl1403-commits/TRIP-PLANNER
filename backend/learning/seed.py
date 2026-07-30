import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from learning.db import init_db, SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_database():
    init_db()
    session = SessionLocal()
    
    # Check if we already have the class
    class10 = session.query(LearningClass).filter_by(name="Class 10").first()
    if not class10:
        class10 = LearningClass(name="Class 10", level=10)
        session.add(class10)
        session.commit()
        session.refresh(class10)
        
    math_subject = session.query(LearningSubject).filter_by(name="Mathematics", class_id=class10.id).first()
    if not math_subject:
        math_subject = LearningSubject(name="Mathematics", class_id=class10.id)
        session.add(math_subject)
        session.commit()
        session.refresh(math_subject)
        
    trig_topic = session.query(LearningTopic).filter_by(name="Introduction to Trigonometry", subject_id=math_subject.id).first()
    if not trig_topic:
        lesson_config = {
            "title": "Introduction to Trigonometry",
            "parts": [
                {
                    "id": "part-0",
                    "title": "The Trigonometry Skill Tree",
                    "type": "widget",
                    "widgetType": "SkillTree3D",
                    "description": "Zoom out to a massive visual map showing the progression of trigonometry."
                },
                {
                    "id": "part-1",
                    "title": "The Foundations",
                    "type": "content",
                    "content": "Trigonometry connects sides to angles. But where did it come from?",
                    "widgets": [
                        {"widgetType": "HexagonHack3D", "title": "The Hexagon Hack"},
                        {"widgetType": "RubberBandDemo", "title": "The 100% Rule"}
                    ]
                },
                {
                    "id": "part-2",
                    "title": "The Formula Forge",
                    "type": "widget",
                    "widgetType": "FormulaForge",
                    "description": "Drag and drop elements to forge new identities."
                },
                {
                    "id": "part-3",
                    "title": "Summary & Achievement",
                    "type": "content",
                    "content": "You are now The Grand Architect!"
                }
            ]
        }
        
        trig_topic = LearningTopic(
            name="Introduction to Trigonometry",
            subject_id=math_subject.id,
            order_idx=1,
            lesson_config_json=lesson_config
        )
        session.add(trig_topic)
        session.commit()
        
    print("Database seeded successfully with Class 10 Math: Introduction to Trigonometry.")

if __name__ == "__main__":
    seed_database()
