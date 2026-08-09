from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json
import re
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
    classes = db.query(LearningClass).order_by(LearningClass.level.desc()).all()
    return {"status": "success", "classes": [{"id": c.id, "name": c.name, "level": c.level} for c in classes]}

@learning_api_router.get("/subjects")
def get_subjects(class_id: str, db: Session = Depends(get_db)):
    subjects = db.query(LearningSubject).filter_by(class_id=class_id).all()
    return {"status": "success", "subjects": [{"id": s.id, "name": s.name} for s in subjects]}

@learning_api_router.get("/topics/{subject_id}")
def get_topics(subject_id: str, db: Session = Depends(get_db)):
    topics = db.query(LearningTopic).filter_by(subject_id=subject_id).order_by(LearningTopic.order_idx).all()
    def extract_search_text(config_json):
        """Extract searchable text from lesson config: part titles + stripped narrative text."""
        if not config_json:
            return ""
        try:
            config = json.loads(config_json)
            parts = config.get("parts", [])
            texts = []
            for part in parts:
                if part.get("title"):
                    texts.append(part["title"])
                if part.get("keyInsight"):
                    texts.append(part["keyInsight"])
                if part.get("narrative"):
                    # Strip HTML tags for plain-text search
                    plain = re.sub(r'<[^>]+>', ' ', part["narrative"])
                    plain = re.sub(r'\s+', ' ', plain).strip()
                    texts.append(plain[:300])  # first 300 chars per part to keep payload small
            return " | ".join(texts)
        except Exception:
            return ""
    result = []
    for t in topics:
        result.append({
            "id": t.id,
            "name": t.name,
            "order_idx": t.order_idx,
            "board_type": t.board_type,
            "is_wip": not bool(t.lesson_config_json),
            "content_summary": extract_search_text(t.lesson_config_json)
        })
    return {"status": "success", "topics": result}

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

# --- SERVER-SIDE HIGH-QUALITY NEURAL TTS ENGINE ---
import os
import hashlib
from fastapi.responses import FileResponse

AUDIO_CACHE_DIR = os.path.join(os.path.dirname(__file__), "audio_cache")
os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

@learning_api_router.get("/tts")
async def generate_server_tts(text: str, lang: str = "en", voice: str = "male"):
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Text required")

    # Clean HTML/markdown tags for audio synthesis
    clean_text = re.sub(r'<[^>]*>?', '', text)
    clean_text = re.sub(r'[\*\_]', '', clean_text).strip()
    if not clean_text:
        clean_text = "Content empty."

    # Select Microsoft Neural Voice
    # Hindi Neural Voices: hi-IN-MadhurNeural (Male), hi-IN-SwaraNeural (Female)
    # English Indian Neural Voices: en-IN-PrabhatNeural (Male), en-IN-NeerjaNeural (Female)
    if lang == "hi":
        voice_name = "hi-IN-MadhurNeural" if voice == "male" else "hi-IN-SwaraNeural"
    else:
        voice_name = "en-IN-PrabhatNeural" if voice == "male" else "en-IN-NeerjaNeural"

    # MD5 hash filename for instant 0ms cached serving
    text_hash = hashlib.md5(f"{voice_name}_{clean_text}".encode('utf-8')).hexdigest()
    file_path = os.path.join(AUDIO_CACHE_DIR, f"{text_hash}.mp3")

    if not os.path.exists(file_path):
        try:
            import edge_tts
            communicate = edge_tts.Communicate(clean_text, voice_name)
            await communicate.save(file_path)
        except Exception as e:
            # Fallback to gTTS if edge-tts is unavailable or network fails
            try:
                import gtts
                gtts_lang = 'hi' if lang == 'hi' else 'en'
                tts = gtts.gTTS(clean_text, lang=gtts_lang)
                tts.save(file_path)
            except Exception as ex:
                raise HTTPException(status_code=500, detail=f"TTS generation failed: {ex}")

    return FileResponse(file_path, media_type="audio/mpeg", filename=f"{text_hash}.mp3")


