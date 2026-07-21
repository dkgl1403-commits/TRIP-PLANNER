# Screen: Trip Management & Details

This document covers everything related to creating, viewing, and managing a specific trip, including maps and expenses.

## 1. Components

### CreateTrip.jsx (12 KB) & CreateTrip.css
  Purpose:  Manual trip creation form with location autocomplete and registered user participant search
  Location: `frontend/src/components/CreateTrip.jsx`, `frontend/src/components/CreateTrip.css`
  External: Nominatim OSM API (browser-direct, no backend proxy)
  Note:     Participants are restricted to registered users searched via `/api/users/search`.

### AiCreateTrip.jsx (23 KB) & AiCreateTrip.css
  Purpose:  AI-assisted trip creation via Gemini API — multi-step wizard
  Location: `frontend/src/components/AiCreateTrip.jsx`, `frontend/src/components/AiCreateTrip.css`
  Note:     Calls Gemini API directly from browser. No backend proxy involved.

### TripDetails.jsx (79 KB) & TripDetails.css
  Purpose:  Full trip view: edit details, live map, expenses, media, participants
  Location: `frontend/src/components/TripDetails.jsx`, `frontend/src/components/TripDetails.css`
  Sub-comps:`TripMap.jsx` (embedded), `ExpenseTracker.jsx` (embedded)
  Note:     Largest component in the application. Adding participants enforces registered user search via `/api/users/search`.

### TripMap.jsx (21 KB)
  Purpose:  Leaflet.js interactive map — participant markers, routes, checkpoints
  Location: `frontend/src/components/TripMap.jsx`
  Library:  react-leaflet

### ExpenseTracker.jsx (26 KB)
  Purpose:  Full expense management — add, edit, delete, split, balance calculation
  Location: `frontend/src/components/ExpenseTracker.jsx`
  Note:     Self-contained component, embedded inside `TripDetails.jsx`

## 2. API Endpoints (backend/main.py)

### Trips (Oracle DB)
  `POST   /api/trips`                                line 198
  `GET    /api/trips/{trip_id}`                      line 372
  `PUT    /api/trips/{trip_id}`                      line 508
  `POST   /api/trips/{trip_id}/start`                line 569
  `POST   /api/trips/{trip_id}/end`                  line 767
  `POST   /api/trips/{trip_id}/cancel`               line 747
  `POST   /api/trips/{trip_id}/checkin`              line 722
  `POST   /api/trips/{trip_id}/location`             line 592
  `GET    /api/trips/{trip_id}/live`                 line 642

### Participants (Oracle DB)
  `POST   /api/trips/{trip_id}/participants`         line 245
  `PUT    /api/trips/{trip_id}/participants`         line 269
  `DELETE /api/trips/{trip_id}/participants/{name}`  line 287

### Media (Oracle Object Storage)
  `GET    /api/trips/{trip_id}/media/upload_url`     line 827
  `POST   /api/trips/{trip_id}/media`                line 868
  `GET    /api/trips/{trip_id}/media`                line 888
  `GET    /api/upload/presign`                       line 304

### Expenses (Oracle DB)
  `POST   /api/trips/{trip_id}/expenses`             line 950
  `GET    /api/trips/{trip_id}/expenses`             line 991
  `PUT    /api/trips/{trip_id}/expenses/{id}`        line 1098
  `DELETE /api/trips/{trip_id}/expenses/{id}`        line 1141

## 3. Database Schema (Oracle DB)

  TABLE: `trips`
    `trip_id`       VARCHAR  UUID PK
    `login_id`      VARCHAR  FK -> users
    `title`         VARCHAR
    `start_date    DATE
    `end_date      DATE
    `source`        VARCHAR       JSON string: {lat, lng, name}
    `destination`   VARCHAR       JSON string: {lat, lng, name}
    `checkpoints`   CLOB          JSON array of waypoints
    `participants`  CLOB          JSON array of participant objects
    `status`        VARCHAR       'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    `created_at`    TIMESTAMP

  TABLE: `expenses`
    `expense_id`    UUID     PK
    `trip_id`       FK       -> trips
    `description`   VARCHAR
    `amount`        NUMBER
    `paid_by`       VARCHAR       login_id of payer
    `split_among`   CLOB          JSON array of login_ids

  TABLE: `trip_media`
    `media_id`      UUID     PK
    `trip_id`       FK       -> trips
    `s3_key`        VARCHAR       OCI Object Storage key
    `file_url`      VARCHAR       Public URL
    `uploaded_at`   TIMESTAMP
