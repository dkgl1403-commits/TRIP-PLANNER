# TRIP Planner — Jira Ticket Guide for AI Developer Tasks

This guide helps you write Jira tickets that the UAT AI developer (Ollama agent) can
execute correctly. Always include the **"Affected File"** field using the tables below.

---

## ⚠️ Golden Rules for the AI Developer

1. **Always specify the exact file path** — never just describe the screen by name
2. **Include the current value** of what needs to change (e.g. the text, emoji, class name)
3. **Include the expected value** after the change
4. **Do NOT mix screen names** — "Global Expenses" ≠ "Finance Dashboard" (see confusion map below)
5. If the change is in `backend/main.py`, also provide the **approximate line number or API endpoint**

---

## 📋 Jira Ticket Template

```
Title:  [FIN-XX] Short description of the change

Description:
  What screen/feature is affected:  <screen name>
  What needs to change:             <clear description>
  Current value / behaviour:        <what it looks like NOW>
  Expected value / behaviour:       <what it should look like AFTER>

Affected File:   <exact file path from tables below>
Affected Line:   <line number or search string, if known>

Example of the change (optional but recommended):
  BEFORE: <old code snippet or text>
  AFTER:  <new code snippet or text>
```

---

## 🖥️ Section 1 — Frontend Screen → File Mapping

| What you see on screen | Jira "Affected File" value |
|---|---|
| Login / Sign Up / Biometric login screen | `frontend/src/components/Login.jsx` |
| Home / Dashboard (Trip & Expense cards) | `frontend/src/components/Dashboard.jsx` |
| Top Navigation Bar / Hamburger sidebar | `frontend/src/components/Header.jsx` |
| Create Trip (manual form + location search) | `frontend/src/components/CreateTrip.jsx` |
| Create Trip with AI (multi-step wizard) | `frontend/src/components/AiCreateTrip.jsx` |
| Trip Detail view (map, info, expenses, media) | `frontend/src/components/TripDetails.jsx` |
| Live map inside Trip Detail | `frontend/src/components/TripMap.jsx` |
| Expense split tracker inside a specific Trip | `frontend/src/components/ExpenseTracker.jsx` |
| 💰 Global Expenses / Balances / Settle Up | `frontend/src/components/GlobalExpenseDashboard.jsx` |
| 📈 XGBoost / Stock Prediction / ML dashboard | `frontend/src/components/FinanceDashboard.jsx` |
| Admin Panel (user list, role management) | `frontend/src/components/AdminDashboard.jsx` |
| System Health / Cron Job Status | `frontend/src/components/SystemHealthDashboard.jsx` |
| Toast / pop-up notifications | `frontend/src/components/Toast.jsx` |
| Global CSS / fonts / theme variables | `frontend/src/index.css` |
| App shell layout / background overlay | `frontend/src/App.css` |
| App-level navigation / routing logic | `frontend/src/App.jsx` |
| Tailwind design tokens / theme config | `frontend/tailwind.config.js` |

### 🚨 Most Commonly Confused Files

| Screen name you might use | Correct file | Wrong file (do NOT use) |
|---|---|---|
| "Global Expense", "expense balance", "settle up" | `GlobalExpenseDashboard.jsx` | ~~FinanceDashboard.jsx~~ |
| "Finance", "stock", "XGBoost", "ML prediction" | `FinanceDashboard.jsx` | ~~GlobalExpenseDashboard.jsx~~ |
| "Trip expenses", "split bill inside a trip" | `ExpenseTracker.jsx` | ~~GlobalExpenseDashboard.jsx~~ |

---

## 🔧 Section 2 — Backend API → File + Line Mapping

All REST API logic is in **`backend/main.py`**. Use the line numbers to help the agent jump to the right section.

| Feature Area | API Endpoint | Affected File + Line |
|---|---|---|
| User Sign Up | POST /api/auth/signup | `backend/main.py ~86` |
| User Login | POST /api/auth/login | `backend/main.py ~131` |
| Biometric Registration (WebAuthn) | POST /api/auth/register-biometric/* | `backend/main.py ~1516` |
| Biometric Login (WebAuthn) | POST /api/auth/login-biometric/* | `backend/main.py ~1595` |
| Biometric Status / Disable | GET /api/auth/biometric-status | `backend/main.py ~1680` |
| Trip Creation | POST /api/trips | `backend/main.py ~198` |
| Trip List | GET /api/trips | `backend/main.py ~332` |
| Trip Fetch by ID | GET /api/trips/{trip_id} | `backend/main.py ~372` |
| Trip Edit / Update | PUT /api/trips/{trip_id} | `backend/main.py ~508` |
| Trip Start | POST /api/trips/{trip_id}/start | `backend/main.py ~569` |
| Trip Live Location Update | POST /api/trips/{trip_id}/location | `backend/main.py ~592` |
| Trip Live Location Fetch | GET /api/trips/{trip_id}/live | `backend/main.py ~642` |
| Trip Check-In | POST /api/trips/{trip_id}/checkin | `backend/main.py ~722` |
| Trip Cancel | POST /api/trips/{trip_id}/cancel | `backend/main.py ~747` |
| Trip End | POST /api/trips/{trip_id}/end | `backend/main.py ~767` |
| Participant Add / Edit / Remove | POST+PUT+DELETE /api/trips/{id}/participants | `backend/main.py ~245–302` |
| Media Presign URL | GET /api/upload/presign | `backend/main.py ~304` |
| Media Upload / Fetch | POST+GET /api/trips/{id}/media | `backend/main.py ~827` |
| In-Trip Expense Add | POST /api/trips/{trip_id}/expenses | `backend/main.py ~950` |
| In-Trip Expense Fetch | GET /api/trips/{trip_id}/expenses | `backend/main.py ~991` |
| In-Trip Expense Edit | PUT /api/trips/{trip_id}/expenses/{id} | `backend/main.py ~1349` |
| In-Trip Expense Delete | DELETE /api/trips/{trip_id}/expenses/{id} | `backend/main.py ~1392` |
| Global Expense Fetch (balances, settlements) | GET /api/expenses/global | `backend/main.py ~1125` |
| Global Expense Add / Settle Up | POST /api/expenses/global | `backend/main.py ~1262` |
| Global Expense Participants | POST /api/expenses/global/participants | `backend/main.py ~1315` |
| Saved Locations (add / list / delete) | GET+POST+DELETE /api/locations | `backend/main.py ~1406` |
| User Search (people picker dropdown) | GET /api/users/search | `backend/main.py ~1715` |
| Admin: List All Users | GET /api/admin/users | `backend/main.py ~1734` |
| Admin: Change User Role | PUT /api/admin/users/{id}/role | `backend/main.py ~1759` |
| Admin: Trigger News Fetch | POST /api/admin/trigger-news-fetch | `backend/main.py ~158` |
| Server Metrics | GET /api/server-metrics | `backend/main.py ~1473` |
| System Health / Job Status | GET /api/system/health | `backend/main.py ~1874` |
| Finance: ML Factors | GET /api/finance/factors | `backend/main.py ~1777` |
| Finance: Predictions | GET /api/finance/predictions | `backend/main.py ~1805` |
| Finance: Market Indices | GET /api/finance/indices | `backend/main.py ~1825` |
| Finance: Price History | GET /api/finance/history | `backend/main.py ~1845` |

---

## 🤖 Section 3 — Finance ML Pipeline Files

For changes to the automated stock prediction pipeline (not the UI):

| Feature Area | Affected File |
|---|---|
| Daily stock data fetch from Yahoo Finance | `backend/finance_pipeline/daily_ingestion.py` |
| Feature engineering (36 ML features) | `backend/finance_pipeline/feature_pipeline.py` |
| XGBoost EOD prediction logic | `backend/finance_pipeline/eod_predictor.py` |
| Monthly model retraining | `backend/finance_pipeline/monthly_trainer.py` |
| News sentiment scoring (LLM) | `backend/finance_pipeline/llm_router.py` |
| ML model definition and loading | `backend/finance_pipeline/ml_model.py` |
| APScheduler job scheduling (all cron jobs) | `backend/finance_pipeline/scheduler.py` |
| PostgreSQL DB models (SQLAlchemy ORM) | `backend/finance_pipeline/db.py` |

---

## 🗄️ Section 4 — Database Layer

| What to change | Affected File |
|---|---|
| Trip / User / Expense / Participant schema (Oracle) | `backend/main.py` — search for raw SQL near the relevant endpoint |
| Finance ML data schema (PostgreSQL) | `backend/finance_pipeline/db.py` — SQLAlchemy model classes |
| Oracle DB credentials / connection string | `backend/.env` → keys: `DB_USER`, `DB_PASSWORD`, `DB_DSN` |
| PostgreSQL connection string | `backend/.env` → key: `FINANCE_DATABASE_URL` |
| One-off DB column migration | `backend/alter_db.py` |

---

## ⚙️ Section 5 — Infrastructure & Config Files

| What to change | Affected File |
|---|---|
| CI/CD deploy pipeline (build steps, SSH, restart) | `.github/workflows/deploy.yml` |
| UAT backend restart script | `backend/restart_backend_uat.sh` |
| Production backend restart script | `backend/restart_backend.sh` |
| Python package dependencies | `backend/requirements.txt` |
| Vite dev proxy / build config | `frontend/vite.config.js` |
| Tailwind design tokens / colour theme | `frontend/tailwind.config.js` |
| Global CSS variables, fonts, dark mode | `frontend/src/index.css` |
| Nginx routing / SSL config (on server) | SSH to server → `/etc/nginx/sites-enabled/` |
| Cron job schedule (on server) | SSH to server → `crontab -e` |
| UAT AI agent model selection | `agent_worker.py` → `OLLAMA_MODEL` variable |

---

## ✅ Good Ticket Examples

### Example 1 — UI Text / Icon Change
```
Title: [FIN-16] Replace globe emoji with rupee sign in Global Expenses title

Description:
  What screen:       Global Expenses screen (NOT the Finance/XGBoost screen)
  What to change:    The emoji in the page title heading
  Current value:     🌍 Global Expenses
  Expected value:    ₹ Global Expenses

Affected File:  frontend/src/components/GlobalExpenseDashboard.jsx
Affected Line:  Search for "🌍 Global Expenses" in the file (~line 461)

BEFORE: <h3 ...>🌍 Global Expenses</h3>
AFTER:  <h3 ...>₹ Global Expenses</h3>
```

### Example 2 — Backend Logic Change
```
Title: [TRIP-22] Return 404 when trip not found instead of 500 error

Description:
  What feature:      Trip fetch API
  Current behaviour: Returns HTTP 500 when trip_id doesn't exist
  Expected:          Returns HTTP 404 with message "Trip not found"

Affected File:  backend/main.py ~372
Affected Line:  GET /api/trips/{trip_id} endpoint

BEFORE: raise Exception("No rows found")
AFTER:  raise HTTPException(status_code=404, detail="Trip not found")
```

### Example 3 — ML Pipeline Change
```
Title: [FIN-20] Change XGBoost prediction confidence threshold from 0.6 to 0.7

Description:
  Current value:  confidence threshold = 0.6
  Expected value: confidence threshold = 0.7

Affected File:  backend/finance_pipeline/eod_predictor.py
Affected Line:  Search for "0.6" near "confidence" or "threshold"
```

### Example 4 — New Feature (Backend + Frontend)
```
Title: [TRIP-30] Add "notes" field to trip expenses

Description:
  What feature:  In-trip expense — add optional free text notes field
  Backend:       Add "notes" column to expense insert/fetch SQL
  Frontend:      Add notes input field in expense form UI

Affected File (backend):  backend/main.py ~950
Affected File (frontend): frontend/src/components/ExpenseTracker.jsx
```

---

## ❌ Bad Ticket Examples (What NOT to Do)

| Bad ticket wording | Problem | Fix |
|---|---|---|
| "Change the icon in the finance screen" | "Finance screen" is ambiguous | Specify `GlobalExpenseDashboard.jsx` or `FinanceDashboard.jsx` |
| "Fix the bug in the expense logic" | No file, no line, no before/after | Add Affected File + current vs expected behaviour |
| "Update the global expense dashboard title" | Missing Affected File field | Add: `frontend/src/components/GlobalExpenseDashboard.jsx` |
| "Fix the login issue" | No specifics | Which part? Signup? Biometric? What error? Which file? |
| "Improve performance" | Too vague | Specify which screen/API is slow and what to target |

---

*Last updated: 2026-07-23 | Maintained in: `docs/JIRA_GUIDE.md`*
