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
