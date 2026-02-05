# Backend Developer Documentation

**Project:** Hilex Backend  
**Last Updated:** 04 Feb 2026  
**Version:** 1.0.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Database Models](#database-models)
4. [API Routes](#api-routes)
5. [Middlewares](#middlewares)
6. [Utilities](#utilities)
7. [Daily Updates](#daily-updates)

---

## 🔍 Overview

Hilex backend is a Node.js/Express-based REST API with MongoDB database. It provides authentication (OTP-based and social login) and user management functionality.

**Base URL:** `/api/v1`

---

## 🛠️ Tech Stack

| Technology | Version | Purpose                |
| ---------- | ------- | ---------------------- |
| Node.js    | -       | Runtime environment    |
| Express    | ^5.2.1  | Web framework          |
| MongoDB    | -       | Database               |
| Mongoose   | ^9.1.5  | ODM                    |
| JWT        | ^9.0.3  | Token-based auth       |
| Passport   | ^0.7.0  | Social auth strategies |
| Bcryptjs   | ^3.0.3  | Password hashing       |
| Nodemailer | ^7.0.13 | Email service          |
| Winston    | ^3.19.0 | Logging                |
| Helmet     | ^8.1.0  | Security headers       |
| Morgan     | ^1.10.1 | HTTP request logger    |
| Zod        | ^4.3.6  | Schema validation      |

---

## 📊 Database Models

### 1. User Model

**File:** `src/modules/auth/auth.model.js`  
**Collection:** `users`

#### Schema Fields

| Field                        | Type    | Required | Default | Description                           |
| ---------------------------- | ------- | -------- | ------- | ------------------------------------- |
| `email`                      | String  | ✅       | -       | User email (unique, lowercase)        |
| `role`                       | String  | ❌       | `user`  | User role (`user`, `vendor`, `admin`) |
| `firstName`                  | String  | ❌       | -       | User's first name                     |
| `lastName`                   | String  | ❌       | -       | User's last name                      |
| `phoneNumber`                | String  | ❌       | -       | Contact number                        |
| `gender`                     | String  | ❌       | `other` | Gender (`male`, `female`, `other`)    |
| `dob`                        | Date    | ❌       | -       | Date of birth                         |
| `country`                    | String  | ❌       | `India` | Country                               |
| `avatar`                     | String  | ❌       | -       | Profile picture URL                   |
| `address`                    | String  | ❌       | -       | User address                          |
| `zipcCode`                   | String  | ❌       | -       | ZIP/Postal code                       |
| `providers.local.isVerified` | Boolean | ❌       | `false` | Email verification status             |
| `providers.google`           | Object  | ❌       | -       | Google auth data (`id`, `email`)      |
| `providers.facebook`         | Object  | ❌       | -       | Facebook auth data (`id`, `email`)    |
| `providers.apple`            | Object  | ❌       | -       | Apple auth data (`id`, `email`)       |
| `otp`                        | String  | ❌       | -       | Hashed OTP (hidden)                   |
| `otpExpires`                 | Date    | ❌       | -       | OTP expiration (hidden)               |
| `isActive`                   | Boolean | ❌       | `true`  | Account status                        |
| `createdAt`                  | Date    | ✅       | Auto    | Creation timestamp                    |
| `updatedAt`                  | Date    | ✅       | Auto    | Update timestamp                      |

#### Indexes

- `email`: Unique index

---

## 🚀 API Routes

### Health Check

| Method | Endpoint  | Auth | Description       |
| ------ | --------- | ---- | ----------------- |
| `GET`  | `/health` | ❌   | API health status |

**Response:**

```
API is running...
```

---

### Auth Module (`/api/v1/auth`)

**File:** `src/modules/auth/auth.routes.js`

#### OTP-Based Authentication

| Method | Endpoint                   | Auth | Description           |
| ------ | -------------------------- | ---- | --------------------- |
| `POST` | `/api/v1/auth/request-otp` | ❌   | Request OTP via email |
| `POST` | `/api/v1/auth/verify-otp`  | ❌   | Verify OTP and login  |

**Request OTP:**

```json
{
  "email": "user@example.com"
}
```

**Verify OTP:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (Verify OTP):**

```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "jwt_token_here",
  "data": {
    "user": {
      "email": "user@example.com",
      "role": "user",
      ...
    }
  }
}
```

#### Social Authentication

| Method | Endpoint                         | Auth | Description             |
| ------ | -------------------------------- | ---- | ----------------------- |
| `GET`  | `/api/v1/auth/google`            | ❌   | Initiate Google OAuth   |
| `GET`  | `/api/v1/auth/google/callback`   | ❌   | Google OAuth callback   |
| `GET`  | `/api/v1/auth/facebook`          | ❌   | Initiate Facebook OAuth |
| `GET`  | `/api/v1/auth/facebook/callback` | ❌   | Facebook OAuth callback |
| `GET`  | `/api/v1/auth/apple`             | ❌   | Initiate Apple Sign In  |
| `POST` | `/api/v1/auth/apple/callback`    | ❌   | Apple Sign In callback  |

**Social Auth Flow:**

1. Redirect to OAuth provider
2. User authorizes
3. Callback receives user data
4. Redirect to frontend with access token: `${FRONTEND_URL}/auth-callback?token=${accessToken}`

---

### User Module (`/api/v1/users`)

**File:** `src/modules/users/user.routes.js`

> **Note:** All routes require JWT authentication

| Method  | Endpoint                  | Auth | Description                 |
| ------- | ------------------------- | ---- | --------------------------- |
| `GET`   | `/api/v1/users/me`        | ✅   | Get current user profile    |
| `PATCH` | `/api/v1/users/update-me` | ✅   | Update current user profile |

**Get Me Response:**

```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "firstName": "John",
    ...
  }
}
```

**Update Me Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+919876543210",
  "gender": "male",
  "dob": "1990-01-01",
  "country": "India",
  "address": "123 Main St",
  "zipcCode": "110001"
}
```

---

## 🔐 Middlewares

### 1. Authentication Middleware

**File:** `src/shared/middlewares/verifyToken.js`  
**Function:** `protect`

- Verifies JWT token from `Authorization` header
- Attaches user data to `req.user`
- Used by: User routes

### 2. Role-Based Access Control

**File:** `src/shared/middlewares/roleMiddleware.js`

- Controls access based on user roles (`user`, `vendor`, `admin`)

### 3. Error Handler

**File:** `src/shared/middlewares/errorHandler.js`

- Centralized error handling
- Formats error responses

### 4. Security Middlewares

- **Helmet:** HTTP security headers
- **CORS:** Cross-origin resource sharing
- **Morgan:** HTTP request logging (development only)

---

## 🛠️ Utilities

### 1. JWT Utils

**File:** `src/shared/utils/jwt.js`  
**Function:** `generateTokens(userId)`

- Generates access token (JWT)
- Generates refresh token (stored in HTTP-only cookie)

### 2. Logger

**File:** `src/shared/utils/logger.js`

- Winston-based logging
- Logs to console and files (`logs/` directory)

### 3. Email Service

**File:** `src/shared/utils/sendEmail.js`

- Nodemailer-based email sending
- Used for OTP emails

### 4. Database Connection

**File:** `src/shared/config/db.js`

- MongoDB connection via Mongoose

### 5. Passport Config

**File:** `src/shared/config/passport.js`

- Passport strategies for Google, Facebook, Apple OAuth

---

## 📅 Daily Updates

### 04 Feb 2026

**Added:**

- ✅ Initial documentation created
- ✅ User model documented
- ✅ Auth module (OTP + Social Login) documented
- ✅ User module (getMe, updateMe) documented
- ✅ All middlewares and utilities documented

---

## 📝 Notes for Developers

1. **Authentication Flow:**
   - OTP-based: Request OTP → Verify OTP → Get Access Token
   - Social: Redirect to provider → Callback → Redirect to frontend with token

2. **JWT Token:**
   - Access token sent in response body
   - Refresh token stored in HTTP-only cookie (7 days expiry)

3. **Protected Routes:**
   - All `/api/v1/users/*` routes require JWT authentication
   - Send token in header: `Authorization: Bearer <access_token>`

4. **Environment Variables:**
   - Check `.env` file for configuration
   - Required: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, email configs, OAuth credentials

---

**For new API additions:** Add entry under "Daily Updates" section with date and description.
