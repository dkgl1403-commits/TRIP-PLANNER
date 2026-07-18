import os
import yfinance as yf
from datetime import datetime, timedelta
from finance_pipeline.db import RawMarketDataV2, EngineeredFeaturesV2, engine
from sqlalchemy.orm import sessionmaker
import logging

try:
    from transformers import pipeline
    finbert = pipeline("text-classification", model="ProsusAI/finbert", tokenizer="ProsusAI/finbert")
    FINBERT_AVAILABLE = True
except ImportError:
    FINBERT_AVAILABLE = False
    logging.warning("FinBERT not installed. Sentiment score will be default 0.0.")

SessionLocal = sessionmaker(bind=engine)
logger = logging.getLogger(__name__)

PROXY_TICKERS = {
    "^NSEI": "Nifty 50",
    "^BSESN": "BSE Sensex",
    "RELIANCE.NS": "Reliance",
    "HDFCBANK.NS": "HDFC Bank",
    "ICICIBANK.NS": "ICICI Bank",
    "INFY.NS": "Infosys",
    "^INDIAVIX": "India VIX",
    "^GSPC": "S&P 500",
    "^NSEBANK": "Nifty Bank",
    "^CNXIT": "Nifty IT",
    "^CNXAUTO": "Nifty Auto",
    "^CNXMETAL": "Nifty Metal",
    "^TNX": "US 10-Year Yield",
    "DX-Y.NYB": "Dollar Index",
    "CL=F": "Crude Oil",
    "HG=F": "Copper",
    "GC=F": "Gold"
}

def fetch_market_data(db_session, target_date):
    """Fetches EOD data for proxy tickers and saves to DB."""
    for ticker, name in PROXY_TICKERS.items():
        try:
            # yf.download gives a dataframe
            df = yf.download(ticker, start=target_date, end=target_date + timedelta(days=1), progress=False)
            if not df.empty:
                row = df.iloc[0]
                # Handle MultiIndex columns that yfinance sometimes returns
                open_val = float(row['Open'].iloc[0]) if isinstance(row['Open'], (list, tuple, type(df))) else float(row['Open'])
                high_val = float(row['High'].iloc[0]) if isinstance(row['High'], (list, tuple, type(df))) else float(row['High'])
                low_val = float(row['Low'].iloc[0]) if isinstance(row['Low'], (list, tuple, type(df))) else float(row['Low'])
                close_val = float(row['Close'].iloc[0]) if isinstance(row['Close'], (list, tuple, type(df))) else float(row['Close'])
                vol_val = int(row['Volume'].iloc[0]) if isinstance(row['Volume'], (list, tuple, type(df))) else int(row['Volume'])
                
                market_data = RawMarketDataV2(
                    date=target_date.date(),
                    ticker=ticker,
                    open_price=open_val,
                    high_price=high_val,
                    low_price=low_val,
                    close_price=close_val,
                    volume=vol_val
                )
                db_session.add(market_data)
                db_session.commit()
        except Exception as e:
            logger.error(f"Error fetching data for {ticker}: {e}")
            db_session.rollback()

def get_sentiment_score(headlines):
    if not FINBERT_AVAILABLE or not headlines:
        return 0.0
    
    # Process through FinBERT
    # Returns list of dicts: [{'label': 'positive', 'score': 0.8}, ...]
    results = finbert(headlines)
    
    pos_sum = sum(res['score'] for res in results if res['label'] == 'positive')
    neg_sum = sum(res['score'] for res in results if res['label'] == 'negative')
    
    total = len(headlines)
    if total == 0:
        return 0.0
        
    sentiment = (pos_sum - neg_sum) / total
    return max(-1.0, min(1.0, sentiment)) # Bound between -1 and 1

def run_daily_ingestion():
    # EOD process generally runs for 'today'
    target_date = datetime.now()
    db_session = SessionLocal()
    
    logger.info(f"Starting EOD ingestion for {target_date.date()}...")
    fetch_market_data(db_session, target_date)
    
    # Fetch some news for Core Heavyweights to compute sentiment
    core_tickers = ["^NSEI", "RELIANCE.NS", "HDFCBANK.NS"]
    all_headlines = []
    
    for ticker in core_tickers:
        try:
            t = yf.Ticker(ticker)
            news = t.news
            for item in news:
                title = item.get('title', '')
                if title:
                    all_headlines.append(title)
        except Exception as e:
            logger.error(f"Failed to fetch news for {ticker}: {e}")
            
    # Calculate mathematically strict sentiment
    sentiment_score = get_sentiment_score(all_headlines)
    logger.info(f"Calculated FinBERT sentiment: {sentiment_score:.4f} from {len(all_headlines)} headlines.")
    
    # Store sentiment score placeholder in engineered features
    # Feature pipeline will fill the rest later
    try:
        feat = EngineeredFeaturesV2(
            date=target_date.date(),
            sentiment_score=sentiment_score
        )
        # using merge to handle if it already exists
        db_session.merge(feat)
        db_session.commit()
    except Exception as e:
        logger.error(f"Error saving sentiment feature: {e}")
        db_session.rollback()
        
    db_session.close()
    logger.info("Daily Ingestion Complete.")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_daily_ingestion()
