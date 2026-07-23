# Core Architecture & Conventions

This document covers the overarching architecture, navigation rules, global styles, and general conventions of the TRIP Planner app.

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
             Tables: finance_factors, market_index_history, etc.

  Server:   Ubuntu 20.04, IP 80.225.208.24, ARM Neoverse-N1, 11 GB RAM
  Served:   Nginx (80/443) -> uvicorn (8000 prod / 8080 UAT)
  CI/CD:    GitHub Actions (.github/workflows/deploy.yml) -> SSH deploy
  AI Agent: Ollama (qwen2.5-coder:7b) on localhost:11434, cron every 10 min

## 2. Frontend Navigation Model

No React Router. `App.jsx` uses a `currentView` string state variable.
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
  'global-expenses'     | GlobalExpenseDashboard| frontend/src/components/GlobalExpenseDashboard.jsx

## 2b. Screen → File Quick Reference (for Jira "Affected File" field)

  Use this table when writing a Jira ticket to specify the exact file to change.
  The AI agent uses this mapping to find the correct file before making any edit.

  | Screen (what you see)                        | Jira Label                  | Primary File(s)                                        |
  |----------------------------------------------|-----------------------------|--------------------------------------------------------|
  | Login / Sign Up / Biometric                  | Login Screen                | components/Login.jsx + Login.css                       |
  | Home / Dashboard (Trip & Expense cards)      | Dashboard Screen            | components/Dashboard.jsx + Dashboard.css               |
  | Top Navigation Bar / Sidebar Menu            | Header / Nav                | components/Header.jsx                                  |
  | Create Trip (manual form)                    | Create Trip Screen          | components/CreateTrip.jsx + CreateTrip.css             |
  | Create Trip with AI (multi-step wizard)      | AI Trip Planner Screen      | components/AiCreateTrip.jsx                            |
  | Trip Detail / Live Map / Trip Expenses       | Trip Details Screen         | components/TripDetails.jsx + TripDetails.css           |
  | Map embedded inside Trip Detail              | Trip Map                    | components/TripMap.jsx                                 |
  | Expense split inside a specific Trip         | Expense Tracker (in-trip)   | components/ExpenseTracker.jsx                          |
  | 💰 Global Expenses / Balances / Settle Up    | Global Expense Screen       | components/GlobalExpenseDashboard.jsx                  |
  | 📈 XGBoost / Stock Prediction / ML pipeline  | Finance Dashboard Screen    | components/FinanceDashboard.jsx                        |
  | Admin Panel (user management / roles)        | Admin Dashboard Screen      | components/AdminDashboard.jsx                          |
  | System Health / Cron Job Status              | System Health Screen        | components/SystemHealthDashboard.jsx                   |
  | Toast / pop-up notifications                 | Toast / Notifications       | components/Toast.jsx                                   |
  | All REST API endpoints                       | Backend / API               | backend/main.py                                        |

  ⚠️  MOST COMMONLY CONFUSED — these are two completely separate screens:
      GlobalExpenseDashboard.jsx  → trip expense balances, settle up, shared costs between people
      FinanceDashboard.jsx        → Indian stock market ML prediction (XGBoost) — NOT expense-related


Auth state: `localStorage` key `tripPlannerUser` (JSON: {login_id, name, role})

## 3. Key Conventions

  - **No React Router** — all navigation via string state in `App.jsx`
  - **No Zustand/Redux** — local component state + prop drilling
  - **Oracle DB**: raw SQL via `oracledb` cursor (not SQLAlchemy)
  - **PostgreSQL**: SQLAlchemy ORM via `SessionLocal()`
  - Never mix Oracle and Postgres connections in same function
  - All API fetches use relative `/api/` paths (Nginx proxy in prod, Vite proxy in dev)
  - Auth: `localStorage` 'tripPlannerUser' plain JSON — no JWT tokens
  - Media: Oracle Object Storage (S3-compatible), accessed via boto3 presigned URLs
  - Finance data: Yahoo Finance via `yfinance` Python library
  - WebAuthn: `py_webauthn` library on backend
  - API base URLs: backend runs on `:8000` (prod) or `:8080` (UAT)

## 4. Styling Guide

  `frontend/src/index.css`         Global CSS reset, variables, fonts, Tailwind
  `frontend/src/App.css`           App shell: .app-container, .bg-overlay, .content-wrapper
  `components/Dashboard.css`       Trip cards, tabs, profile, home dashboard layout
  `components/Login.css`           Login/signup form, card, inputs
  `components/CreateTrip.css`      Trip creation form (also imported by TripDetails.jsx)
  `components/TripDetails.css`     Split-panel layout, map panel, detail panel
  `components/AiCreateTrip.css`    AI wizard multi-step layout

  `FinanceDashboard.jsx`           Uses INLINE STYLES + Tailwind + Ant Design (no separate CSS file)

  Theme toggle: `document.body.className` = 'light' | 'dark'  (set in `App.jsx`)
  Dark mode: `.dark` prefix selector in CSS or Tailwind `dark:` variants.

## 5. Infrastructure Changes
  Change AI cron agent model           -> `agent_worker.py`: OLLAMA_MODEL variable (top of file)
  Change cron job schedule             -> SSH to server then `crontab -e`
  Change Nginx routing / SSL           -> `nginx_ssl.conf` on server
  Change CI/CD deploy pipeline         -> `.github/workflows/deploy.yml`

## 6. Backend Logic → File Mapping (for Jira "Affected File" field)

  All REST API logic lives in a single file: `backend/main.py` (~1700 lines).
  Use the line numbers below to navigate to the right section quickly.

  ### 6a. API Endpoint Groups (backend/main.py)

  | Jira Label / Feature Area             | API Endpoints                                    | Line Range  |
  |---------------------------------------|--------------------------------------------------|-------------|
  | User Sign Up / Registration           | POST /api/auth/signup                            | ~86         |
  | User Login                            | POST /api/auth/login                             | ~131        |
  | Biometric Registration (WebAuthn)     | GET+POST /api/auth/register-biometric/*          | ~1516–1593  |
  | Biometric Login (WebAuthn)            | GET+POST /api/auth/login-biometric/*             | ~1595–1699  |
  | Biometric Status / Disable            | GET+DELETE /api/auth/biometric-status            | ~1680–1701  |
  | Trip Creation                         | POST /api/trips                                  | ~198        |
  | Trip List                             | GET /api/trips                                   | ~332        |
  | Trip Detail / Fetch                   | GET /api/trips/{trip_id}                         | ~372        |
  | Trip Edit / Update                    | PUT /api/trips/{trip_id}                         | ~508        |
  | Trip Start                            | POST /api/trips/{trip_id}/start                  | ~569        |
  | Trip Live Location Update             | POST /api/trips/{trip_id}/location               | ~592        |
  | Trip Live Location Fetch              | GET /api/trips/{trip_id}/live                    | ~642        |
  | Trip Check-In                         | POST /api/trips/{trip_id}/checkin                | ~722        |
  | Trip Cancel                           | POST /api/trips/{trip_id}/cancel                 | ~747        |
  | Trip End                              | POST /api/trips/{trip_id}/end                    | ~767        |
  | Participant Add / Edit / Remove       | POST+PUT+DELETE /api/trips/{id}/participants     | ~245–302    |
  | Media Upload (presign URL)            | GET /api/upload/presign                          | ~304        |
  | Media Upload Record / Fetch           | POST+GET /api/trips/{id}/media                   | ~827–925    |
  | In-Trip Expense Add                   | POST /api/trips/{trip_id}/expenses               | ~950        |
  | In-Trip Expense Fetch                 | GET /api/trips/{trip_id}/expenses                | ~991        |
  | In-Trip Expense Edit                  | PUT /api/trips/{trip_id}/expenses/{id}           | ~1349       |
  | In-Trip Expense Delete                | DELETE /api/trips/{trip_id}/expenses/{id}        | ~1392       |
  | Global Expense Fetch (balances etc.)  | GET /api/expenses/global                         | ~1125       |
  | Global Expense Add / Settle Up        | POST /api/expenses/global                        | ~1262       |
  | Global Expense Participants           | POST /api/expenses/global/participants           | ~1315       |
  | Saved Locations                       | GET+POST+DELETE /api/locations                   | ~1406–1471  |
  | User Search (people picker)           | GET /api/users/search                            | ~1715       |
  | Admin: List Users                     | GET /api/admin/users                             | ~1734       |
  | Admin: Change User Role               | PUT /api/admin/users/{id}/role                   | ~1759       |
  | Admin: Trigger News Fetch             | POST /api/admin/trigger-news-fetch               | ~158        |
  | Server Metrics                        | GET /api/server-metrics                          | ~1473       |
  | System Health / Job Status            | GET /api/system/health                           | ~1874       |
  | Dev Logs                              | GET /api/dev/logs                                | ~1702       |
  | Finance: Factors                      | GET /api/finance/factors                         | ~1777       |
  | Finance: Predictions                  | GET /api/finance/predictions                     | ~1805       |
  | Finance: Market Indices               | GET /api/finance/indices                         | ~1825       |
  | Finance: Price History                | GET /api/finance/history                         | ~1845       |

  ### 6b. Finance ML Pipeline Files (backend/finance_pipeline/)

  | Jira Label / Feature Area                    | File                                              |
  |----------------------------------------------|---------------------------------------------------|
  | Daily stock data ingestion (Yahoo Finance)   | backend/finance_pipeline/daily_ingestion.py       |
  | Feature engineering (36 ML features)         | backend/finance_pipeline/feature_pipeline.py      |
  | XGBoost EOD prediction                       | backend/finance_pipeline/eod_predictor.py         |
  | Monthly model retraining                     | backend/finance_pipeline/monthly_trainer.py       |
  | News sentiment (LLM routing)                 | backend/finance_pipeline/llm_router.py            |
  | ML model definition / loading                | backend/finance_pipeline/ml_model.py              |
  | All pipeline job scheduling (APScheduler)    | backend/finance_pipeline/scheduler.py             |
  | PostgreSQL DB models (SQLAlchemy ORM)        | backend/finance_pipeline/db.py                    |

  ### 6c. Database Layer

  | What to change                                | Where to look                                     |
  |-----------------------------------------------|---------------------------------------------------|
  | Trip / User / Expense schema (Oracle)         | backend/main.py — raw SQL CREATE/INSERT/SELECT    |
  | Finance ML data schema (PostgreSQL)           | backend/finance_pipeline/db.py — SQLAlchemy models|
  | Oracle DB connection config                   | backend/.env → DB_USER, DB_PASSWORD, DB_DSN       |
  | PostgreSQL connection config                  | backend/.env → FINANCE_DATABASE_URL               |
  | Add/alter Oracle DB columns                   | backend/alter_db.py (one-off migration script)    |

  ### 6d. Infrastructure / Config Files

  | What to change                                | File                                              |
  |-----------------------------------------------|---------------------------------------------------|
  | CI/CD deploy steps (build, SSH, restart)      | .github/workflows/deploy.yml                      |
  | UAT backend restart script                    | backend/restart_backend_uat.sh                    |
  | Production backend restart script             | backend/restart_backend.sh                        |
  | Python dependencies                           | backend/requirements.txt                          |
  | Vite proxy / frontend build config            | frontend/vite.config.js                           |
  | Tailwind design tokens                        | frontend/tailwind.config.js                       |
  | Global CSS variables / fonts                  | frontend/src/index.css                            |
