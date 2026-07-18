import os
import sys
from backend.finance_pipeline.db import Base, RawMarketDataV2, EngineeredFeaturesV2, V2Prediction, engine

def create_tables():
    RawMarketDataV2.__table__.create(bind=engine, checkfirst=True)
    EngineeredFeaturesV2.__table__.create(bind=engine, checkfirst=True)
    V2Prediction.__table__.create(bind=engine, checkfirst=True)
    print("V2 tables created successfully.")

if __name__ == "__main__":
    create_tables()
