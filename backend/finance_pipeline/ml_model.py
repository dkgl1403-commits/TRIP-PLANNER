import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import yfinance as yf
from sklearn.linear_model import Ridge
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from finance_pipeline.db import FinanceNewsEvent, FinanceFactor, SessionLocal, FinancePrediction
from dotenv import load_dotenv

load_dotenv('../.env')

DATABASE_URL = os.environ.get('FINANCE_DATABASE_URL', 'sqlite:///./finance_local.db')
engine = create_engine(DATABASE_URL)

def train_causal_model():
    print("[ML Engine] Starting Causal ML Training...")
    db = SessionLocal()
    try:
        # 1. Fetch all historical tagged events
        events = db.query(FinanceNewsEvent).all()
        if not events:
            print("No historical events found. Skipping training.")
            return

        # 2. Build the Matrix (X)
        records = []
        for event in events:
            row = {'date': event.published_at.date()}
            # Flatten factors into columns
            factors = event.extracted_factors if event.extracted_factors else {}
            if isinstance(factors, list):
                for f in factors:
                    if 'factor_name' in f and 'confidence_score' in f:
                        row[f['factor_name']] = float(f['confidence_score'])
            elif isinstance(factors, dict):
                for k, v in factors.items():
                    row[k] = float(v)
            records.append(row)
            
        df_x = pd.DataFrame(records)
        if df_x.empty:
            print("No valid factor data. Skipping.")
            return
            
        # Group by date in case of multiple batches per day, taking max to preserve 1s
        df_x = df_x.groupby('date').max().reset_index()
        
        # 3. Fetch Historical Market Data (Y)
        start_date = df_x['date'].min() - timedelta(days=5)
        end_date = df_x['date'].max() + timedelta(days=5)
        
        print(f"Fetching NIFTY 50 data from {start_date} to {end_date}...")
        nifty = yf.Ticker("^NSEI")
        market_data = nifty.history(start=start_date, end=end_date)
        
        if market_data.empty:
            print("Failed to fetch market data.")
            return
            
        # Calculate daily percentage change
        market_data['pct_change'] = market_data['Close'].pct_change() * 100
        market_data['date'] = market_data.index.date
        df_y = market_data[['date', 'pct_change']].dropna()
        
        # 4. Merge X and Y
        merged = pd.merge(df_x, df_y, on='date', how='inner')
        if len(merged) < 2:
            print("Not enough overlapping data points to run regression.")
            return
            
        print(f"Running regression on {len(merged)} data points...")
        
        X = merged.drop(columns=['date', 'pct_change'])
        X.fillna(0, inplace=True)
        y = merged['pct_change']
        
        # 5. Run Regression (Ridge to prevent overfitting on sparse data)
        model = Ridge(alpha=1.0)
        model.fit(X, y)
        
        # 6. Extract Coefficients (Betas)
        coefficients = dict(zip(X.columns, model.coef_))
        
        # 7. Update Database Factors
        for factor_name, weight in coefficients.items():
            # Find or create factor
            db_factor = db.query(FinanceFactor).filter(FinanceFactor.factor_name == factor_name).first()
            if not db_factor:
                # Try to infer some metadata from the prefix
                category = "General"
                if factor_name.startswith("dom_"): category = "Domestic Macro"
                elif factor_name.startswith("intl_"): category = "International Macro"
                elif factor_name.startswith("geo_") or factor_name.startswith("com_"): category = "Geopolitics & Commodities"
                elif factor_name.startswith("sec_"): category = "Sector Specific"
                elif factor_name.startswith("pol_") or factor_name.startswith("reg_"): category = "Regulatory & Political"
                
                db_factor = FinanceFactor(
                    domain="India" if "dom_" in factor_name else "Global",
                    geography="Various",
                    event_category=category,
                    sector_impacted="Broad Market",
                    company_size="All",
                    factor_name=factor_name,
                    impact_weight=float(weight),
                    confidence_score=1.0 # Mathematically derived
                )
                db.add(db_factor)
            else:
                db_factor.impact_weight = float(weight)
                db_factor.confidence_score = 1.0
                
        db.commit()
        print("[ML Engine] Successfully recalibrated market weights.")
        
    except Exception as e:
        print(f"ML Training Failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    train_causal_model()
