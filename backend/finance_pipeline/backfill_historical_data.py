import os
import json
import time
import pandas as pd
from datetime import datetime
from finance_pipeline.utils import get_ist_now
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from finance_pipeline.db import FinanceNewsEvent, HistoricalBackfillStatus, FinancePrediction

# Load environment variables
load_dotenv('../.env')

# Setup Gemini

import requests
def generate_content(prompt):
    api_key = os.environ.get("GEMINI_API_KEY_FINANCE", os.environ.get("FINANCE_GEMINI_API_KEY", os.environ.get("GEMINI_API_KEY", "")))
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.1}
    }
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    result = response.json()
    try:
        return result['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError) as e:
        print(f"Error parsing Gemini response: {result}")
        raise e


# Setup Database
DATABASE_URL = os.environ.get('FINANCE_DATABASE_URL', 'sqlite:///./finance_local.db')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_ontology():
    return """
1. Domestic Macroeconomic Factors (India)
- dom_rbi_rate_hike, dom_rbi_rate_cut, dom_inflation_surge, dom_inflation_drop, dom_gdp_growth_beat, dom_gdp_growth_miss, dom_monsoon_surplus, dom_monsoon_deficit, dom_gst_collection_record, dom_rupee_depreciation, dom_rupee_appreciation, dom_fpi_inflow, dom_fpi_outflow
2. International Macroeconomic Factors
- intl_us_fed_rate_hike, intl_us_fed_rate_cut, intl_us_inflation_data, intl_china_slowdown, intl_china_stimulus, intl_ecb_rate_change, intl_boj_rate_change
3. Geopolitics & Commodities
- geo_middle_east_conflict, geo_russia_ukraine_escalation, geo_us_china_trade_war, geo_india_border_tension, com_crude_oil_surge, com_crude_oil_crash, com_gold_price_surge, com_metal_price_surge
4. Sector-Specific Corporate Events
- sec_it_earnings_beat, sec_it_guidance_cut, sec_bank_npa_rise, sec_bank_credit_growth, sec_auto_sales_jump, sec_fmcg_margin_squeeze, sec_pharma_fda_approval, sec_pharma_fda_warning
5. Regulatory & Political
- pol_stable_govt_mandate, pol_hung_assembly, reg_sebi_tightening, reg_govt_capex_boost, reg_fdi_limit_increase
"""

def process_single_day(target_date, articles):
    db = SessionLocal()
    try:
        # Check if already processed
        status = db.query(HistoricalBackfillStatus).filter(HistoricalBackfillStatus.date == datetime.strptime(target_date, "%Y-%m-%d").date()).first()
        if status and status.status == 'COMPLETED':
            print(f"Date {target_date} already processed.")
            return True

        print(f"Processing {len(articles)} articles for {target_date}...")
        
        prompt = f"""
        Analyze the following financial news headlines for the date {target_date}.
        
        Headlines:
        """
        for a in articles:
            prompt += f"- {a['title']}: {a['description']}\n"
            
        prompt += f"""
        
        Using the following exact ontology of macroeconomic factors:
        {get_ontology()}
        
        Return a JSON object where the keys are ONLY the exact factor names from the ontology above, and the value is 1 if the event is reported/active today, and 0 otherwise. Include a key for every single factor.
        Example: {{"dom_rbi_rate_hike": 1, "com_crude_oil_surge": 0, ...}}
        """
        
        response_text = generate_content(prompt).strip().replace('```json', '').replace('```', '')
        factors = json.loads(response_text)
        
        # Check if any factor is actually active (1)
        has_active_factors = any(value == 1 for value in factors.values())
        
        if has_active_factors:
            # Save to FinanceNewsEvent
            news_event = FinanceNewsEvent(
                published_at=datetime.strptime(target_date, "%Y-%m-%d"),
                headline=f"Historical Batch for {target_date}",
                extracted_factors=factors
            )
            db.add(news_event)
            print(f"Active factors found for {target_date}. Event stored.")
        else:
            print(f"No active macro factors for {target_date}. Skipping storage.")
        
        # Mark as completed
        new_status = HistoricalBackfillStatus(date=datetime.strptime(target_date, "%Y-%m-%d").date(), status='COMPLETED')
        if status:
            status.status = 'COMPLETED'
            status.processed_at = get_ist_now()
        else:
            db.add(new_status)
            
        db.commit()
        print(f"Successfully processed and saved {target_date}.")
        return True
    except Exception as e:
        print(f"Error processing {target_date}: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def run_backfill(num_days=1):
    # Load CSV using OS agnostic path
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, '..', '..', 'Data', 'IndianFinancialNews.csv')
    
    if not os.path.exists(csv_path):
        print(f"Error: Historical CSV not found at {csv_path}")
        return
        
    df = pd.read_csv(csv_path)
    
    # Clean date format from "May 26, 2020, Tuesday" to "2020-05-26"
    df['Date'] = pd.to_datetime(df['Date'], format="%B %d, %Y, %A", errors='coerce')
    df = df.dropna(subset=['Date'])
    df['DateStr'] = df['Date'].dt.strftime('%Y-%m-%d')
    
    unique_dates = df['DateStr'].unique()
    # Sort descending
    unique_dates = sorted(unique_dates, reverse=True)
    
    db = SessionLocal()
    completed_dates = [s.date.strftime('%Y-%m-%d') for s in db.query(HistoricalBackfillStatus).filter(HistoricalBackfillStatus.status == 'COMPLETED').all()]
    db.close()
    
    processed_count = 0
    for target_date in unique_dates:
        if target_date in completed_dates:
            continue
            
        # Get top 20 articles for this day
        day_df = df[df['DateStr'] == target_date].head(20)
        articles = [{'title': row['Title'], 'description': row['Description']} for _, row in day_df.iterrows()]
        
        success = process_single_day(target_date, articles)
        if success:
            processed_count += 1
            if processed_count >= num_days:
                break
        else:
            print(f"Failed to process {target_date}, stopping backfill batch to prevent rate limit looping.")
            break
        
        # Rate limiting pause if processing multiple days
        if processed_count < num_days:
            time.sleep(5)

if __name__ == "__main__":
    print("Starting Historical Backfill Test (1 Day)...")
    run_backfill(num_days=1)
