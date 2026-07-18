import time
import requests
from datetime import datetime, timedelta
from finance_pipeline.db import SessionLocal, RawMarketDataV2

def seed_real_v2_history(days=150):
    db = SessionLocal()
    try:
        db.query(RawMarketDataV2).delete()
        
        tickers = [
            "^NSEI", "RELIANCE.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS",
            "^INDIAVIX", "^GSPC", "^NSEBANK", "^CNXIT", "^CNXAUTO", "^CNXMETAL",
            "^TNX", "DX-Y.NYB", "CL=F", "HG=F", "GC=F"
        ]
        
        for ticker in tickers:
            print(f"Fetching real history for {ticker}...")
            url = f"https://query2.finance.yahoo.com/v8/finance/chart/{ticker}?range={days}d&interval=1d"
            res = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
            data = res.json()
            
            if 'chart' in data and data['chart']['result']:
                result = data['chart']['result'][0]
                timestamps = result.get('timestamp', [])
                if 'indicators' in result and 'quote' in result['indicators']:
                    quote = result['indicators']['quote'][0]
                    
                    for i, ts in enumerate(timestamps):
                        if i < len(quote.get('open', [])):
                            if quote['open'][i] is not None and quote['close'][i] is not None:
                                current_date = datetime.fromtimestamp(ts).date()
                                record = RawMarketDataV2(
                                    date=current_date,
                                    ticker=ticker,
                                    open_price=float(quote['open'][i]),
                                    high_price=float(quote['high'][i]),
                                    low_price=float(quote['low'][i]),
                                    close_price=float(quote['close'][i]),
                                    volume=int(quote['volume'][i])
                                )
                                db.add(record)
            time.sleep(1)
            
        db.commit()
        print("Successfully generated real history for V2!")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    seed_real_v2_history()
