import sys
from backend.learning.db import SessionLocal, LearningClass, LearningSubject, LearningTopic

db = SessionLocal()
classes = db.query(LearningClass).all()
print("=== CLASSES IN DB ===")
for c in classes:
    print(f"ID: {c.id} | Level: {c.level} | Name: '{c.name}'")
    subjects = db.query(LearningSubject).filter_by(class_id=c.id).all()
    for s in subjects:
        print(f"  └─ Subject: {s.name} (id: {s.id})")
        topics = db.query(LearningTopic).filter_by(subject_id=s.id).all()
        for t in topics:
            print(f"       └─ Topic: {t.name}")

db.close()
