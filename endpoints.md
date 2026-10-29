# CoreTeam REST API Documentation

Comprehensive API documentation for the **CoreTeam** Employee Management System backend.

---

## 📌 Table of Contents

1. [Overview & Architecture](#overview--architecture)
2. [Base URL & Environments](#base-url--environments)
3. [Authentication & Authorization](#authentication--authorization)
4. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
5. [Server Health Check](#server-health-check)
6. [Authentication Endpoints (`/api/auth`)](#authentication-endpoints-apiauth)
7. [Employee Management Endpoints (`/api/employees`)](#employee-management-endpoints-apiemployees)
8. [Attendance Endpoints (`/api/attendance`)](#attendance-endpoints-apiattendance)
9. [Leave Management Endpoints (`/api/leave`)](#leave-management-endpoints-apileave)
10. [Payslip Endpoints (`/api/payslips`)](#payslip-endpoints-apipayslips)
11. [Dashboard Endpoints (`/api/dashboard`)](#dashboard-endpoints-apidashboard)
12. [User Profile Endpoints (`/api/profile`)](#user-profile-endpoints-apiprofile)
13. [Inngest Background Workflows & Cron (`/api/inngest`)](#inngest-background-workflows--cron-apiinngest)
14. [Data Models & Schemas](#data-models--schemas)
15. [Status Codes & Error Handling](#status-codes--error-handling)

---

## 🏗 Overview & Architecture

CoreTeam backend is built on **Node.js**, **Express 5**, **MongoDB (Mongoose 9)**, and **Inngest**.

- **Routing:** Express Router modular routes mounted under `/api/*`.
- **Authentication:** Stateless JSON Web Tokens (JWT) signed with `HS256` algorithm, expiring in 24 hours (`1d`).
- **Authorization:** Express middleware inspecting `Authorization: Bearer <token>` and verifying session roles (`Admin` vs `Employee`).
- **Body Parsing:** Standard `express.json()` and `multer().none()` for multipart/form-data.
- **Event-Driven Workflows:** Inngest engine for asynchronous background jobs (automated checkout, reminders, and daily cron audits).
- **Email Notifications:** Nodemailer integration with SMTP credentials.

---

## 🌐 Base URL & Environments

| Environment | Base URL | Note |
| :--- | :--- | :--- |
| **Local Development** | `http://localhost:4000/api` | Default development port |
| **Production Server** | `https://your-production-domain.com/api` | Configured via `PORT` and environment vars |

### Standard Request Headers
```http
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication & Authorization

Protected endpoints require a valid JWT passed in the HTTP `Authorization` request header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### JWT Payload Schema
When decoded, the session token contains:
```json
{
  "userId": "664b38d92837f482a1b94091",
  "role": "Admin",
  "email": "admin@coreteam.com",
  "iat": 1729000000,
  "exp": 1729086400
}
```

---

## 🛡 Role-Based Access Control (RBAC)

CoreTeam recognizes two primary user roles:

| Endpoint Resource | Public | Employee | Admin | Notes |
| :--- | :---: | :---: | :---: | :--- |
| `GET /` | ✅ | ✅ | ✅ | Server health status |
| `POST /api/auth/login` | ✅ | ✅ | ✅ | Authenticates and returns JWT |
| `GET /api/auth/session` | ❌ | ✅ | ✅ | Validates active session |
| `POST /api/auth/change-password` | ❌ | ✅ | ✅ | Changes caller's password |
| `GET /api/employees` | ❌ | ❌ | ✅ | Lists all employees (filterable by dept) |
| `POST /api/employees` | ❌ | ❌ | ✅ | Creates user and employee records |
| `PUT /api/employees/:id` | ❌ | ❌ | ✅ | Updates employee details & credentials |
| `DELETE /api/employees/:id` | ❌ | ❌ | ✅ | Soft deletes employee (`isDeleted: true`) |
| `POST /api/attendance` | ❌ | ✅ | ❌ | Clock-in / clock-out toggle |
| `GET /api/attendance` | ❌ | ✅ | ❌ | History for authenticated employee |
| `POST /api/leave/apply` | ❌ | ✅ | ❌ | Submit leave application |
| `GET /api/leave` | ❌ | ✅ | ✅ | Employees view own; Admins view all |
| `PATCH /api/leave/:id` | ❌ | ❌ | ✅ | Approve or reject leave application |
| `POST /api/payslips` | ❌ | ❌ | ✅ | Generates employee payslip |
| `GET /api/payslips` | ❌ | ✅ | ✅ | Employees view own; Admins view all |
| `GET /api/payslips/:id` | ❌ | ✅ | ✅ | Admins view any; Employees view own |
| `GET /api/dashboard` | ❌ | ✅ | ✅ | Role-tailored metrics & summaries |
| `GET /api/profile` | ❌ | ✅ | ✅ | Profile details for current user |
| `POST /api/profile` | ❌ | ✅ | ❌ | Updates bio for current employee |
| `ALL /api/inngest` | ✅ | ✅ | ✅ | Inngest webhook execution endpoint |

---

## 💓 Server Health Check

### Health Check Endpoint
Returns server status confirmation.

- **Method:** `GET`
- **Path:** `/`
- **Access:** Public
- **Headers:** None required

#### Response
- **Status:** `200 OK`
- **Content-Type:** `text/html; charset=utf-8`
- **Body:**
```text
Server is running
```


---

## 🔑 Authentication Endpoints (`/api/auth`)

### 1. User Login
Authenticates an administrator or employee using their email and password, returning a JWT token valid for 24 hours.

- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Access:** Public
- **Headers:** `Content-Type: application/json`

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `email` | `string` | **Yes** | Registered email address of user |
| `password` | `string` | **Yes** | Plaintext password |
| `role_type` | `string` | No | Optional role validation (`"admin"` or `"employee"`). If specified, verifies the account matches the requested role |

```json
{
  "email": "employee@example.com",
  "password": "Password123!",
  "role_type": "employee"
}
```

#### Success Response
- **Status:** `200 OK`
```json
{
  "success": true,
  "user": {
    "userId": "664b38d92837f482a1b94091",
    "role": "Employee",
    "email": "employee@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses
- **Status:** `400 Bad Request` - Missing email or password
```json
{
  "error": "Email and password are required"
}
```
- **Status:** `401 Unauthorized` - Invalid email, password, or mismatched role
```json
{
  "error": "Invalid credentials"
}
```
- **Status:** `500 Internal Server Error` - Database or execution failure
```json
{
  "success": false,
  "message": "Failed to login"
}
```

---

### 2. Verify Session
Validates the caller's JWT token and returns their decoded session data.

- **Method:** `GET`
- **Path:** `/api/auth/session`
- **Access:** Protected (`Admin`, `Employee`)
- **Headers:** `Authorization: Bearer <token>`

#### Success Response
- **Status:** `200 OK`
```json
{
  "success": true,
  "session": {
    "userId": "664b38d92837f482a1b94091",
    "role": "Employee",
    "email": "employee@example.com",
    "iat": 1729000000,
    "exp": 1729086400
  }
}
```

#### Error Response
- **Status:** `401 Unauthorized` - Token missing, malformed, or expired
```json
{
  "error": "Unauthorized"
}
```

---

### 3. Change Password
Changes the password of the currently authenticated user.

- **Method:** `POST`
- **Path:** `/api/auth/change-password`
- **Access:** Protected (`Admin`, `Employee`)
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `oldPassword` | `string` | **Yes** | Existing plaintext password |
| `newPassword` | `string` | **Yes** | New plaintext password to be hashed with bcrypt (10 salt rounds) |

```json
{
  "oldPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword456@"
}
```

#### Success Response
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Error Responses
- **Status:** `400 Bad Request` - Missing passwords or incorrect old password
```json
{
  "error": "Old password and new password are required"
}
```
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```
- **Status:** `404 Not Found` - User account does not exist
```json
{
  "success": false,
  "message": "User not found"
}
```
- **Status:** `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Failed to change password"
}
```
