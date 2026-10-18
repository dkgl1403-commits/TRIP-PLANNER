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
    classes = db.query(LearningClass).order_by(LearningClass.level.asc()).all()
    return {"status": "success", "classes": [{"id": c.id, "name": c.name, "level": c.level} for c in classes]}

@learning_api_router.get("/subjects")
def get_subjects(class_id: str, db: Session = Depends(get_db)):
    subjects = db.query(LearningSubject).filter_by(class_id=class_id).all()
    result = []
    for s in subjects:
        topics = db.query(LearningTopic).filter_by(subject_id=s.id).order_by(LearningTopic.order_idx).all()
        topic_names = [t.name for t in topics]
        result.append({
            "id": s.id,
            "name": s.name,
            "topic_count": len(topics),
            "topics_summary": ", ".join(topic_names[:4]) + ("..." if len(topic_names) > 4 else "")
        })
    return {"status": "success", "subjects": result}

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

# Story cast: every character keeps the same voice in every chapter. (voice, pitch, rate) per language.
# Only two Indian English and two Hindi neural voices exist, so pitch/rate give each character a distinct sound.
STORY_CAST = {
    "en": {
        "Dadi":   ("en-IN-NeerjaNeural", -14, -8),
        "Neha":   ("en-IN-NeerjaExpressiveNeural", -2, 0),
        "Disha":  ("en-IN-NeerjaExpressiveNeural", 14, 6),
        "Deepak": ("en-IN-PrabhatNeural", -4, -2),
        "Harsh":  ("en-IN-PrabhatNeural", 28, 8),
        "Narrator-female": ("en-IN-NeerjaExpressiveNeural", 0, 0),
        "Narrator-male":   ("en-IN-PrabhatNeural", 0, 0),
    },
    "hi": {
        "Dadi":   ("hi-IN-SwaraNeural", -14, -8),
        "Neha":   ("hi-IN-SwaraNeural", -2, 0),
        "Disha":  ("hi-IN-SwaraNeural", 14, 6),
        "Deepak": ("hi-IN-MadhurNeural", -4, -2),
        "Harsh":  ("hi-IN-MadhurNeural", 28, 8),
        "Narrator-female": ("hi-IN-SwaraNeural", 0, 0),
        "Narrator-male":   ("hi-IN-MadhurNeural", 0, 0),
    },
}


def _voice_for(lang: str, voice: str, speaker: Optional[str]):
    cast = STORY_CAST["hi" if lang == "hi" else "en"]
    if speaker and speaker in cast:
        return cast[speaker]
    return cast["Narrator-male" if voice == "male" else "Narrator-female"]


def _sentence_prosody(sentence: str, idx: int, base_pitch: int, base_rate: int):
    """Questions rise, exclamations get more energy, plain sentences alternate slightly so speech isn't flat."""
    if sentence.endswith("?"):
        pitch, rate, volume = base_pitch + 10, base_rate - 4, 0
    elif sentence.endswith("!"):
        pitch, rate, volume = base_pitch + 16, base_rate + 6, 15
    else:
        pitch, rate, volume = (base_pitch + 4, base_rate, 0) if idx % 2 == 0 else (base_pitch - 2, base_rate - 4, 0)
    return {"pitch": f"{pitch:+d}Hz", "rate": f"{rate:+d}%", "volume": f"{volume:+d}%"}


async def synthesize_tts(text: str, lang: str = "en", voice: str = "female", speaker: Optional[str] = None) -> str:
    """Synthesizes a line to an mp3 in the audio cache (reused if already generated) and returns its path."""
    clean_text = re.sub(r'<[^>]*>?', '', text)
    clean_text = re.sub(r'[\*\_]', '', clean_text).strip() or "Content empty."

    voice_name, base_pitch, base_rate = _voice_for(lang, voice, speaker)
    cache_key = f"expressive_v6_{speaker or voice}_{voice_name}_{clean_text}"
    file_path = os.path.join(AUDIO_CACHE_DIR, f"{hashlib.md5(cache_key.encode('utf-8')).hexdigest()}.mp3")
    if os.path.exists(file_path):
        return file_path

    try:
        import edge_tts
        audio = b""
        for idx, sentence in enumerate(s for s in re.split(r'(?<=[.?!])\s+', clean_text) if s.strip()):
            communicate = edge_tts.Communicate(sentence, voice_name, **_sentence_prosody(sentence, idx, base_pitch, base_rate))
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio += chunk["data"]
        if not audio:
            raise RuntimeError("edge-tts returned no audio")
        with open(file_path, "wb") as f:
            f.write(audio)
        return file_path
    except Exception as e:
        print(f"edge-tts synthesis failed, falling back to gTTS: {e}")
        try:
            import gtts
            gtts.gTTS(clean_text, lang='hi' if lang == 'hi' else 'en').save(file_path)
            return file_path
        except Exception as ex:
            raise HTTPException(status_code=500, detail=f"TTS generation failed: {ex}")


@learning_api_router.get("/tts")
async def generate_server_tts(text: str, lang: str = "en", voice: str = "female", speaker: Optional[str] = None):
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Text required")
    file_path = await synthesize_tts(text, lang, voice, speaker)
    return FileResponse(file_path, media_type="audio/mpeg", filename=os.path.basename(file_path))
