# Screen: Dashboard & Global Navigation

This document covers the main dashboard view, trips summary, saved locations, and the global application header.

## 1. Components

### Header.jsx
  Purpose:  Global navigation bar and slide-in sidebar (hamburger menu). Sits globally inside `App.jsx`.
  Location: `frontend/src/components/Header.jsx`
  Props:    `user`, `onLogout`, `activeTab`, `onNavigateTab`, `onAdminDashboard`, `onSystemHealth`, `onFinanceDashboard`

### Dashboard.jsx (17 KB) & Dashboard.css
  Purpose:  Home screen — trip cards, saved locations, user profile tab
  Location: `frontend/src/components/Dashboard.jsx`, `frontend/src/components/Dashboard.css`
  State:    `trips[]`, `savedLocations[]`
  Props:    `user`, `activeTab` (controlled by `App.jsx` state), `onCreateTrip`, `onAiPlanTrip`, `onViewTrip`
  Change:   Modify trip card layout -> Dashboard.jsx render + Dashboard.css `.trip-card`
  Change:   Dashboard background -> Dashboard.css `.dashboard-container` or App.css `.bg-overlay`

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
