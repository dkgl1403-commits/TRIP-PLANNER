# TRIP Planner — Codebase Context File
# Maintained by Antigravity | Last updated: 2026-07-18
# This file is the primary context source for the AI agent (agent_worker.py)
# Keep this up to date whenever significant changes are made to the codebase.

---

## 1. Project Architecture Overview

  Browser (React SPA)
       |
       | HTTP/REST (proxied via Nginx)
       v
  FastAPI Backend (Python)         [backend/main.py — single file, ~1700 lines]
       |
       +---> Oracle DB (Cloud)      [Trip / User data, oracledb driver]
       |     Tables: users, trips, participants, expenses, locations,
       |             trip_media, biometric_credentials
       |
       +---> PostgreSQL DB          [Finance pipeline, SQLAlchemy ORM]
             Tables: see Section 5

  Server:   Ubuntu 20.04, IP 80.225.208.24, ARM Neoverse-N1, 11 GB RAM
  Served:   Nginx (80/443) -> uvicorn (8000 prod / 8080 UAT)
  CI/CD:    GitHub Actions (.github/workflows/deploy.yml) -> SSH deploy
  AI Agent: Ollama (qwen2.5-coder:7b) on localhost:11434, cron every 10 min


---

## 2. Frontend Navigation Model

No React Router. App.jsx uses a currentView string state variable.
Navigation is done via callback props passed down to each component.

  currentView string    | Component             | File
  ----------------------|-----------------------|----------------------------------------
  'login'               | Login                 | frontend/src/components/Login.jsx
  'dashboard'           | Dashboard             | frontend/src/components/Dashboard.jsx
  'create_trip'         | CreateTrip            | frontend/src/components/CreateTrip.jsx
  'ai_create_trip'      | AiCreateTrip          | frontend/src/components/AiCreateTrip.jsx
  'view_trip'           | TripDetails           | frontend/src/components/TripDetails.jsx
  'admin_dashboard'     | AdminDashboard        | frontend/src/components/AdminDashboard.jsx
  'systemHealth'        | SystemHealthDashboard | frontend/src/components/SystemHealthDashboard.jsx
  'finance_dashboard'   | FinanceDashboard      | frontend/src/components/FinanceDashboard.jsx

Auth state: localStorage key 'tripPlannerUser' (JSON: {login_id, name, role})


---

## 3. Frontend Components — Detailed Map

### Login.jsx (14 KB) + Login.css
  Purpose:  Login / Signup / WebAuthn biometric authentication page
  CSS file: components/Login.css
  API:      POST /api/auth/login
            POST /api/auth/signup
            GET  /api/auth/login-biometric/options
            POST /api/auth/login-biometric/verify
  State:    activeTab ('login' | 'signup'), isLoading, error
  CHANGE:   Login form UI -> Login.jsx + Login.css (.login-wrapper, .login-card)

### Dashboard.jsx (17 KB) + Dashboard.css
  Purpose:  Home screen — trip cards, saved locations, user profile tab
  CSS file: components/Dashboard.css
  API:      GET /api/trips?login_id=X
            GET /api/locations?login_id=X
            GET /api/auth/biometric-status?login_id=X
  State:    trips[], savedLocations[], activeTab ('dashboard'|'locations'|'profile')
  Props:    user, onLogout, theme, toggleTheme, onCreateTrip, onAiPlanTrip,
            onViewTrip, onAdminDashboard, onSystemHealth, onFinanceDashboard
  CHANGE dashboard background -> Dashboard.css: .dashboard-container
                                 OR App.css: .bg-overlay
  CHANGE trip card layout     -> Dashboard.jsx render section + Dashboard.css .trip-card
  ADD new dashboard tab       -> Dashboard.jsx: activeTab state + tab button + content block

### CreateTrip.jsx (12 KB) + CreateTrip.css
  Purpose:  Manual trip creation form with location autocomplete
  CSS file: components/CreateTrip.css (also imported by TripDetails.jsx)
  API:      POST /api/trips
  External: Nominatim OSM API (browser-direct, no backend proxy)
  State:    title, startDate, endDate, source, destination, checkpoints[], participants[]

### AiCreateTrip.jsx (23 KB) + AiCreateTrip.css
  Purpose:  AI-assisted trip creation via Gemini API — multi-step wizard
  CSS file: components/AiCreateTrip.css
  Note:     Calls Gemini API directly from browser. No backend proxy involved.

### TripDetails.jsx (79 KB — LARGEST FILE) + TripDetails.css + CreateTrip.css
  Purpose:  Full trip view: edit details, live map, expenses, media, participants
  CSS file: TripDetails.css (split-panel layout) + CreateTrip.css (form styles reused)
  Sub-comps: TripMap.jsx (embedded), ExpenseTracker.jsx (embedded)
  API:      GET    /api/trips/{id}
            PUT    /api/trips/{id}
            POST   /api/trips/{id}/start|end|cancel|checkin
            POST   /api/trips/{id}/location
            GET    /api/trips/{id}/live
            GET    /api/trips/{id}/media/upload_url
            GET    /api/trips/{id}/media
            POST   /api/trips/{id}/media
            POST   /api/trips/{id}/expenses
            GET    /api/trips/{id}/expenses
            PUT    /api/trips/{id}/expenses/{expense_id}
            DELETE /api/trips/{id}/expenses/{expense_id}
            POST   /api/trips/{id}/participants
            PUT    /api/trips/{id}/participants
            DELETE /api/trips/{id}/participants/{name}

### TripMap.jsx (21 KB)
  Purpose:  Leaflet.js interactive map — participant markers, routes, checkpoints
  Library:  react-leaflet
  CHANGE map appearance -> TripMap.jsx (Leaflet marker/layer configuration)

### ExpenseTracker.jsx (26 KB)
  Purpose:  Full expense management — add, edit, delete, split, balance calculation
  Note:     Self-contained component, embedded inside TripDetails.jsx
  CHANGE expense UI -> ExpenseTracker.jsx (self-contained)

### FinanceDashboard.jsx (18 KB)
  Purpose:  Indian market (Nifty/Sensex) ML prediction dashboard
  Libraries: recharts (LineChart, BarChart), antd (Card, Statistic, Progress)
  CSS:      NO separate CSS file — uses inline styles + Ant Design components
  API:      GET /api/finance/factors      (feature importance scores)
            GET /api/finance/predictions  (latest ML prediction)
            GET /api/finance/indices      (current Nifty/Sensex values)
            GET /api/finance/history      (historical chart data)
  CHANGE BACKGROUND -> FinanceDashboard.jsx
                       Find outer wrapper div with style={{ background: ... }}
                       Located approximately at line 75-90

### SystemHealthDashboard.jsx (10 KB)
  Purpose:  Server monitoring — CPU, RAM, disk, finance pipeline job statuses
  API:      GET /api/system/health
            GET /api/server-metrics

### AdminDashboard.jsx (5 KB)
  Purpose:  Admin panel — list all users, change user roles
  API:      GET /api/admin/users
            PUT /api/admin/users/{id}/role

### Toast.jsx (3 KB)
  Purpose:  Global toast notification system using React Context
  Usage:    App wrapped in <ToastProvider>, call useToast() hook in any component


---

## 4. Backend API — All Endpoints (all in backend/main.py)

### Authentication (Oracle DB)
  POST   /api/auth/signup                          line 86
  POST   /api/auth/login                           line 131
  GET    /api/auth/biometric-status                line 1429
  GET    /api/auth/register-biometric/options      line 1265
  POST   /api/auth/register-biometric/verify       line 1303
  GET    /api/auth/login-biometric/options         line 1344
  POST   /api/auth/login-biometric/verify          line 1362
  DELETE /api/auth/disable-biometric               line 1440

### Trips (Oracle DB)
  POST   /api/trips                                line 198
  GET    /api/trips                                line 332
  GET    /api/trips/{trip_id}                      line 372
  PUT    /api/trips/{trip_id}                      line 508
  POST   /api/trips/{trip_id}/start                line 569
  POST   /api/trips/{trip_id}/end                  line 767
  POST   /api/trips/{trip_id}/cancel               line 747
  POST   /api/trips/{trip_id}/checkin              line 722
  POST   /api/trips/{trip_id}/location             line 592
  GET    /api/trips/{trip_id}/live                 line 642

### Participants (Oracle DB)
  POST   /api/trips/{trip_id}/participants         line 245
  PUT    /api/trips/{trip_id}/participants         line 269
  DELETE /api/trips/{trip_id}/participants/{name}  line 287

### Media (Oracle Object Storage, S3-compatible)
  GET    /api/trips/{trip_id}/media/upload_url     line 827
  POST   /api/trips/{trip_id}/media                line 868
  GET    /api/trips/{trip_id}/media                line 888
  GET    /api/upload/presign                       line 304

### Expenses (Oracle DB)
  POST   /api/trips/{trip_id}/expenses             line 950
  GET    /api/trips/{trip_id}/expenses             line 991
  PUT    /api/trips/{trip_id}/expenses/{id}        line 1098
  DELETE /api/trips/{trip_id}/expenses/{id}        line 1141

### Locations (Oracle DB)
  GET    /api/locations                            line 1155
  POST   /api/locations                            line 1186
  DELETE /api/locations/{location_id}              line 1208

### Finance (PostgreSQL)
  GET    /api/finance/factors                      line 1506
  GET    /api/finance/predictions                  line 1534
  GET    /api/finance/indices                      line 1554
  GET    /api/finance/history                      line 1571

### Admin / System
  GET    /api/admin/users                          line 1464
  PUT    /api/admin/users/{id}/role                line 1488
  POST   /api/admin/trigger-news-fetch             line 158
  GET    /api/server-metrics                       line 1222
  GET    /api/system/health                        line 1600
  GET    /api/dev/logs                             line 1451
  GET    /api/migrate                              line 667


---

## 5. Database Schema

### Oracle DB — Trip and User Data
  Connection function: get_db_connection() in backend/main.py (line 36)
  DSN: dkgloracledb1_high | User: ADMIN | Wallet: /home/ubuntu/wallet (server)
  Uses raw SQL via oracledb cursor (no ORM)

  TABLE: users
    login_id      VARCHAR  PK   Auto-generated: initials + 5 digits (e.g. DK12345)
    password_hash VARCHAR       Plain text for now (TODO: hash in production)
    role          VARCHAR       'USER' or 'ADMIN'
    name          VARCHAR
    gender        VARCHAR
    phone         VARCHAR       Unique
    email         VARCHAR       Unique
    address       VARCHAR

  TABLE: trips
    trip_id       VARCHAR  UUID PK
    login_id      VARCHAR  FK -> users
    title         VARCHAR
    start_date    DATE
    end_date      DATE
    source        VARCHAR       JSON string: {lat, lng, name}
    destination   VARCHAR       JSON string: {lat, lng, name}
    checkpoints   CLOB          JSON array of waypoints
    participants  CLOB          JSON array of participant objects
    status        VARCHAR       'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    created_at    TIMESTAMP

  TABLE: expenses
    expense_id    UUID     PK
    trip_id       FK       -> trips
    description   VARCHAR
    amount        NUMBER
    paid_by       VARCHAR       login_id of payer
    split_among   CLOB          JSON array of login_ids

  TABLE: trip_media
    media_id      UUID     PK
    trip_id       FK       -> trips
    s3_key        VARCHAR       OCI Object Storage key
    file_url      VARCHAR       Public URL
    uploaded_at   TIMESTAMP

  TABLE: locations
    location_id   UUID     PK
    login_id      FK       -> users
    name          VARCHAR
    lat           FLOAT
    lng           FLOAT

  TABLE: biometric_credentials
    credential_id VARCHAR  PK
    login_id      FK       -> users
    public_key    CLOB
    sign_count    NUMBER


### PostgreSQL — Finance Pipeline Data
  ORM: SQLAlchemy | Env var: FINANCE_DATABASE_URL
  Models defined in: backend/finance_pipeline/db.py
  Add tables: add SQLAlchemy model class in db.py, call init_db()

  MODEL: FinanceFactor -> TABLE: finance_factors
    id, domain, geography, event_category, sector_impacted
    company_size, factor_name, impact_weight, confidence_score

  MODEL: FinancePrediction -> TABLE: finance_predictions (legacy v1)
    date PK, predicted_percent, actual_percent, reasoning TEXT
    sensex_current, nifty_current, sensex_predicted, nifty_predicted

  MODEL: MarketIndexHistory -> TABLE: market_index_history
    id INT PK, date, index_name ('SENSEX'|'NIFTY50'), open_price, close_price

  MODEL: RawMarketDataV2 -> TABLE: raw_market_data_v2
    id INT PK, date, ticker VARCHAR, open/high/low/close Float, volume BigInt

  MODEL: EngineeredFeaturesV2 -> TABLE: engineered_features_v2
    date PK, target_ticker (^NSEI), features_json TEXT (36 features), sentiment_score

  MODEL: V2Prediction -> TABLE: v2_prediction
    date PK, target_ticker, prob_crash/down/up/boom Float, signal, confidence

  MODEL: SystemJobStatus -> TABLE: system_job_status
    job_name PK, status ('RUNNING'|'SUCCESS'|'FAILED')
    last_run_at, last_finished_at, error_message, last_run_summary


---

## 6. Finance Background Pipeline

  All jobs scheduled via APScheduler in backend/finance_pipeline/scheduler.py
  All use @track_job decorator which updates system_job_status table

  Job Name            Schedule         File                   Purpose
  ------------------- ---------------- ---------------------- ------------------------
  daily_ingestion     6:30 AM IST      daily_ingestion.py     Yahoo Finance raw data
  feature_pipeline    7:00 AM IST      feature_pipeline.py    Engineer 36 ML features
  eod_predictor       7:30 AM IST      eod_predictor.py       XGBoost V2Prediction
  monthly_trainer     1st of month 2AM monthly_trainer.py     Retrain XGBoost model
  llm_router          (on demand)      llm_router.py          News sentiment (LLM)


---

## 7. Styling Guide

  frontend/src/index.css         Global CSS reset, variables, fonts
  frontend/src/App.css           App shell: .app-container, .bg-overlay, .content-wrapper
  components/Dashboard.css       Trip cards, tabs, profile, home dashboard layout
  components/Login.css           Login/signup form, card, inputs
  components/CreateTrip.css      Trip creation form (also imported by TripDetails.jsx)
  components/TripDetails.css     Split-panel layout, map panel, detail panel
  components/AiCreateTrip.css    AI wizard multi-step layout

  FinanceDashboard.jsx           Uses INLINE STYLES + Ant Design (no separate CSS file)

  Theme toggle: document.body.className = 'light' | 'dark'  (set in App.jsx)
  Dark mode:    .dark prefix selector in Dashboard.css, Login.css, etc.


---

## 8. Change Map — Which File to Edit for Common Tasks

### Frontend UI Changes
  Change Finance Dashboard background  -> FinanceDashboard.jsx, outer div style={{ background }} ~line 75
  Change Dashboard (home) background   -> Dashboard.css (.dashboard-container) or App.css (.bg-overlay)
  Change Login page appearance         -> Login.css (.login-wrapper or .login-card)
  Add a new top-level page             -> App.jsx (new view string + conditional render) + new Component.jsx
  Add a tab to the Dashboard home      -> Dashboard.jsx: activeTab state + tab button JSX + content block
  Add a new chart to Finance Dashboard -> FinanceDashboard.jsx: add fetch + state + recharts component
  Modify trip card layout              -> Dashboard.jsx render + Dashboard.css .trip-card
  Modify expense tracker UI            -> ExpenseTracker.jsx (self-contained)
  Modify map appearance / markers      -> TripMap.jsx (react-leaflet configuration)
  Show a toast notification            -> use useToast() hook from Toast.jsx

### Backend Changes
  Add a new API endpoint               -> backend/main.py: add @app.get/post/put/delete function
  Change Oracle DB query               -> backend/main.py: use get_db_connection() + raw SQL cursor
  Add a new Oracle DB table            -> Write raw SQL, run via /api/migrate or direct connection
  Add a new PostgreSQL table           -> backend/finance_pipeline/db.py: add SQLAlchemy model + init_db()
  Add a background finance job         -> backend/finance_pipeline/scheduler.py: @track_job + scheduler.add_job
  Change ML prediction logic           -> backend/finance_pipeline/eod_predictor.py
  Change ML feature engineering        -> backend/finance_pipeline/feature_pipeline.py
  Change news LLM analysis             -> backend/finance_pipeline/llm_router.py

### Infrastructure Changes
  Change AI cron agent model           -> agent_worker.py: OLLAMA_MODEL variable (top of file)
  Change cron job schedule             -> ssh ubuntu@80.225.208.24 then crontab -e
  Change Nginx routing / SSL           -> nginx_ssl.conf on server
  Change CI/CD deploy pipeline         -> .github/workflows/deploy.yml


---

## 9. Key Conventions

  - No React Router — all navigation via string state in App.jsx
  - No Zustand/Redux — local component state + prop drilling
  - Oracle DB: raw SQL via oracledb cursor (not SQLAlchemy)
  - PostgreSQL: SQLAlchemy ORM via SessionLocal()
  - Never mix Oracle and Postgres connections in same function
  - All API fetches use relative /api/ paths (Nginx proxy in prod, Vite proxy in dev)
  - Auth: localStorage 'tripPlannerUser' plain JSON — no JWT tokens
  - Media: Oracle Object Storage (S3-compatible), accessed via boto3 presigned URLs
  - Finance data: Yahoo Finance via yfinance Python library
  - WebAuthn: py_webauthn library on backend
  - API base URLs: backend runs on :8000 (prod) or :8080 (UAT)
