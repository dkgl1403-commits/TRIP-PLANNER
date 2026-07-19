# Screen: Admin & System Health

This document covers the administrative tools and server monitoring dashboards.

## 1. Components

### AdminDashboard.jsx (5 KB)
  Purpose:  Admin panel — list all users, change user roles
  Location: `frontend/src/components/AdminDashboard.jsx`

### SystemHealthDashboard.jsx (10 KB)
  Purpose:  Server monitoring — CPU, RAM, disk, finance pipeline job statuses
  Location: `frontend/src/components/SystemHealthDashboard.jsx`

## 2. API Endpoints (backend/main.py)

### Admin / System
  `GET    /api/admin/users`                          line 1464
  `PUT    /api/admin/users/{id}/role`                line 1488
  `POST   /api/admin/trigger-news-fetch`             line 158
  `GET    /api/server-metrics`                       line 1222
  `GET    /api/system/health`                        line 1600
  `GET    /api/dev/logs`                             line 1451
  `GET    /api/migrate`                              line 667
