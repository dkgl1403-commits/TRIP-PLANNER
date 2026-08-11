import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.learning.db import SessionLocal, LearningClass, LearningSubject, LearningTopic

db = SessionLocal()
print("=== LOCAL CLASSES ===")
for c in db.query(LearningClass).all():
    subs = db.query(LearningSubject).filter_by(class_id=c.id).all()
    print(f"ID: {c.id} | Level: {c.level} | Name: '{c.name}' | Subjects: {[s.name for s in subs]}")
db.close()
