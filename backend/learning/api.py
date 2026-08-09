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

# --- SERVER-SIDE HIGH-QUALITY NEURAL & ELEVENLABS TTS ENGINE ---
import os
import hashlib
import requests
from fastapi.responses import FileResponse

AUDIO_CACHE_DIR = os.path.join(os.path.dirname(__file__), "audio_cache")
os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

# ElevenLabs Settings
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "sk_5019b018d3570f369def51408a0220a9e6c36ccfcb7075e6")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "")  # Paste your cloned Voice ID here

@learning_api_router.get("/tts")
async def generate_server_tts(text: str, lang: str = "en", voice: str = "female"):
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Text required")

    # Clean HTML/markdown tags for audio synthesis
    clean_text = re.sub(r'<[^>]*>?', '', text)
    clean_text = re.sub(r'[\*\_]', '', clean_text).strip()
    if not clean_text:
        clean_text = "Content empty."

    # 1. TRY ELEVENLABS API FIRST (If API Key is provided)
    if ELEVENLABS_API_KEY:
        # Default voice ID or cloned Voice ID
        target_voice_id = ELEVENLABS_VOICE_ID if ELEVENLABS_VOICE_ID else "21m00Tcm4TlvDq8ikWAM" # Rachel default
        text_hash = hashlib.md5(f"elevenlabs_{target_voice_id}_{clean_text}".encode('utf-8')).hexdigest()
        file_path = os.path.join(AUDIO_CACHE_DIR, f"{text_hash}.mp3")

        if os.path.exists(file_path):
            return FileResponse(file_path, media_type="audio/mpeg", filename=f"{text_hash}.mp3")

        try:
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{target_voice_id}"
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": ELEVENLABS_API_KEY
            }
            data = {
                "text": clean_text,
                "model_id": "eleven_multilingual_v2",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75
                }
            }
            res = requests.post(url, json=data, headers=headers, timeout=15)
            if res.status_code == 200:
                with open(file_path, "wb") as f:
                    f.write(res.content)
                return FileResponse(file_path, media_type="audio/mpeg", filename=f"{text_hash}.mp3")
            else:
                print(f"ElevenLabs API Error status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"ElevenLabs synthesis exception: {e}")

    # 2. FALLBACK TO MICROSOFT NEURAL SSML ENGINE
    if lang == "hi":
        voice_name = "hi-IN-SwaraNeural" if voice == "female" else "hi-IN-MadhurNeural"
    else:
        voice_name = "en-IN-NeerjaNeural" if voice == "female" else "en-IN-PrabhatNeural"

    text_hash = hashlib.md5(f"ssml_{voice_name}_{clean_text}".encode('utf-8')).hexdigest()
    file_path = os.path.join(AUDIO_CACHE_DIR, f"{text_hash}.mp3")

    if not os.path.exists(file_path):
        try:
            import edge_tts
            ssml_body = clean_text.replace('. ', '. <break time="450ms"/> ')\
                                  .replace('? ', '? <break time="550ms"/> ')\
                                  .replace('! ', '! <break time="450ms"/> ')\
                                  .replace(', ', ', <break time="250ms"/> ')

            ssml_text = f"""<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="{ 'hi-IN' if lang == 'hi' else 'en-IN' }">
    <voice name="{voice_name}">
        <prosody rate="-7%" pitch="-2%">
            {ssml_body}
        </prosody>
    </voice>
</speak>"""
            communicate = edge_tts.Communicate(ssml_text, voice_name, is_ssml=True)
            await communicate.save(file_path)
        except Exception as e:
            try:
                import gtts
                gtts_lang = 'hi' if lang == 'hi' else 'en'
                tts = gtts.gTTS(clean_text, lang=gtts_lang)
                tts.save(file_path)
            except Exception as ex2:
                raise HTTPException(status_code=500, detail=f"TTS generation failed: {ex2}")

    return FileResponse(file_path, media_type="audio/mpeg", filename=f"{text_hash}.mp3")




