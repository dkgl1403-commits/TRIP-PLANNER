import yfinance as yf
from datetime import datetime, timedelta
from finance_pipeline.db import SessionLocal, RawMarketDataV2
import time

def seed_history():
    db = SessionLocal()
    try:
        db.query(RawMarketDataV2).delete()
        
        tickers = [
            "^NSEI", "^BSESN", "RELIANCE.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS",
            "^INDIAVIX", "^GSPC", "^NSEBANK", "^CNXIT", "^CNXAUTO", "^CNXMETAL",
            "^TNX", "DX-Y.NYB", "CL=F", "HG=F", "GC=F"
        ]
        
        start_date = datetime.now() - timedelta(days=150)
        
        for ticker in tickers:
            print(f"Fetching yfinance history for {ticker}...")
            try:
                df = yf.download(ticker, start=start_date, progress=False)
                for index, row in df.iterrows():
                    # Check for NaN values which can sometimes be returned
                    if not row.isnull().values.any():
                        open_val = float(row['Open'].iloc[0]) if isinstance(row['Open'], (list, tuple, type(df))) else float(row['Open'])
                        high_val = float(row['High'].iloc[0]) if isinstance(row['High'], (list, tuple, type(df))) else float(row['High'])
                        low_val = float(row['Low'].iloc[0]) if isinstance(row['Low'], (list, tuple, type(df))) else float(row['Low'])
                        close_val = float(row['Close'].iloc[0]) if isinstance(row['Close'], (list, tuple, type(df))) else float(row['Close'])
                        vol_val = int(row['Volume'].iloc[0]) if isinstance(row['Volume'], (list, tuple, type(df))) else int(row['Volume'])
                        
                        record = RawMarketDataV2(
                            date=index.date(),
                            ticker=ticker,
                            open_price=open_val,
                            high_price=high_val,
                            low_price=low_val,
                            close_price=close_val,
                            volume=vol_val
                        )
                        db.add(record)
            except Exception as e:
                print(f"Error fetching {ticker}: {e}")
            time.sleep(1)
            
        db.commit()
        print("Successfully generated real history using yfinance!")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    seed_history()
