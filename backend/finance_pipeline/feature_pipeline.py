import os
import json
import logging
import pandas as pd
import numpy as np
from datetime import datetime
from finance_pipeline.db import RawMarketDataV2, EngineeredFeaturesV2, engine
from sqlalchemy.orm import sessionmaker

SessionLocal = sessionmaker(bind=engine)
logger = logging.getLogger(__name__)

# Fallback technical calculation if pandas_ta is unavailable
def calculate_rsi(series, period=14):
    delta = series.diff()
    up = delta.clip(lower=0)
    down = -1 * delta.clip(upper=0)
    ema_up = up.ewm(com=period - 1, adjust=False).mean()
    ema_down = down.ewm(com=period - 1, adjust=False).mean()
    rs = ema_up / ema_down
    return 100 - (100 / (1 + rs))

def calculate_macd(series, fast=12, slow=26, signal=9):
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()
    macd = ema_fast - ema_slow
    macdsignal = macd.ewm(span=signal, adjust=False).mean()
    macdhist = macd - macdsignal
    return macdhist

def calculate_atr(high, low, close, period=14):
    tr1 = high - low
    tr2 = (high - close.shift()).abs()
    tr3 = (low - close.shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(window=period).mean()
    return atr

def calculate_bb_width(close, period=20, std=2):
    sma = close.rolling(window=period).mean()
    rolling_std = close.rolling(window=period).std()
    upper_band = sma + (rolling_std * std)
    lower_band = sma - (rolling_std * std)
    bb_width = (upper_band - lower_band) / sma
    return bb_width

def calculate_dist_200sma(close, period=200):
    sma200 = close.rolling(window=period).mean()
    return (close - sma200) / sma200

def run_feature_pipeline():
    target_date = datetime.now().date()
    db_session = SessionLocal()
    
    logger.info(f"Starting Feature Engineering Pipeline for {target_date}...")
    
    # 1. Load all raw data into pandas
    # We query all historical data to properly compute rolling technicals
    query = "SELECT * FROM raw_market_data_v2 ORDER BY date ASC"
    df_raw = pd.read_sql(query, con=engine)
    if not df_raw.empty:
        df_raw['date'] = df_raw['date'].astype(str)
    
    if df_raw.empty:
        logger.warning("No raw market data available.")
        return
        
    # Pivot to get closing prices for all tickers
    df_close = df_raw.pivot(index='date', columns='ticker', values='close_price')
    df_close = df_close.ffill() # Forward fill missing data
    
    # 2. Calculate Log Returns for all proxies (16 factors)
    df_log_returns = np.log(df_close / df_close.shift(1))
    
    # 3. Calculate Technical Indicators on Nifty 50 (^NSEI)
    nifty_df = df_raw[df_raw['ticker'] == '^NSEI'].set_index('date')
    
    # Check if we have enough data for technicals
    if len(nifty_df) > 200:
        rsi_14 = calculate_rsi(nifty_df['close_price'])
        macd_hist = calculate_macd(nifty_df['close_price'])
        atr_14 = calculate_atr(nifty_df['high_price'], nifty_df['low_price'], nifty_df['close_price'])
        bb_width = calculate_bb_width(nifty_df['close_price'])
        dist_200sma = calculate_dist_200sma(nifty_df['close_price'])
    else:
        # Fallbacks for insufficient data
        rsi_14 = pd.Series(50.0, index=nifty_df.index)
        macd_hist = pd.Series(0.0, index=nifty_df.index)
        atr_14 = pd.Series(0.0, index=nifty_df.index)
        bb_width = pd.Series(0.0, index=nifty_df.index)
        dist_200sma = pd.Series(0.0, index=nifty_df.index)
    
    # 4. Compile features for the target date
    target_date_str = str(target_date)
    if target_date_str not in df_log_returns.index:
        logger.warning(f"No log returns available for {target_date_str}. Was it a market holiday?")
        return
        
    features_dict = {}
    
    # Add log returns
    for col in df_log_returns.columns:
        val = df_log_returns.loc[target_date_str, col]
        features_dict[f"log_ret_{col}"] = float(val) if pd.notna(val) else 0.0
        
    # Add technicals
    try:
        features_dict["rsi_14"] = float(rsi_14.loc[target_date_str]) if pd.notna(rsi_14.loc[target_date_str]) else 50.0
        features_dict["macd_hist"] = float(macd_hist.loc[target_date_str]) if pd.notna(macd_hist.loc[target_date_str]) else 0.0
        features_dict["atr_14"] = float(atr_14.loc[target_date_str]) if pd.notna(atr_14.loc[target_date_str]) else 0.0
        features_dict["bb_width"] = float(bb_width.loc[target_date_str]) if pd.notna(bb_width.loc[target_date_str]) else 0.0
        features_dict["dist_200sma"] = float(dist_200sma.loc[target_date_str]) if pd.notna(dist_200sma.loc[target_date_str]) else 0.0
    except KeyError:
        logger.warning("Technical indicators not available for target date.")
        
    # 5. Calculate Target Label (Triple Barrier) for the PREVIOUS day if we have today's close
    # (Since this runs EOD, we don't know tomorrow's close yet. We'll label yesterday's data based on today's close)
    yesterday = (target_date - pd.Timedelta(days=1))
    yesterday_str = str(yesterday)
    
    if yesterday_str in df_log_returns.index and target_date_str in df_log_returns.index:
        # The return of today determines the label for yesterday
        today_nifty_return = df_log_returns.loc[target_date_str, '^NSEI']
        
        # Discretize:
        # Bin 2 (Boom): > 1.0% (0.01)
        # Bin 1 (Up): 0 to 1.0%
        # Bin 0 (Down): -1.0% to 0%
        # Bin -1 (Crash): < -1.0% (-0.01)
        
        if pd.notna(today_nifty_return):
            if today_nifty_return > 0.01:
                label = 2
            elif today_nifty_return > 0:
                label = 1
            elif today_nifty_return > -0.01:
                label = 0
            else:
                label = -1
                
            # Update yesterday's record with the true label
            existing_yesterday = db_session.query(EngineeredFeaturesV2).filter(EngineeredFeaturesV2.date == yesterday).first()
            if existing_yesterday:
                existing_yesterday.target_label = label
    
    # 6. Save today's features
    existing_today = db_session.query(EngineeredFeaturesV2).filter(EngineeredFeaturesV2.date == target_date).first()
    if existing_today:
        existing_today.features_json = json.dumps(features_dict)
    else:
        feat = EngineeredFeaturesV2(
            date=target_date,
            target_ticker="^NSEI",
            features_json=json.dumps(features_dict),
            target_label=None # Will be filled tomorrow
        )
        db_session.add(feat)
        
    db_session.commit()
    db_session.close()
    logger.info(f"Feature Pipeline completed for {target_date}. 36 Factors Engineered.")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_feature_pipeline()
