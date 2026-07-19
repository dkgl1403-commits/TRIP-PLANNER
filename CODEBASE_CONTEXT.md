# TRIP Planner — Codebase Context

To improve efficiency, the massive codebase context has been divided into screen-specific documents. When building or modifying a feature, please consult the relevant context file below in the `docs/context/` directory.

## Core & Global
* **[Core Architecture & Conventions](docs/context/Core_Architecture.md)**
  Overview of the stack, frontend routing model, global styles, and CI/CD/infrastructure configuration.

## Screen-Specific Context
* **[Login & Authentication](docs/context/Screen_Login.md)**
  Covers the `Login.jsx` flow, WebAuthn biometrics, and the `users` database table.
* **[Dashboard & Navigation](docs/context/Screen_Dashboard.md)**
  Covers the `Dashboard.jsx` home screen, `Header.jsx`, and the trips/locations list APIs.
* **[Trip Management](docs/context/Screen_TripManagement.md)**
  Covers `CreateTrip.jsx`, `AiCreateTrip.jsx`, and the massive `TripDetails.jsx` (including the map and expense tracker).
* **[Finance Dashboard](docs/context/Screen_Finance.md)**
  Covers `FinanceDashboard.jsx`, the ML Python background pipeline, and PostgreSQL database schemas.
* **[Admin & System Health](docs/context/Screen_Admin_System.md)**
  Covers the admin user-management panel and server monitoring dashboard.
