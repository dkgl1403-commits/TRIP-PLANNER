import os
import json
import logging
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from backend.finance_pipeline.db import EngineeredFeaturesV2, V2Prediction, engine
from sqlalchemy.orm import sessionmaker

SessionLocal = sessionmaker(bind=engine)
logger = logging.getLogger(__name__)

MODEL_PATH = "backend/finance_pipeline/active_xgb_model.joblib"

def run_eod_predictor():
    target_date = datetime.now().date()
    db_session = SessionLocal()
    
    logger.info(f"Starting EOD Predictor for {target_date}...")
    
    # 1. Load Model
    if not os.path.exists(MODEL_PATH):
        logger.error("XGBoost model not found. Retraining required before prediction.")
        return
        
    try:
        model = joblib.load(MODEL_PATH)
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return
        
    # 2. Fetch today's features
    feat_record = db_session.query(EngineeredFeaturesV2).filter(EngineeredFeaturesV2.date == target_date).first()
    
    if not feat_record or not feat_record.features_json:
        logger.error(f"No engineered features found for {target_date}.")
        return
        
    features_dict = json.loads(feat_record.features_json)
    features_df = pd.json_normalize(features_dict)
    features_df['sentiment_score'] = feat_record.sentiment_score if feat_record.sentiment_score else 0.0
    
    # Ensure columns match training (XGBoost requires consistent feature names)
    try:
        # 3. Predict Probability
        # output is array of shape (1, 4): [prob_crash, prob_down, prob_up, prob_boom]
        probs = model.predict_proba(features_df)[0]
        
        prob_crash = float(probs[0])
        prob_down = float(probs[1])
        prob_up = float(probs[2])
        prob_boom = float(probs[3])
        
        # 4. Generate Signal
        max_idx = np.argmax(probs)
        confidence = float(probs[max_idx])
        
        signals = {0: "SELL_CRASH", 1: "SELL_MILD", 2: "BUY_MILD", 3: "BUY_BOOM"}
        signal = signals[max_idx]
        
        # 5. Save to DB
        pred = V2Prediction(
            date=target_date,
            target_ticker="^NSEI",
            prob_crash=prob_crash,
            prob_down=prob_down,
            prob_up=prob_up,
            prob_boom=prob_boom,
            signal=signal,
            confidence=confidence
        )
        db_session.merge(pred)
        db_session.commit()
        
        logger.info(f"Prediction complete. Signal: {signal} (Conf: {confidence:.2f})")
        
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        db_session.rollback()
    
    db_session.close()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_eod_predictor()
