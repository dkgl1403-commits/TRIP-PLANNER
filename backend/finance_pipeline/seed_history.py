import requests
from finance_pipeline.db import SessionLocal, MarketIndexHistory
import pandas as pd
from datetime import datetime, timedelta

def seed_market_history(days=90):
    db = SessionLocal()
    try:
        db.query(MarketIndexHistory).delete()
        
        def fetch_history(ticker, name):
            url = f"https://query2.finance.yahoo.com/v8/finance/chart/{ticker}?range={days}d&interval=1d"
            res = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}).json()
            result = res['chart']['result'][0]
            timestamps = result['timestamp']
            quote = result['indicators']['quote'][0]
            
            for i, ts in enumerate(timestamps):
                if quote['open'][i] is not None and quote['close'][i] is not None:
                    record = MarketIndexHistory(
                        date=datetime.fromtimestamp(ts).date(),
                        index_name=name,
                        open_price=float(quote['open'][i]),
                        close_price=float(quote['close'][i])
                    )
                    db.add(record)
                    
        fetch_history('^NSEI', 'NIFTY50')
        fetch_history('^BSESN', 'SENSEX')
        
        db.commit()
        print(f"Successfully seeded {days} days of market history for NIFTY50 and SENSEX.")
    except Exception as e:
        print(f"Failed to seed market history: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    seed_market_history()
