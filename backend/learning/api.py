from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from learning.db import SessionLocal, LearningClass, LearningSubject, LearningTopic, LearningEnrollment, LearningStudentProgress

learning_api_router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@learning_api_router.get("/classes")
def get_classes(db: Session = Depends(get_db)):
    classes = db.query(LearningClass).all()
    return {"status": "success", "classes": [{"id": c.id, "name": c.name, "level": c.level} for c in classes]}

@learning_api_router.get("/subjects")
def get_subjects(class_id: str, db: Session = Depends(get_db)):
    subjects = db.query(LearningSubject).filter_by(class_id=class_id).all()
    return {"status": "success", "subjects": [{"id": s.id, "name": s.name} for s in subjects]}

@learning_api_router.get("/topics/{subject_id}")
def get_topics(subject_id: str, db: Session = Depends(get_db)):
    topics = db.query(LearningTopic).filter_by(subject_id=subject_id).order_by(LearningTopic.order_idx).all()
    return {"status": "success", "topics": [{"id": t.id, "name": t.name, "order_idx": t.order_idx} for t in topics]}

@learning_api_router.get("/topic/{topic_id}/config")
def get_topic_config(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(LearningTopic).filter_by(id=topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"status": "success", "config": topic.lesson_config_json}

@learning_api_router.get("/progress/{login_id}")
def get_progress(login_id: str, db: Session = Depends(get_db)):
    progress = db.query(LearningStudentProgress).filter_by(login_id=login_id).all()
    return {"status": "success", "progress": [{"topic_id": p.topic_id, "percentage": p.progress_percentage, "completed": p.completed} for p in progress]}

class ProgressUpdateRequest(BaseModel):
    topic_id: str
    percentage: float
    completed: bool

@learning_api_router.post("/progress/{login_id}")
def update_progress(login_id: str, req: ProgressUpdateRequest, db: Session = Depends(get_db)):
    progress = db.query(LearningStudentProgress).filter_by(login_id=login_id, topic_id=req.topic_id).first()
    if not progress:
        progress = LearningStudentProgress(login_id=login_id, topic_id=req.topic_id)
        db.add(progress)
    progress.progress_percentage = req.percentage
    progress.completed = req.completed
    db.commit()
    return {"status": "success"}

