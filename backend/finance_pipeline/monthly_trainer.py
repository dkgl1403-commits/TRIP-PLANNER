import os
import json
import logging
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
from sklearn.model_selection import TimeSeriesSplit
from xgboost import XGBClassifier
from backend.finance_pipeline.db import EngineeredFeaturesV2, engine
from sqlalchemy.orm import sessionmaker

SessionLocal = sessionmaker(bind=engine)
logger = logging.getLogger(__name__)

MODEL_PATH = "backend/finance_pipeline/active_xgb_model.joblib"

def run_monthly_training():
    db_session = SessionLocal()
    logger.info("Starting XGBoost Walk-Forward Retraining...")
    
    # Fetch all engineered features where target_label is not null
    query = "SELECT * FROM engineered_features_v2 WHERE target_label IS NOT NULL ORDER BY date ASC"
    df = pd.read_sql(query, con=engine)
    
    if len(df) < 50:
        logger.warning("Not enough historical data to train the model (< 50 rows).")
        return
        
    # Unpack JSON features into columns
    features_df = pd.json_normalize(df['features_json'].apply(json.loads))
    features_df['sentiment_score'] = df['sentiment_score'].fillna(0.0)
    
    X = features_df
    # Classes: -1, 0, 1, 2. XGBoost expects 0, 1, 2, 3 for multi:softprob. 
    # Shift labels by +1: (-1 -> 0), (0 -> 1), (1 -> 2), (2 -> 3)
    y = df['target_label'] + 1 
    
    # TimeSeriesSplit for Walk-Forward Validation
    # We test on the last 30 days
    tscv = TimeSeriesSplit(n_splits=3, test_size=min(30, len(X)//5))
    
    model = XGBClassifier(
        objective='multi:softprob',
        num_class=4,
        eval_metric='mlogloss',
        use_label_encoder=False,
        random_state=42,
        n_estimators=100,
        max_depth=4,
        learning_rate=0.05
    )
    
    # Train on full dataset up to previous month (in practice, we just train on everything up to yesterday)
    # The split validates it.
    for train_index, test_index in tscv.split(X):
        X_train, X_test = X.iloc[train_index], X.iloc[test_index]
        y_train, y_test = y.iloc[train_index], y.iloc[test_index]
        
        # Fit model
        model.fit(X_train, y_train)
        
        # Evaluate
        preds = model.predict(X_test)
        acc = (preds == y_test).mean()
        logger.info(f"OOS Validation Split Accuracy: {acc:.2f}")
    
    # Final full retrain
    model.fit(X, y)
    
    # Save Model
    joblib.dump(model, MODEL_PATH)
    logger.info(f"XGBoost Model saved to {MODEL_PATH}")
    db_session.close()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_monthly_training()
