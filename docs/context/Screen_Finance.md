# Screen: Finance Dashboard & ML Pipeline

This document covers the Finance Dashboard UI, the backend ML prediction pipeline, and the PostgreSQL database schema.

## 1. Components

### FinanceDashboard.jsx (18 KB)
  Purpose:  Indian market (Nifty/Sensex) ML prediction dashboard — XGBoost stock prediction ONLY
  Location: `frontend/src/components/FinanceDashboard.jsx`
  ⚠️  This is NOT the global expense tracker. It is NOT related to trip expenses or balances.
  ⚠️  For expense-related changes, use `GlobalExpenseDashboard.jsx` instead.
  Libraries: recharts (LineChart, BarChart), antd (Card, Statistic, Progress)
  CSS:      NO separate CSS file — uses inline styles + Tailwind + Ant Design components
  Change:   Modify Background -> FinanceDashboard.jsx, find outer wrapper div with `className="flex items-center justify-center min-h-screen"` or `style={{ background: ... }}`

## 2. API Endpoints (backend/main.py)

### Finance (PostgreSQL)
  `GET    /api/finance/factors`                      line 1506
  `GET    /api/finance/predictions`                  line 1534
  `GET    /api/finance/indices`                      line 1554
  `GET    /api/finance/history`                      line 1571

## 3. Background ML Pipeline

  All jobs scheduled via APScheduler in `backend/finance_pipeline/scheduler.py`
  All use `@track_job` decorator which updates `system_job_status` table

  Job Name            Schedule         File                   Purpose
  ------------------- ---------------- ---------------------- ------------------------
  `daily_ingestion`     6:30 AM IST      `daily_ingestion.py`     Yahoo Finance raw data
  `feature_pipeline`    7:00 AM IST      `feature_pipeline.py`    Engineer 36 ML features
  `eod_predictor`       7:30 AM IST      `eod_predictor.py`       XGBoost V2Prediction
  `monthly_trainer`     1st of month 2AM `monthly_trainer.py`     Retrain XGBoost model
  `llm_router`          (on demand)      `llm_router.py`          News sentiment (LLM)

## 4. Database Schema (PostgreSQL)

  ORM: SQLAlchemy | Env var: `FINANCE_DATABASE_URL`
  Models defined in: `backend/finance_pipeline/db.py`

  MODEL: `FinanceFactor` -> TABLE: `finance_factors`
    `id`, `domain`, `geography`, `event_category`, `sector_impacted`
    `company_size`, `factor_name`, `impact_weight`, `confidence_score`

  MODEL: `FinancePrediction` -> TABLE: `finance_predictions` (legacy v1)
    `date` PK, `predicted_percent`, `actual_percent`, `reasoning` TEXT
    `sensex_current`, `nifty_current`, `sensex_predicted`, `nifty_predicted`

  MODEL: `MarketIndexHistory` -> TABLE: `market_index_history`
    `id` INT PK, `date`, `index_name` ('SENSEX'|'NIFTY50'), `open_price`, `close_price`

  MODEL: `RawMarketDataV2` -> TABLE: `raw_market_data_v2`
    `id` INT PK, `date`, `ticker` VARCHAR, `open`/`high`/`low`/`close` Float, `volume` BigInt

  MODEL: `EngineeredFeaturesV2` -> TABLE: `engineered_features_v2`
    `date` PK, `target_ticker` (^NSEI), `features_json` TEXT (36 features), `sentiment_score`

  MODEL: `V2Prediction` -> TABLE: `v2_prediction`
    `date` PK, `target_ticker`, `prob_crash`/`down`/`up`/`boom` Float, `signal`, `confidence`

  MODEL: `SystemJobStatus` -> TABLE: `system_job_status`
    `job_name` PK, `status` ('RUNNING'|'SUCCESS'|'FAILED')
    `last_run_at`, `last_finished_at`, `error_message`, `last_run_summary`
