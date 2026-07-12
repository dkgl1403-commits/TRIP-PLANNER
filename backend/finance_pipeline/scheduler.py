import os
import requests
import json
from datetime import datetime, timedelta, time as dtime
from finance_pipeline.utils import get_ist_now
from apscheduler.schedulers.background import BackgroundScheduler
from finance_pipeline.db import SessionLocal, FinanceFactor, FinanceNewsEvent, FinancePrediction, SystemJobStatus
import time


import requests
def generate_content_gemini(prompt):
    api_key = os.environ.get("GEMINI_API_KEY_FINANCE", os.environ.get("FINANCE_GEMINI_API_KEY", os.environ.get("GEMINI_API_KEY", "")))
    if not api_key:
        raise ValueError("No Gemini API Key found in environment.")
    
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


# Module-level constants — built once, reused everywhere
ONTOLOGY_KEYS = [
    "dom_rbi_rate_hike", "dom_rbi_rate_cut", "dom_inflation_surge", "dom_inflation_drop",
    "dom_gdp_growth_beat", "dom_gdp_growth_miss", "dom_monsoon_surplus", "dom_monsoon_deficit",
    "dom_gst_collection_record", "dom_rupee_depreciation", "dom_rupee_appreciation",
    "dom_fpi_inflow", "dom_fpi_outflow", "dom_union_budget_announcement",
    "dom_black_swan_health_crisis", "dom_ipo_boom_liquidity", "dom_mega_merger_acquisition",
    "dom_corporate_default_scandal",
    "intl_us_fed_rate_hike", "intl_us_fed_rate_cut", "intl_us_inflation_data",
    "intl_china_slowdown", "intl_china_stimulus", "intl_ecb_rate_change", "intl_boj_rate_change",
    "geo_middle_east_conflict", "geo_russia_ukraine_escalation", "geo_us_china_trade_war",
    "geo_india_border_tension", "geo_exogenous_shock",
    "com_crude_oil_surge", "com_crude_oil_crash", "com_gold_price_surge", "com_metal_price_surge",
    "sec_it_earnings_beat", "sec_it_guidance_cut", "sec_bank_npa_rise", "sec_bank_credit_growth",
    "sec_auto_sales_jump", "sec_fmcg_margin_squeeze", "sec_pharma_fda_approval",
    "sec_pharma_fda_warning", "sec_infra_real_estate_boom", "sec_energy_power_surge",
    "pol_stable_govt_mandate", "pol_hung_assembly", "reg_sebi_tightening",
    "reg_govt_capex_boost", "reg_fdi_limit_increase"
]
# Compact comma-separated string for prompt — much shorter than full ontology text
ONTOLOGY_NAMES = ", ".join(ONTOLOGY_KEYS)

def get_ontology():
    return ONTOLOGY_NAMES

from functools import wraps

def track_job(job_name):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            db = SessionLocal()
            try:
                record = db.query(SystemJobStatus).filter(SystemJobStatus.job_name == job_name).first()
                if not record:
                    record = SystemJobStatus(job_name=job_name)
                    db.add(record)
                record.status = "RUNNING"
                record.last_run_at = get_ist_now()
                db.commit()
                
                result = func(*args, **kwargs)
                
                record.status = "SUCCESS"
                record.last_finished_at = get_ist_now()
                record.error_message = None
                if isinstance(result, str):
                    record.last_run_summary = result
                db.commit()
                return result
            except Exception as e:
                record = db.query(SystemJobStatus).filter(SystemJobStatus.job_name == job_name).first()
                if record:
                    record.status = "FAILED"
                    record.last_finished_at = get_ist_now()
                    record.error_message = str(e)
                    db.commit()
                raise e
            finally:
                db.close()
        return wrapper
    return decorator

@track_job("Fetch Financial News")
def fetch_financial_news():
    print("[Finance Pipeline] Running Hourly News Fetcher...")
    
    # Skip if Ollama is unavailable
    try:
        ollama_check = requests.get("http://localhost:11434/api/tags", timeout=5)
        ollama_check.raise_for_status()
    except Exception as e:
        print(f"Ollama is not available. Skipping Fetch Financial News job: {e}")
        return "SKIPPED: Ollama unavailable"
    
    api_key = os.environ.get("NEWS_API_KEY")
    if not api_key:
        print("NEWS_API_KEY not found.")
        return

    url = f"https://newsapi.org/v2/everything?q=finance OR economy OR market AND India&language=en&sortBy=publishedAt&apiKey={api_key}"
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch news: {response.status_code}")
        return
        
    data = response.json()
    articles = data.get("articles", [])
    if not articles:
        print("No new articles found.")
        return
        
    print(f"Found {len(articles)} articles from API. Filtering...")
    
    FINANCE_KEYWORDS = [
        'rbi', 'inflation', 'gdp', 'monsoon', 'gst', 'rupee', 'fpi', 'budget', 'ipo', 
        'fed', 'china', 'ecb', 'boj', 'middle east', 'russia', 'ukraine', 'trade war', 
        'crude oil', 'gold', 'metal', 'earnings', 'npa', 'credit', 'sales', 'margin', 
        'fda', 'infra', 'real estate', 'energy', 'sebi', 'capex', 'fdi', 'market', 
        'stock', 'share', 'economy', 'financial', 'bank', 'nifty', 'sensex'
    ]
    
    db = SessionLocal()
    new_relevant_articles = []
    try:
        for article in articles:
            # Check if it already exists in DB
            existing = db.query(FinanceNewsEvent).filter(FinanceNewsEvent.headline == article['title']).first()
            if existing:
                continue
                
            # Pre-filter by checking if headline contains any finance keyword
            headline_lower = article['title'].lower()
            if any(keyword in headline_lower for keyword in FINANCE_KEYWORDS):
                new_relevant_articles.append(article)
                
            if len(new_relevant_articles) >= 10:
                break
    finally:
        db.close()
    
    if not new_relevant_articles:
        print("No new relevant articles found to process.")
        return "0 created / 0 ignored"
        
    print(f"Processing 1 batch of {len(new_relevant_articles)} new relevant articles...")
    
    created, ignored = process_news_chunk(new_relevant_articles)
        
    return f"{created} created / {ignored} ignored"

def generate_content_ollama(prompt):
    import requests
    url = "http://localhost:11434/api/generate"
    headers = {"Content-Type": "application/json"}
    data = {
        "model": "phi3",
        "prompt": prompt,
        "format": "json",
        "stream": False,
        "options": {
            "temperature": 0.1
        }
    }
    # 90s safety timeout — fires only if Ollama truly hangs, not for slow-but-working responses
    response = requests.post(url, headers=headers, json=data, timeout=90)
    response.raise_for_status()
    result = response.json()
    try:
        return result['response']
    except (KeyError, IndexError) as e:
        print(f"Error parsing Ollama response: {result}")
        raise e

def generate_content(prompt):
    """Try Gemini first. Fall back to Ollama if Gemini fails."""
    try:
        return generate_content_gemini(prompt)
    except Exception as e:
        print(f"Gemini failed ({e}), falling back to Ollama...")
        return generate_content_ollama(prompt)

def process_news_chunk(articles):
    db = SessionLocal()
    created = 0
    ignored = 0
    try:
        for article in articles:
            # DB existence check is now done in the outer loop, but kept here for safety
            existing = db.query(FinanceNewsEvent).filter(FinanceNewsEvent.headline == article['title']).first()
            if existing:
                continue

            # Skip articles with no useful description — avoids wasting Phi-3 time on blanks
            desc = (article.get('description') or '').strip()
            if not desc or desc == '[Removed]':
                print(f"Skipping article with no description: {article.get('title', '?')}")
                ignored += 1
                continue

            # Use compact factor names only (not full verbose ontology text)
            prompt = f"""Analyze this financial news and identify active macroeconomic factors.
Headline: {article['title']}
Description: {desc}

Return a JSON array of ONLY the matching factor names from this list:
{ONTOLOGY_NAMES}

Example: ["dom_rbi_rate_hike", "com_crude_oil_surge"]
If nothing matches, return: []"""
            
            try:
                response_text = generate_content(prompt).strip().replace('```json', '').replace('```', '')
                active_list = json.loads(response_text)
                
                ontology_keys = ONTOLOGY_KEYS  # Use the module-level constant
                
                factors = {k: 0 for k in ontology_keys}
                has_active_factors = False
                
                if isinstance(active_list, list):
                    for k in active_list:
                        if k in factors:
                            factors[k] = 1
                            has_active_factors = True
                elif isinstance(active_list, dict):
                    for k, v in active_list.items():
                        if k in factors and v == 1:
                            factors[k] = 1
                            has_active_factors = True
                
                if has_active_factors:
                    news_event = FinanceNewsEvent(
                        published_at=datetime.strptime(article['publishedAt'], "%Y-%m-%dT%H:%M:%SZ"),
                        headline=article['title'],
                        extracted_factors=factors
                    )
                    db.add(news_event)
                    db.commit()
                    created += 1
                    print(f"Processed and stored active event: {article['title']}")
                else:
                    ignored += 1
                    print(f"Ignored noise: {article['title']}")
                
            except Exception as e:
                db.rollback()
                print(f"AI Processing error for article '{article.get('title', '?')}': {e}. Skipping article.")
                ignored += 1
                continue
    finally:
        db.close()
    return created, ignored

@track_job("Daily Prediction Job")
def daily_prediction_job():
    print("[Finance Pipeline] Running Daily Prediction Job...")
    db = SessionLocal()
    try:
        # Get factors from the last market close to now
        now = get_ist_now()
        if now.weekday() == 5: # Saturday
            last_close_date = now.date() - timedelta(days=1)
        elif now.weekday() == 6: # Sunday
            last_close_date = now.date() - timedelta(days=2)
        elif now.weekday() == 0 and now.time() < dtime(15, 30): # Mon before 3:30 PM
            last_close_date = now.date() - timedelta(days=3)
        elif now.time() < dtime(15, 30): # Tue-Fri before 3:30 PM
            last_close_date = now.date() - timedelta(days=1)
        else: # Mon-Fri after 3:30 PM
            last_close_date = now.date()
            
        last_close = datetime.combine(last_close_date, dtime(15, 30))
        
        print(f"Fetching events since last market close: {last_close}")
        events = db.query(FinanceNewsEvent).filter(FinanceNewsEvent.published_at >= last_close).all()
        
        active_factors_today = set()
        for event in events:
            factors = event.extracted_factors if event.extracted_factors else {}
            for factor_name, is_active in factors.items():
                if is_active == 1:
                    active_factors_today.add(factor_name)
                    
        # Calculate exact mathematical prediction using db weights
        total_predicted_percent = 0.0
        db_factors = db.query(FinanceFactor).filter(FinanceFactor.event_category != 'Macroeconomic Data').all()
        factor_weight_map = {f.factor_name: f.impact_weight for f in db_factors}
        
        contributing_factors = []
        for factor_name in active_factors_today:
            weight = factor_weight_map.get(factor_name, 0.0)
            total_predicted_percent += weight
            contributing_factors.append(f"{factor_name} (Impact: {weight:.2f}%)")

        # Use Gemini for reasoning generation only
        prompt = f"""
        You are a financial analyst. The Causal ML Engine has calculated a mathematical market prediction of {total_predicted_percent:.2f}% for the NIFTY 50 today.
        
        The active mathematical factors driving this prediction are:
        {', '.join(contributing_factors) if contributing_factors else 'None'}
        
        Write a short 2-3 sentence reasoning explaining this prediction to a user in plain English based on the active factors.
        Return a JSON object with one key: 'reasoning' (string). Do NOT return anything else.
        """
        
        reasoning = "No significant macroeconomic drivers today. Expecting flat to minor technical movements."
        if active_factors_today:
            response = model.generate_content(prompt)
            response_text = response.text.strip().replace('```json', '').replace('```', '')
            try:
                reasoning = json.loads(response_text).get('reasoning', reasoning)
            except Exception as e:
                print("Failed to parse reasoning from AI.", e)
        
        # Fetch current indices
        import requests
        sensex_current, nifty_current = None, None
        try:
            def get_y_close(t): return requests.get(f"https://query2.finance.yahoo.com/v8/finance/chart/{t}", headers={'User-Agent': 'Mozilla/5.0'}).json()['chart']['result'][0]['meta']['regularMarketPrice']
            sensex_current = float(get_y_close("^BSESN"))
            nifty_current = float(get_y_close("^NSEI"))
        except Exception as e:
            print(f"Failed to fetch indices: {e}")
            
        sensex_predicted = (sensex_current * (1 + total_predicted_percent / 100)) if sensex_current else None
        nifty_predicted = (nifty_current * (1 + total_predicted_percent / 100)) if nifty_current else None
        
        prediction = FinancePrediction(
            date=get_ist_now().date(),
            predicted_percent=total_predicted_percent,
            reasoning=reasoning,
            sensex_current=sensex_current,
            nifty_current=nifty_current,
            sensex_predicted=sensex_predicted,
            nifty_predicted=nifty_predicted
        )
        db.add(prediction)
        db.commit()
        print(f"Daily Prediction Saved: {total_predicted_percent:.2f}%")
        return f"1 created (Predicted: {total_predicted_percent:.2f}%) / 0 updated"
    except Exception as e:
        print(f"Prediction Job Failed: {e}")
        db.rollback()
    finally:
        db.close()

@track_job("Feedback Job")
def feedback_job():
    print("[Finance Pipeline] Running Feedback Job (ML Retraining)...")
    try:
        from finance_pipeline.ml_model import train_causal_model
        metrics = train_causal_model()
        if metrics:
            return f"Model Retrained (MSE: {metrics.get('mse', 0):.4f})"
        return "Model Retrained"
    except Exception as e:
        print(f"Feedback/Retraining Job Failed: {e}")
        raise e

@track_job("Historical Backfill Job")
def historical_backfill_job():
    print("[Finance Pipeline] Running Hourly Historical Backfill Job...")
    try:
        from finance_pipeline.backfill_historical_data import run_backfill
        # Process 10 historical days every hour
        processed = run_backfill(num_days=10)
        if processed:
            return f"{processed} historical days backfilled"
        return "No create/update (Already up to date)"
    except Exception as e:
        print(f"Historical Backfill Job Failed: {e}")
        raise e

@track_job("Daily Cleanup and History Job")
def daily_cleanup_and_history_job():
    print("[Finance Pipeline] Running Daily Cleanup and Market History Update...")
    db = SessionLocal()
    try:
        from finance_pipeline.db import MarketIndexHistory
        import requests
        
        # 1. Fetch today's market history (EOD)
        try:
            today_date = get_ist_now().date()
            def get_y_data(t): 
                res = requests.get(f"https://query2.finance.yahoo.com/v8/finance/chart/{t}", headers={'User-Agent': 'Mozilla/5.0'}).json()['chart']['result'][0]
                return res['indicators']['quote'][0]['open'][0], res['indicators']['quote'][0]['close'][0]
            
            n_open, n_close = get_y_data("^NSEI")
            if n_open and n_close:
                record = MarketIndexHistory(
                    date=today_date, index_name='NIFTY50',
                    open_price=float(n_open),
                    close_price=float(n_close)
                )
                db.add(record)
                
            s_open, s_close = get_y_data("^BSESN")
            if s_open and s_close:
                record = MarketIndexHistory(
                    date=today_date, index_name='SENSEX',
                    open_price=float(s_open),
                    close_price=float(s_close)
                )
                db.add(record)
        except Exception as market_err:
            print(f"Failed to fetch today's market history: {market_err}")
            
        # 2. Automated Pruning Disabled per user request
        db.commit()
        print(f"Archived today's market EOD. Automated pruning is disabled.")
        
        created = 0
        if n_open and n_close: created += 1
        if s_open and s_close: created += 1
        return f"{created} created (EOD Prices) / 0 updated"
    except Exception as e:
        print(f"Cleanup & History Job Failed: {e}")
        db.rollback()
    finally:
        db.close()

def start_scheduler():
    # Pre-populate SystemJobStatus
    db = SessionLocal()
    jobs = [
        "Fetch Financial News",
        "Historical Backfill Job",
        "Daily Prediction Job",
        "Feedback Job",
        "Daily Cleanup and History Job"
    ]
    for job_name in jobs:
        record = db.query(SystemJobStatus).filter(SystemJobStatus.job_name == job_name).first()
        if not record:
            record = SystemJobStatus(job_name=job_name, status="SCHEDULED")
            db.add(record)
        elif record.status == "RUNNING":
            record.status = "FAILED"
            record.error_message = "Process killed due to server restart."
    db.commit()
    db.close()

    scheduler = BackgroundScheduler(timezone='Asia/Kolkata')
    scheduler.add_job(fetch_financial_news, 'cron', minute=0)
    scheduler.add_job(historical_backfill_job, 'cron', minute=30)
    scheduler.add_job(daily_prediction_job, 'cron', hour=8, minute=0)
    scheduler.add_job(feedback_job, 'cron', hour=16, minute=30)
    scheduler.add_job(daily_cleanup_and_history_job, 'cron', hour=17, minute=0) # Run at 5 PM after market closes
    scheduler.start()
    print("Finance Background Scheduler started.")
