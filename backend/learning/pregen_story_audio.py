"""Pre-generates narration audio for every story scene so learners never wait for TTS.

Run from backend/ (same working directory as the API, so the same DB and audio cache are used):
    python learning/pregen_story_audio.py            # all topics with scenes
    python learning/pregen_story_audio.py "Lines and Angles"
"""
import asyncio
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from learning.db import SessionLocal, LearningTopic  # noqa: E402
from learning.api import synthesize_tts  # noqa: E402


def story_lines(config):
    voice = config.get("voice", "female")
    for part in config.get("parts", []):
        for sc in part.get("scenes", []):
            if sc.get("say"):
                yield sc["say"], "en", voice
            if sc.get("sayHi"):
                yield sc["sayHi"], "hi", voice


async def main(topic_filter=None):
    db = SessionLocal()
    try:
        topics = db.query(LearningTopic).all()
        jobs = []
        for t in topics:
            if topic_filter and t.name != topic_filter:
                continue
            if not t.lesson_config_json:
                continue
            config = json.loads(t.lesson_config_json) if isinstance(t.lesson_config_json, str) else t.lesson_config_json
            jobs.extend((t.name, *line) for line in story_lines(config))
    finally:
        db.close()

    failed = 0
    for i, (name, text, lang, voice) in enumerate(jobs, 1):
        try:
            await synthesize_tts(text, lang, voice)
            print(f"[{i}/{len(jobs)}] {name} · {lang} ✓")
        except Exception as e:
            failed += 1
            print(f"[{i}/{len(jobs)}] {name} · {lang} FAILED: {e}")
    print(f"Done: {len(jobs) - failed} ready, {failed} failed")


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else None))
