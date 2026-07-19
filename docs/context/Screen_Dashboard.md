# Screen: Dashboard & Global Navigation

This document covers the main dashboard view, trips summary, saved locations, and the global application header.

## 1. Components

### Header.jsx
  Purpose:  Global navigation bar and slide-in sidebar (hamburger menu). Sits globally inside `App.jsx`.
  Location: `frontend/src/components/Header.jsx`
  Props:    `user`, `onLogout`, `activeTab`, `onNavigateTab`, `onAdminDashboard`, `onSystemHealth`, `onFinanceDashboard`

### Dashboard.jsx (17 KB) & Dashboard.css
  Purpose:  Home screen — trip cards, saved locations, user profile tab, and split welcome card.
  Location: `frontend/src/components/Dashboard.jsx`, `frontend/src/components/Dashboard.css`
  State:    `trips[]`, `savedLocations[]`
  Props:    `user`, `activeTab` (controlled by `App.jsx` state), `onCreateTrip`, `onAiPlanTrip`, `onViewTrip`, `onOpenGlobalExpenses`
  Notes:    The Hero section is split into two portions: Trip Management and Expense Management.

### GlobalExpenseDashboard.jsx
  Purpose:  Global dashboard for managing expenses unlinked to specific trips. Displays user's net balances across all trips.
  Location: `frontend/src/components/GlobalExpenseDashboard.jsx`
  Props:    `user`, `onBack`
  API:      `GET /api/expenses/global`, `POST /api/expenses/global`, `PUT /api/trips/:id/expenses/:exp_id`, `DELETE /api/trips/:id/expenses/:exp_id`

## 2. API Endpoints (backend/main.py)

### Dashboard Data (Oracle DB)
  `GET    /api/trips?login_id=X`                     line 332
  `GET    /api/locations?login_id=X`                 line 1155
  `POST   /api/locations`                            line 1186
  `DELETE /api/locations/{location_id}`              line 1208

## 3. Database Schema (Oracle DB)

  TABLE: `locations`
    `location_id`   UUID     PK
    `login_id`      FK       -> users
    `name`          VARCHAR
    `lat           FLOAT
    `lng           FLOAT
