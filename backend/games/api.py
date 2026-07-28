from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List

from .db import SessionLocal, GameScore, GameProgress

games_api_router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ScoreCreate(BaseModel):
    game_name: str
    player1_id: str
    player2_id: str
    player1_score: int
    player2_score: int
    winner_id: str

class LeaderboardEntry(BaseModel):
    player_id: str
    wins: int

@games_api_router.post("/scores")
def create_score(score: ScoreCreate, db: Session = Depends(get_db)):
    db_score = GameScore(**score.dict())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return {"status": "success", "id": db_score.id}

@games_api_router.get("/leaderboard/{game_name}", response_model=List[LeaderboardEntry])
def get_leaderboard(game_name: str, db: Session = Depends(get_db)):
    # Calculate wins for all players (only count actual player IDs, not 'AI' or 'Guest' or 'tie')
    wins = db.query(
        GameScore.winner_id.label('player_id'),
        func.count(GameScore.id).label('wins')
    ).filter(
        GameScore.game_name == game_name,
        GameScore.winner_id.notin_(['AI', 'Guest', 'tie', 'Computer'])
    ).group_by(
        GameScore.winner_id
    ).order_by(
        func.count(GameScore.id).desc()
    ).limit(10).all()
    
    return [{"player_id": r.player_id, "wins": r.wins} for r in wins]

class ProgressUpdate(BaseModel):
    level: int

@games_api_router.get("/progress/{game_name}/{player_id}")
def get_progress(game_name: str, player_id: str, db: Session = Depends(get_db)):
    progress = db.query(GameProgress).filter(
        GameProgress.game_name == game_name,
        GameProgress.player_id == player_id
    ).first()
    return {"level": progress.level if progress else 0}

@games_api_router.post("/progress/{game_name}/{player_id}")
def update_progress(game_name: str, player_id: str, progress: ProgressUpdate, db: Session = Depends(get_db)):
    db_progress = db.query(GameProgress).filter(
        GameProgress.game_name == game_name,
        GameProgress.player_id == player_id
    ).first()
    
    if db_progress:
        db_progress.level = progress.level
    else:
        db_progress = GameProgress(
            game_name=game_name,
            player_id=player_id,
            level=progress.level
        )
        db.add(db_progress)
        
    db.commit()
    return {"status": "success", "level": db_progress.level}
