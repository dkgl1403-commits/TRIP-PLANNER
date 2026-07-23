# Screen: Dashboard & Global Navigation

This document covers the main dashboard view, trips summary, saved locations, and the global application header.

## 1. Components

### Header.jsx
  Purpose:  Global navigation bar and slide-in sidebar (hamburger menu). Sits globally inside `App.jsx`.
  Location: `frontend/src/components/Header.jsx`
  Props:    `user`, `onLogout`, `activeTab`, `onNavigateTab`, `onAdminDashboard`, `onSystemHealth`, `onFinanceDashboard`

### Dashboard.jsx & Dashboard.css
  Purpose:  Home screen — split into two cards: "Trip Management" and "Expense Management".
  Location: `frontend/src/components/Dashboard.jsx`, `frontend/src/components/Dashboard.css`
  State:    `trips[]`, `savedLocations[]`
  Props:    `user`, `activeTab` (controlled by `App.jsx` state), `onCreateTrip`, `onAiPlanTrip`, `onViewTrip`, `onOpenGlobalExpenses`
  Notes:    The Hero section is two separate glassmorphism cards side-by-side:
              - Left card: Trip Management (Plan manually + Plan with AI buttons)
              - Right card: Expense Management (Open Global Expenses button)

### GlobalExpenseDashboard.jsx  ← KEY COMPONENT
  Purpose:  Full-featured global expense management screen (NOT linked to any specific trip).
  Location: `frontend/src/components/GlobalExpenseDashboard.jsx`
  Props:    `user`, `onBack`
  Route:    `currentView === 'global-expenses'` in `App.jsx`
  ⚠️  NOT to be confused with `FinanceDashboard.jsx` (XGBoost ML stock prediction screen — unrelated)

  Layout (top to bottom):
    1. Header row — back button, title "🌍 Global Expenses" (emoji at line ~461 in JSX), [Settle Up] + [+ Add Expense] buttons
    2. Summary row — 🔴 "To Pay" card | SVG Donut Chart | 🟢 "To Receive" card
    3. Active Balances — list of people with unsettled balance, clickable → slide-in panel
    4. Recent Transactions — last 10 expenses, each with edit/delete, "View All →" link
    5. [Full Transaction View] — separate conditional render (showAllTransactions === true)
       - Filters: Person, Category, Date From, Date To, Reset
       - Shows all expenses filtered client-side
    6. [Per-User Slide-in Panel] — when a person row is clicked (drilldownUser state)
       - Shows transactions involving that user
       - "Settle Up with X" button pre-fills the settle modal

  State:
    expenses[], settlements[], balances{}, loading
    showAllTransactions (bool), drilldownUser (string|null)
    showModal, showSettleModal, editExpenseId, editTripId
    settleFrom, settleTo, settleAmount
    description, amount, category, payerName, splitMode
    expenseParticipants (chips array: [{name, login_id}])
    customSplits{}, personQuery, personResults[]
    filterUser, filterCategory, filterDateFrom, filterDateTo

  Add Expense Modal — Searchable People Picker:
    - Shows current user as a default chip (non-removable)
    - Search input calls `GET /api/users/search?q=&login_id=` (debounced 300ms)
    - Dropdown shows registered app users (max 10)
    - Clicking adds a chip; chips have × to remove
    - Split Mode: Equal (show per-person share) | Custom (number input per person)

  Donut Chart:
    - SVG-based, no external library
    - 3 segments: green (toReceive), red (toPay), grey (background)
    - Interactive hover tooltip showing segment label + amount

## 2. API Endpoints (backend/main.py)

### Dashboard Data (Oracle DB)
  `GET    /api/trips?login_id=X`                     — trip list
  `GET    /api/locations?login_id=X`                 — saved locations
  `POST   /api/locations`                            — add location
  `DELETE /api/locations/{location_id}`              — delete location

### Global Expense APIs
  `GET    /api/expenses/global?login_id=X`           — fetch all global expenses, settlements, balances, global_participants
  `POST   /api/expenses/global?login_id=X`           — add expense (creates hidden global trip if needed)
  `POST   /api/expenses/global/participants?login_id=X` — add a person to the global participant list
  `PUT    /api/trips/{trip_id}/expenses/{exp_id}`    — edit expense (works with global trip ID)
  `DELETE /api/trips/{trip_id}/expenses/{exp_id}`    — delete expense

### User Search API
  `GET    /api/users/search?q=&login_id=`            — search registered users by name (max 10, excludes requester)

## 3. Database Schema (Oracle DB)

  TABLE: `locations`
    `location_id`   UUID     PK
    `login_id`      FK       → users
    `name`          VARCHAR
    `lat`           FLOAT
    `lng`           FLOAT

  Global expenses stored in `trip_expenses` linked to a hidden trip:
    title = `__GLOBAL_EXPENSES_{login_id}__`  in `trips` table
    This hidden trip is auto-created by `POST /api/expenses/global`

## 4. Key Decisions & Notes

  - Global expenses use the SAME `trip_expenses` and `trip_expense_splits` tables as trip expenses.
  - The hidden global trip (title = `__GLOBAL_EXPENSES_{login_id}__`) should be EXCLUDED from
    the regular trip list UI (`GET /api/trips` filters out these hidden trips).
  - FIN-15 (Add Person with phone in ExpenseTracker) was REVERTED from `ExpenseTracker.jsx`.
    The "add person" feature for global context lives inside GlobalExpenseDashboard.jsx only.
