import os
import uuid
import datetime
from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv('../.env')

# Use a separate local database for games to avoid cluttering HR or Oracle tables
DATABASE_URL = os.environ.get('GAMES_DATABASE_URL', 'sqlite:///./games_local.db')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_uuid():
    return str(uuid.uuid4())

class GameScore(Base):
    __tablename__ = "game_scores"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    game_name = Column(String, index=True) # e.g. 'dots_and_boxes'
    player1_id = Column(String, index=True) # Logged-in user's login_id
    player2_id = Column(String) # 'AI', 'Guest', or opponent's login_id
    player1_score = Column(Integer)
    player2_score = Column(Integer)
    winner_id = Column(String, index=True) # login_id, 'AI', 'Guest', or 'tie'
    played_at = Column(DateTime, default=datetime.datetime.utcnow)

class GameProgress(Base):
    __tablename__ = "game_progress"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    player_id = Column(String, index=True) # login_id
    game_name = Column(String, index=True)
    level = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
