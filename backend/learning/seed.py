import json
from sqlalchemy.orm import Session
from learning.db import SessionLocal, engine, Base, LearningClass, LearningSubject, LearningTopic

Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # 1. Create Class
    class_10 = db.query(LearningClass).filter_by(name="Class 10").first()
    if not class_10:
        class_10 = LearningClass(name="Class 10")
        db.add(class_10)
        db.commit()
        db.refresh(class_10)

    # 2. Create Subject
    math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_10.id).first()
    if not math_subject:
        math_subject = LearningSubject(name="Mathematics", class_id=class_10.id)
        db.add(math_subject)
        db.commit()
        db.refresh(math_subject)

    # 3. Create Topic with 7-section academic config
    topic_config = {
        "topicName": "Introduction to Trigonometry",
        "parts": [
            {
                "title": "1. Introduction & History",
                "description": "The dawn of measuring triangles.",
                "content": "Trigonometry is the branch of mathematics that studies relationships between side lengths and angles of triangles.\n\nLink to Past: Builds upon the Pythagorean theorem and similar triangles.\nLink to Future: Crucial for Calculus, Physics, and advanced engineering.",
                "widgetType": "HistoryStoryteller",
                "widgetData": {
                    "scenes": [
                        {
                            "id": "hipparchus",
                            "title": "The Dawn of Astronomy",
                            "description": "Hipparchus needed a way to measure the distance between stars. He invented the Chord function (crd θ), measuring the straight-line distance across a circle for a given angle.",
                            "technique": "Radius = 60.\ncrd(7.5°) = 7;49,9\ncrd(15°) = 15;39,47"
                        },
                        {
                            "id": "aryabhata",
                            "title": "The Indian Contribution",
                            "description": "Aryabhata realized it was much easier to calculate with a right-angled triangle using a half-chord, which he called 'ardha-jya'. This is mathematically identical to our modern Sine function.",
                            "technique": "Radius = 3438.\nsin(3.75°) = 225\nsin(7.5°) = 449"
                        },
                        {
                            "id": "linguistic",
                            "title": "The Linguistic Journey",
                            "description": "Sanskrit 'jya' -> Arabic 'jiba' (written 'jb') -> misinterpreted as 'jaib' (pocket) -> translated to Latin 'sinus' (pocket/fold) -> English 'Sine'."
                        }
                    ]
                }
            },
            {
                "title": "2. Prerequisites & Continuity",
                "description": "What you need to know, and where you're going.",
                "content": "Prerequisites:\n- Right-Angled Triangles: Identifying the 90° angle, Hypotenuse, Perpendicular, and Base.\n- Pythagorean Theorem: a² + b² = c²\n- Properties of similar triangles.\n\nContinuity (What's Next):\n- Applications of Trigonometry (Heights and Distances).\n- Inverse Trigonometric Functions.\n- Trigonometry of non-right triangles (Sine/Cosine rules)."
            },
            {
                "title": "3. Real Life Applications",
                "description": "Why are we learning this?",
                "content": "1. Architecture & Civil Engineering: Calculating the exact slope of a roof, the height of a building, or the structural load on a bridge without needing a physical measuring tape.\n2. Navigation & GPS: Triangulation used by satellites to pinpoint your exact location on Earth.\n3. Sound & Light Waves: In physics and music production, sound waves are modeled mathematically using continuous Sine and Cosine graphs."
            },
            {
                "title": "4. Theory and Practical",
                "description": "The mathematical foundation.",
                "content": "Watch the automated derivations below to understand how the ratios and identities are formed.",
                "widgets": [
                    {
                        "title": "The Six Trigonometric Ratios",
                        "widgetType": "AutoDerivationGraph",
                        "widgetData": { "type": "sohcahtoa" }
                    },
                    {
                        "title": "The Pythagorean Identity",
                        "widgetType": "AutoDerivationGraph",
                        "widgetData": { "type": "identity" }
                    }
                ]
            },
            {
                "title": "5. Summary",
                "description": "Your ultimate cheat sheet.",
                "content": "Review the formulas, identities, and standard values. Memorizing these is key to solving problems quickly.",
                "widgetType": "CheatSheet"
            },
            {
                "title": "6. Example Problems & MCQs",
                "description": "Let's practice what we've learned.",
                "content": "Solve the following practice questions based on the theory.",
                "widgetType": "MCQEngine",
                "widgetData": {
                    "questions": [
                        {
                            "question": "If tan A = 4/3, what is the value of sin A?",
                            "options": ["3/5", "4/5", "3/4", "5/4"],
                            "correctAnswer": 1
                        },
                        {
                            "question": "Which of the following is equal to sec²θ - 1?",
                            "options": ["sin²θ", "cos²θ", "tan²θ", "cot²θ"],
                            "correctAnswer": 2
                        }
                    ]
                }
            },
            {
                "title": "7. Last 20 Years Board Questions",
                "description": "Authentic questions from past CBSE Board Exams.",
                "content": "Test your knowledge against real exam questions.",
                "widgetType": "MCQEngine",
                "widgetData": {
                    "questions": [
                        {
                            "year": "CBSE 2020",
                            "question": "If sin A = 1/2 and cos B = 1/2, then the value of A + B is:",
                            "options": ["0°", "30°", "60°", "90°"],
                            "correctAnswer": 3
                        },
                        {
                            "year": "CBSE 2019",
                            "question": "The value of (sin² 30° + cos² 30°) is:",
                            "options": ["0", "1", "2", "1/2"],
                            "correctAnswer": 1
                        },
                        {
                            "year": "CBSE 2015",
                            "question": "The value of 9sec²A - 9tan²A is:",
                            "options": ["1", "9", "8", "0"],
                            "correctAnswer": 1
                        },
                        {
                            "year": "CBSE 2012",
                            "question": "If sin θ - cos θ = 0, then the value of sin⁴θ + cos⁴θ is:",
                            "options": ["1", "3/4", "1/2", "1/4"],
                            "correctAnswer": 2
                        },
                        {
                            "year": "CBSE 2011",
                            "question": "If x = a cos θ and y = b sin θ, then b²x² + a²y² = ?",
                            "options": ["a²b²", "ab", "a⁴b⁴", "a²+b²"],
                            "correctAnswer": 0
                        }
                    ]
                }
            }
        ]
    }

    topic = db.query(LearningTopic).filter_by(subject_id=math_subject.id, name="Introduction to Trigonometry").first()
    if not topic:
        topic = LearningTopic(
            subject_id=math_subject.id,
            name="Introduction to Trigonometry",
            lesson_config_json=json.dumps(topic_config),
            order_idx=1
        )
        db.add(topic)
    else:
        topic.lesson_config_json = json.dumps(topic_config)

    db.commit()
    print("Database seeded successfully with Academic Trigonometry Lesson.")

if __name__ == "__main__":
    seed_data()
