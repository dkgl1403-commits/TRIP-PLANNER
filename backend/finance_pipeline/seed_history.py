import yfinance as yf
from finance_pipeline.db import SessionLocal, MarketIndexHistory
import pandas as pd

def seed_market_history(days=90):
    db = SessionLocal()
    try:
        # Clear existing to be safe
        db.query(MarketIndexHistory).delete()
        
        # Fetch NIFTY 50
        nifty = yf.Ticker("^NSEI")
        nifty_data = nifty.history(period=f"{days}d")
        for date, row in nifty_data.iterrows():
            record = MarketIndexHistory(
                date=date.date(),
                index_name='NIFTY50',
                open_price=float(row['Open']),
                close_price=float(row['Close'])
            )
            db.add(record)
            
        # Fetch SENSEX
        sensex = yf.Ticker("^BSESN")
        sensex_data = sensex.history(period=f"{days}d")
        for date, row in sensex_data.iterrows():
            record = MarketIndexHistory(
                date=date.date(),
                index_name='SENSEX',
                open_price=float(row['Open']),
                close_price=float(row['Close'])
            )
            db.add(record)
            
        db.commit()
        print(f"Successfully seeded {days} days of market history for NIFTY50 and SENSEX.")
    except Exception as e:
        print(f"Failed to seed market history: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_market_history()
