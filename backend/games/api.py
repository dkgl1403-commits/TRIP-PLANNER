from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List

from .db import SessionLocal, GameScore

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
