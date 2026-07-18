import random
from datetime import datetime, timedelta
from finance_pipeline.db import SessionLocal, RawMarketDataV2

def seed_v2_history():
    db = SessionLocal()
    try:
        db.query(RawMarketDataV2).delete()
        
        start_date = datetime.now() - timedelta(days=100)
        
        def generate_mock(ticker, start_price):
            price = start_price
            for i in range(101):
                current_date = start_date + timedelta(days=i)
                # skip weekends
                if current_date.weekday() > 4:
                    continue
                
                change = random.uniform(-0.02, 0.02)
                open_price = price
                close_price = price * (1 + change)
                high_price = max(open_price, close_price) * (1 + random.uniform(0, 0.01))
                low_price = min(open_price, close_price) * (1 - random.uniform(0, 0.01))
                volume = int(random.uniform(1000000, 5000000))
                
                record = RawMarketDataV2(
                    date=current_date.date(),
                    ticker=ticker,
                    open_price=open_price,
                    high_price=high_price,
                    low_price=low_price,
                    close_price=close_price,
                    volume=volume
                )
                db.add(record)
                price = close_price

        # The V2 pipeline uses ^NSEI as primary and ^GSPC / ^INDIAVIX / etc as proxies
        # Let's generate for all proxy tickers needed by feature_pipeline
        tickers = [
            "^NSEI", "RELIANCE.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS",
            "^INDIAVIX", "^GSPC", "^NSEBANK", "^CNXIT", "^CNXAUTO", "^CNXMETAL",
            "^TNX", "DX-Y.NYB", "CL=F", "HG=F", "GC=F"
        ]
        
        for t in tickers:
            generate_mock(t, 20000 if 'NSEI' in t else 100)
            
        db.commit()
        print("Successfully generated 100 days of mock RawMarketDataV2")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    seed_v2_history()
