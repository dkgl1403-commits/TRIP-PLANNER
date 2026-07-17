import os
import uuid
from datetime import datetime
from finance_pipeline.utils import get_ist_now
from sqlalchemy import create_engine, Column, String, Float, DateTime, JSON, Date, Text, Integer
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv('.env')

# Use SQLite by default for local dev if Postgres URL is not provided
# Provide a way to override with FINANCE_DATABASE_URL
# Example postgres url: postgresql://user:password@localhost:5432/finance_db
DATABASE_URL = os.environ.get('FINANCE_DATABASE_URL', 'sqlite:///./finance_local.db')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_uuid():
    return str(uuid.uuid4())

class FinanceFactor(Base):
    __tablename__ = "finance_factors"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    domain = Column(String, index=True) # Domestic, International, Global
    geography = Column(String, index=True) # USA, China, India, Eurozone, Middle East, etc.
    event_category = Column(String, index=True) # Geopolitics, Monetary Policy, Corporate, etc.
    sector_impacted = Column(String, index=True) # IT, Banking, Auto, Energy, Broad Market, etc.
    company_size = Column(String) # Large Cap, Mid Cap, Small Cap, None
    factor_name = Column(String) # Human-readable specific identifier
    impact_weight = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)

class FinanceNewsEvent(Base):
    __tablename__ = "finance_news_events"
    
    id = Column(String(36), primary_key=True, default=get_uuid)
    published_at = Column(DateTime, index=True)
    headline = Column(Text)
    extracted_factors = Column(JSON)  # Will be JSONB in Postgres natively with SQLAlchemy

class FinancePrediction(Base):
    __tablename__ = "finance_predictions"
    
    date = Column(Date, primary_key=True)
    predicted_percent = Column(Float)
    actual_percent = Column(Float, nullable=True)
    reasoning = Column(Text)
    learning_feedback = Column(Text, nullable=True)
    sensex_current = Column(Float, nullable=True)
    nifty_current = Column(Float, nullable=True)
    sensex_predicted = Column(Float, nullable=True)
    nifty_predicted = Column(Float, nullable=True)

class HistoricalBackfillStatus(Base):
    __tablename__ = "historical_backfill_status"
    
    date = Column(Date, primary_key=True)
    status = Column(String) # 'COMPLETED', 'FAILED'
    processed_at = Column(DateTime, default=get_ist_now)

class MarketIndexHistory(Base):
    __tablename__ = "market_index_history"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    index_name = Column(String, index=True) # 'SENSEX' or 'NIFTY50'
    open_price = Column(Float)
    close_price = Column(Float)

class SystemJobStatus(Base):
    __tablename__ = "system_job_status"
    
    job_name = Column(String, primary_key=True)
    status = Column(String) # 'RUNNING', 'SUCCESS', 'FAILED'
    last_run_at = Column(DateTime)
    error_message = Column(Text, nullable=True)
    last_finished_at = Column(DateTime, nullable=True)
    last_run_summary = Column(String, nullable=True)

class RawMarketDataV2(Base):
    __tablename__ = "raw_market_data_v2"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    ticker = Column(String, index=True)
    open_price = Column(Float)
    high_price = Column(Float)
    low_price = Column(Float)
    close_price = Column(Float)
    volume = Column(Integer)

class EngineeredFeaturesV2(Base):
    __tablename__ = "engineered_features_v2"
    date = Column(Date, primary_key=True, index=True)
    target_ticker = Column(String, default="^NSEI")
    features_json = Column(Text) # Storing 36 features as JSON 
    sentiment_score = Column(Float)
    target_label = Column(Integer)

class V2Prediction(Base):
    __tablename__ = "v2_prediction"
    date = Column(Date, primary_key=True, index=True)
    target_ticker = Column(String, default="^NSEI")
    prob_crash = Column(Float)
    prob_down = Column(Float)
    prob_up = Column(Float)
    prob_boom = Column(Float)
    signal = Column(String)
    confidence = Column(Float)

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Finance Database initialized.")
