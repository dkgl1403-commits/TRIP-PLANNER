# Screen: Login & Authentication

This document covers the frontend and backend implementations of the authentication flow.

## 1. Components

### Login.jsx (14 KB) & Login.css
  Purpose:  Login / Signup / WebAuthn biometric authentication page
  Location: `frontend/src/components/Login.jsx`, `frontend/src/components/Login.css`
  State:    `activeTab` ('login' | 'signup'), `isLoading`, `error`
  Change:   Login form UI -> Login.jsx + Login.css (`.login-wrapper`, `.login-card`)

## 2. API Endpoints (backend/main.py)

### Authentication (Oracle DB)
  `POST   /api/auth/signup`                          line 86
  `POST   /api/auth/login`                           line 131
  `GET    /api/auth/biometric-status`                line 1429
  `GET    /api/auth/register-biometric/options`      line 1265
  `POST   /api/auth/register-biometric/verify`       line 1303
  `GET    /api/auth/login-biometric/options`         line 1344
  `POST   /api/auth/login-biometric/verify`          line 1362
  `DELETE /api/auth/disable-biometric`               line 1440

## 3. Database Schema (Oracle DB)

  TABLE: `users`
    `login_id`      VARCHAR  PK   Auto-generated: initials + 5 digits (e.g. DK12345)
    `password_hash` VARCHAR       Plain text for now (TODO: hash in production)
    `role`          VARCHAR       'USER' or 'ADMIN'
    `name`          VARCHAR
    `gender`        VARCHAR
    `phone`         VARCHAR       Unique
    `email`         VARCHAR       Unique
    `address`       VARCHAR

  TABLE: `biometric_credentials`
    `credential_id` VARCHAR  PK
    `login_id`      FK       -> users
    `public_key`    CLOB
    `sign_count`    NUMBER
