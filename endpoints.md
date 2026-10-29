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


---

## 👥 Employee Management Endpoints (`/api/employees`)

All endpoints in this section require `Admin` role privileges (`protect`, `protectAdmin`).

---

### 1. List All Employees
Fetches all employees sorted by creation date descending (`createdAt: -1`). Supports department filtering and populates user credentials.

- **Method:** `GET`
- **Path:** `/api/employees`
- **Access:** Protected (`Admin` only)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `department` | `string` | No | Filter by department name (e.g. `Engineering`, `Sales`) |

#### Success Response
- **Status:** `200 OK`
```json
[
  {
    "id": "664c39b1a29381001a4092b1",
    "_id": "664c39b1a29381001a4092b1",
    "userId": {
      "_id": "664c39b1a29381001a4092b0",
      "email": "sarah.connor@coreteam.com",
      "role": "Employee"
    },
    "firstName": "Sarah",
    "lastName": "Connor",
    "email": "sarah.connor@coreteam.com",
    "phone": "+1-555-0199",
    "position": "Senior Software Engineer",
    "department": "Engineering",
    "basicSalary": 85000,
    "allowances": 12000,
    "deductions": 5000,
    "employmentStatus": "Active",
    "joinDate": "2024-01-15T00:00:00.000Z",
    "isDeleted": false,
    "bio": "Full-stack developer specializing in React and Node.js.",
    "createdAt": "2024-05-21T06:15:45.120Z",
    "updatedAt": "2024-05-21T06:15:45.120Z",
    "user": {
      "email": "sarah.connor@coreteam.com",
      "role": "Employee"
    }
  }
]
```

#### Error Responses
- **Status:** `401 Unauthorized` - Token missing or caller role is not `Admin`
```json
{
  "error": "Unauthorized"
}
```
- **Status:** `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Failed to get employees"
}
```

---

### 2. Create Employee
Registers a new system user login and simultaneously generates their complete employee profile.

- **Method:** `POST`
- **Path:** `/api/employees`
- **Access:** Protected (`Admin` only)
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

#### Request Body
| Field | Type | Required | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `firstName` | `string` | **Yes** | — | Employee first name |
| `lastName` | `string` | **Yes** | — | Employee last name |
| `email` | `string` | **Yes** | — | Unique login email address |
| `password` | `string` | **Yes** | — | Initial plaintext password |
| `phone` | `string` | No | `""` | Contact phone number |
| `position` | `string` | No | `""` | Job title |
| `department` | `string` | No | `"Engineering"` | Department enum value |
| `basicSalary` | `number` | No | `0` | Base monthly salary |
| `allowances` | `number` | No | `0` | Monthly allowances |
| `deductions` | `number` | No | `0` | Deductions (taxes, insurance) |
| `joinDate` | `string (ISO)` | No | Current Date | Date joined |
| `role` | `string` | No | `"Employee"` | `"Admin"` or `"Employee"` |
| `bio` | `string` | No | `""` | Short biography/notes |

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@coreteam.com",
  "password": "TemporaryPassword123!",
  "phone": "+1-555-0144",
  "position": "Frontend Developer",
  "department": "Engineering",
  "basicSalary": 75000,
  "allowances": 8000,
  "deductions": 3500,
  "joinDate": "2024-06-01",
  "role": "Employee",
  "bio": "Passionate UI engineer."
}
```

#### Success Response
- **Status:** `201 Created`
```json
{
  "success": true,
  "employee": {
    "_id": "664c3aa0a29381001a4092c2",
    "userId": "664c3aa0a29381001a4092c1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@coreteam.com",
    "phone": "+1-555-0144",
    "position": "Frontend Developer",
    "department": "Engineering",
    "basicSalary": 75000,
    "allowances": 8000,
    "deductions": 3500,
    "joinDate": "2024-06-01T00:00:00.000Z",
    "employmentStatus": "Active",
    "isDeleted": false,
    "bio": "Passionate UI engineer.",
    "createdAt": "2024-05-21T06:20:00.000Z",
    "updatedAt": "2024-05-21T06:20:00.000Z"
  }
}
```

#### Error Responses
- **Status:** `400 Bad Request` - Missing mandatory fields or email already exists
```json
{
  "error": "Missing required fields"
}
```
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 3. Update Employee
Modifies an existing employee profile and synchronizes updates with their User credentials (such as email, password, and role).

- **Method:** `PUT`
- **Path:** `/api/employees/:id`
- **Access:** Protected (`Admin` only)
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Path Parameters:**
  | Parameter | Type | Description |
  | :--- | :--- | :--- |
  | `id` | `string` | MongoDB ObjectId of Employee document |

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe.updated@coreteam.com",
  "phone": "+1-555-9988",
  "position": "Lead Frontend Architect",
  "department": "Engineering",
  "basicSalary": 92000,
  "allowances": 10000,
  "deductions": 4000,
  "employmentStatus": "Active",
  "bio": "Promoted to tech lead.",
  "role": "Employee"
}
```

#### Success Response
- **Status:** `201 Created`
```json
{
  "success": true
}
```

#### Error Responses
- **Status:** `400 Bad Request` - Email already taken by another account
```json
{
  "success": false,
  "message": "Email already exists"
}
```
- **Status:** `404 Not Found` - Employee not found
```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

### 4. Delete Employee (Soft Delete)
Soft-deletes an employee record. Sets `isDeleted: true` and switches `employmentStatus: "Inactive"`. Prevents attendance clocking and leave submissions.

- **Method:** `DELETE`
- **Path:** `/api/employees/:id`
- **Access:** Protected (`Admin` only)
- **Headers:** `Authorization: Bearer <token>`
- **Path Parameters:**
  | Parameter | Type | Description |
  | :--- | :--- | :--- |
  | `id` | `string` | MongoDB ObjectId of Employee document |

#### Success Response
- **Status:** `201 Created`
```json
{
  "success": true
}
```

#### Error Responses
- **Status:** `404 Not Found`
```json
{
  "success": false,
  "message": "Employee not found"
}
```


---

## ⏱ Attendance Endpoints (`/api/attendance`)

All attendance endpoints require an authenticated user with an associated Employee record (`protect`).

---

### 1. Clock In / Clock Out Toggle
Toggles the attendance state for the current day. Automatically detects whether to initiate clock-in, complete clock-out, or indicate already completed attendance for today.

- **Method:** `POST`
- **Path:** `/api/attendance`
- **Access:** Protected (`Employee`)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** None required

#### Workflow Logic:
1. **Clock In (`type: "checkIn"`):**
   - If no attendance document exists for today (`00:00:00` UTC/Local), creates a new attendance log.
   - Status is marked `"Late"` if current time is past 09:00 AM (`hour > 9` or `hour == 9 && minutes > 0`), otherwise `"Present"`.
   - Asynchronously triggers Inngest background event `employee/check-out`.
2. **Clock Out (`type: "checkOut"`):**
   - If checked in today but `checkOut` is null, records current time as `checkOut`.
   - Computes `workingHours = (checkOut - checkIn) / 3600000` (rounded to 2 decimal places).
   - Classifies `dayType`:
     - $\ge 8.0\text{ hours}$ $\rightarrow$ `"Full Day"`
     - $\ge 6.0\text{ hours}$ $\rightarrow$ `"Three Quarter Day"`
     - $\ge 4.0\text{ hours}$ $\rightarrow$ `"Half Day"`
     - $< 4.0\text{ hours}$ $\rightarrow$ `"Short Day"`
3. **Already Completed (`type: "clockedOut"`):**
   - If both `checkIn` and `checkOut` are already recorded for today.

#### Responses

##### A. Clock-In Response
- **Status:** `200 OK`
```json
{
  "message": "Clocked in successfully",
  "success": true,
  "type": "checkIn",
  "data": {
    "_id": "664c3c10a29381001a4092d5",
    "employeeId": "664c39b1a29381001a4092b1",
    "date": "2024-05-21T00:00:00.000Z",
    "checkIn": "2024-05-21T08:55:12.345Z",
    "status": "Present",
    "checkOut": null,
    "workingHours": null,
    "dayType": null,
    "createdAt": "2024-05-21T08:55:12.345Z",
    "updatedAt": "2024-05-21T08:55:12.345Z"
  }
}
```

##### B. Clock-Out Response
- **Status:** `200 OK`
```json
{
  "message": "Clocked out successfully",
  "success": true,
  "type": "checkOut",
  "data": {
    "_id": "664c3c10a29381001a4092d5",
    "employeeId": "664c39b1a29381001a4092b1",
    "date": "2024-05-21T00:00:00.000Z",
    "checkIn": "2024-05-21T08:55:12.345Z",
    "checkOut": "2024-05-21T17:15:22.100Z",
    "status": "Present",
    "workingHours": 8.34,
    "dayType": "Full Day",
    "createdAt": "2024-05-21T08:55:12.345Z",
    "updatedAt": "2024-05-21T17:15:22.100Z"
  }
}
```

##### C. Already Clocked Out
- **Status:** `200 OK`
```json
{
  "success": true,
  "type": "clockedOut"
}
```

#### Error Responses
- **Status:** `403 Forbidden` - Deactivated employee account
```json
{
  "error": "Your account is deactivated. You cannot clock in/out."
}
```
- **Status:** `404 Not Found` - Employee profile not located
```json
{
  "error": "Employee not found"
}
```

---

### 2. Get Attendance History
Retrieves historical attendance records for the calling employee, sorted by date descending.

- **Method:** `GET`
- **Path:** `/api/attendance`
- **Access:** Protected (`Employee`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :---: | :--- | :--- |
  | `limit` | `number` | No | `30` | Maximum number of log records to return |

#### Success Response
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "664c3c10a29381001a4092d5",
      "employeeId": "664c39b1a29381001a4092b1",
      "date": "2024-05-21T00:00:00.000Z",
      "checkIn": "2024-05-21T08:55:12.345Z",
      "checkOut": "2024-05-21T17:15:22.100Z",
      "status": "Present",
      "workingHours": 8.34,
      "dayType": "Full Day",
      "createdAt": "2024-05-21T08:55:12.345Z"
    }
  ],
  "employee": {
    "isDeleted": false
  }
}
```


---

## 🏖 Leave Management Endpoints (`/api/leave`)

---

### 1. Apply for Leave
Submits a new time-off application for the authenticated employee. Triggers an Inngest background event (`leave/pending`) to send reminders to the administrator.

- **Method:** `POST`
- **Path:** `/api/leave/apply`
- **Access:** Protected (`Employee`)
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

#### Request Body
| Field | Type | Required | Allowed Values / Format | Description |
| :--- | :--- | :---: | :--- | :--- |
| `type` | `string` | **Yes** | `"Sick"`, `"Casual"`, `"Annual"`, `"SICK"`, `"CASUAL"`, `"ANNUAL"` | Category of leave |
| `startDate` | `string (ISO)` | **Yes** | Future date | First day of requested leave |
| `endDate` | `string (ISO)` | **Yes** | $\ge \text{startDate}$ | Final day of requested leave |
| `reason` | `string` | **Yes** | Text string | Justification for time off |

```json
{
  "type": "Casual",
  "startDate": "2026-11-05",
  "endDate": "2026-11-08",
  "reason": "Family vacation and travel."
}
```

#### Validation Rules:
- `startDate` and `endDate` must both be strictly after today's date (`> today 00:00:00`).
- `endDate` must be greater than or equal to `startDate`.

#### Success Response
- **Status:** `200 OK`
```json
{
  "message": "Leave applied successfully",
  "success": true,
  "data": {
    "_id": "664c3d82a29381001a4092ee",
    "employeeId": "664c39b1a29381001a4092b1",
    "type": "Casual",
    "startDate": "2026-11-05T00:00:00.000Z",
    "endDate": "2026-11-08T00:00:00.000Z",
    "reason": "Family vacation and travel.",
    "status": "Pending",
    "createdAt": "2026-10-29T19:30:00.000Z",
    "updatedAt": "2026-10-29T19:30:00.000Z"
  }
}
```

#### Error Responses
- **Status:** `400 Bad Request` - Missing fields or invalid date logic
```json
{
  "error": "All fields are required, Some fields are missing."
}
```
```json
{
  "error": "Start date and end date must be greater than today"
}
```
```json
{
  "error": "End date must be greater than start date"
}
```
- **Status:** `403 Forbidden` - Account deactivated
```json
{
  "error": "Your account is deactivated. You cannot apply for leave."
}
```

---

### 2. List Leave Applications
Retrieves leave applications based on the caller's role.

- **Method:** `GET`
- **Path:** `/api/leave`
- **Access:** Protected (`Admin`, `Employee`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters (Admin only):**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `status` | `string` | No | Filter by `"Pending"`, `"Approved"`, or `"Rejected"` |

#### Role-Based Behavior:
- **Admin:** Returns all applications across the organization with populated employee details (`firstName`, `lastName`, `department`, `position`).
- **Employee:** Returns only applications submitted by the caller.

#### Admin Success Response
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "664c3d82a29381001a4092ee",
      "_id": "664c3d82a29381001a4092ee",
      "type": "Casual",
      "startDate": "2026-11-05T00:00:00.000Z",
      "endDate": "2026-11-08T00:00:00.000Z",
      "reason": "Family vacation and travel.",
      "status": "Pending",
      "employeeId": "664c39b1a29381001a4092b1",
      "employee": {
        "_id": "664c39b1a29381001a4092b1",
        "firstName": "Sarah",
        "lastName": "Connor",
        "email": "sarah.connor@coreteam.com",
        "department": "Engineering",
        "position": "Senior Software Engineer"
      }
    }
  ]
}
```

#### Employee Success Response
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "664c3d82a29381001a4092ee",
      "employeeId": "664c39b1a29381001a4092b1",
      "type": "Casual",
      "startDate": "2026-11-05T00:00:00.000Z",
      "endDate": "2026-11-08T00:00:00.000Z",
      "reason": "Family vacation and travel.",
      "status": "Pending",
      "createdAt": "2026-10-29T19:30:00.000Z"
    }
  ],
  "employee": {
    "id": "664c39b1a29381001a4092b1",
    "firstName": "Sarah",
    "lastName": "Connor",
    "department": "Engineering"
  }
}
```

---

### 3. Update Leave Status
Approves, rejects, or resets a leave application.

- **Method:** `PATCH`
- **Path:** `/api/leave/:id`
- **Access:** Protected (`Admin` only)
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Path Parameters:**
  | Parameter | Type | Description |
  | :--- | :--- | :--- |
  | `id` | `string` | MongoDB ObjectId of LeaveApplication |

#### Request Body
```json
{
  "status": "Approved"
}
```
*Allowed values:* `"Approved"`, `"Rejected"`, `"Pending"`

#### Success Response
- **Status:** `200 OK`
```json
{
  "message": "Leave status updated successfully",
  "success": true,
  "data": {
    "_id": "664c3d82a29381001a4092ee",
    "employeeId": "664c39b1a29381001a4092b1",
    "type": "Casual",
    "startDate": "2026-11-05T00:00:00.000Z",
    "endDate": "2026-11-08T00:00:00.000Z",
    "reason": "Family vacation and travel.",
    "status": "Approved",
    "updatedAt": "2026-10-29T19:35:00.000Z"
  }
}
```

#### Error Responses
- **Status:** `400 Bad Request`
```json
{
  "error": "Status is required"
}
```
```json
{
  "error": "Invalid status"
}
```


---

## 💵 Payslip Endpoints (`/api/payslips`)

---

### 1. Create Payslip
Generates a monthly payroll record for an employee. Computes net salary as `basicSalary + allowances - deductions`.

- **Method:** `POST`
- **Path:** `/api/payslips`
- **Access:** Protected (`Admin` only)
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `employeeId` | `string` | **Yes** | MongoDB ObjectId of Employee |
| `month` | `number` | **Yes** | Payroll month (`1` to `12`) |
| `year` | `number` | **Yes** | Payroll year (e.g. `2026`) |
| `basicSalary` | `number` | **Yes** | Base monthly salary |
| `allowances` | `number` | No | Additional allowances (default: `0`) |
| `deductions` | `number` | No | Deductions such as tax and provident fund (default: `0`) |

```json
{
  "employeeId": "664c39b1a29381001a4092b1",
  "month": 10,
  "year": 2026,
  "basicSalary": 85000,
  "allowances": 12000,
  "deductions": 5000
}
```

#### Success Response
- **Status:** `201 Created`
```json
{
  "message": "Payslip created successfully",
  "success": true,
  "data": {
    "_id": "664c3f50a29381001a409301",
    "employeeId": "664c39b1a29381001a4092b1",
    "month": 10,
    "year": 2026,
    "basicSalary": 85000,
    "allowances": 12000,
    "deductions": 5000,
    "netSalary": 92000,
    "createdAt": "2026-10-29T20:00:00.000Z",
    "updatedAt": "2026-10-29T20:00:00.000Z"
  }
}
```

#### Error Responses
- **Status:** `400 Bad Request`
```json
{
  "message": "Missing fields are required"
}
```

---

### 2. List Payslips
Retrieves payroll history based on role permissions.

- **Method:** `GET`
- **Path:** `/api/payslips`
- **Access:** Protected (`Admin`, `Employee`)
- **Headers:** `Authorization: Bearer <token>`

#### Role-Based Behavior:
- **Admin:** Returns all payslips sorted by `createdAt: -1` with populated `employeeId`.
- **Employee:** Returns only payslips issued to the logged-in employee.

#### Success Response
- **Status:** `200 OK`
```json
{
  "message": "Payslips fetched successfully",
  "success": true,
  "data": [
    {
      "id": "664c3f50a29381001a409301",
      "_id": "664c3f50a29381001a409301",
      "employeeId": "664c39b1a29381001a4092b1",
      "month": 10,
      "year": 2026,
      "basicSalary": 85000,
      "allowances": 12000,
      "deductions": 5000,
      "netSalary": 92000,
      "createdAt": "2026-10-29T20:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Payslip by ID
Retrieves details for an individual payslip.

- **Method:** `GET`
- **Path:** `/api/payslips/:id`
- **Access:** Protected (`Admin`, `Employee`)
- **Headers:** `Authorization: Bearer <token>`
- **Path Parameters:**
  | Parameter | Type | Description |
  | :--- | :--- | :--- |
  | `id` | `string` | MongoDB ObjectId of Payslip |

#### Access Restrictions:
- Admins can query any payslip in the database.
- Employees can only query payslips where `employeeId` matches their own identity (returns 404 otherwise).

#### Success Response
- **Status:** `200 OK`
```json
{
  "message": "Payslip fetched successfully",
  "success": true,
  "data": {
    "id": "664c3f50a29381001a409301",
    "_id": "664c3f50a29381001a409301",
    "employeeId": "664c39b1a29381001a4092b1",
    "month": 10,
    "year": 2026,
    "basicSalary": 85000,
    "allowances": 12000,
    "deductions": 5000,
    "netSalary": 92000,
    "employee": {
      "_id": "664c39b1a29381001a4092b1",
      "firstName": "Sarah",
      "lastName": "Connor",
      "email": "sarah.connor@coreteam.com",
      "position": "Senior Software Engineer",
      "department": "Engineering"
    }
  }
}
```

#### Error Responses
- **Status:** `404 Not Found`
```json
{
  "error": "Not found"
}
```


---

## 📊 Dashboard Endpoints (`/api/dashboard`)

---

### 1. Get Dashboard Analytics
Provides role-specific statistical summaries for the admin control room or employee personal hub.

- **Method:** `GET`
- **Path:** `/api/dashboard`
- **Access:** Protected (`Admin`, `Employee`)
- **Headers:** `Authorization: Bearer <token>`

#### A. Administrator Dashboard Metrics
Aggregates enterprise-wide figures across active employees, departments, daily attendance, and outstanding leave requests.

- **Status:** `200 OK`
```json
{
  "message": "Dashboard data fetched successfully",
  "success": true,
  "data": {
    "role": "Admin",
    "totalEmployees": 42,
    "totalDepartments": 10,
    "todayAttendance": 38,
    "pendingLeaves": 3
  }
}
```

#### B. Employee Dashboard Metrics
Gathers metrics personalized to the logged-in employee: monthly attendance count, pending personal leaves, and the latest monthly payslip record.

- **Status:** `200 OK`
```json
{
  "message": "Dashboard data fetched successfully",
  "success": true,
  "data": {
    "role": "Employee",
    "employee": {
      "id": "664c39b1a29381001a4092b1",
      "firstName": "Sarah",
      "lastName": "Connor",
      "email": "sarah.connor@coreteam.com",
      "department": "Engineering",
      "position": "Senior Software Engineer"
    },
    "currentMonthAttendance": 19,
    "pendingLeaves": 1,
    "latestPayslip": {
      "id": "664c3f50a29381001a409301",
      "month": 10,
      "year": 2026,
      "basicSalary": 85000,
      "netSalary": 92000
    }
  }
}
```

---

## 👤 User Profile Endpoints (`/api/profile`)

---

### 1. Get Current Profile
Fetches the profile representation of the authenticated user.

- **Method:** `GET`
- **Path:** `/api/profile`
- **Access:** Protected (`Admin`, `Employee`)
- **Headers:** `Authorization: Bearer <token>`

#### Response For Employee
- **Status:** `200 OK`
```json
{
  "_id": "664c39b1a29381001a4092b1",
  "userId": "664c39b1a29381001a4092b0",
  "firstName": "Sarah",
  "lastName": "Connor",
  "email": "sarah.connor@coreteam.com",
  "phone": "+1-555-0199",
  "position": "Senior Software Engineer",
  "department": "Engineering",
  "basicSalary": 85000,
  "allowances": 12000,
  "deductions": 5000,
  "employmentStatus": "Active",
  "joinDate": "2024-01-15T00:00:00.000Z",
  "bio": "Full-stack developer specializing in React and Node.js."
}
```

#### Response For Admin User
- **Status:** `200 OK`
```json
{
  "firstName": "Admin",
  "lastName": "",
  "email": "admin@coreteam.com"
}
```

---

### 2. Update Profile Bio
Allows an employee to edit their personal bio description.

- **Method:** `POST`
- **Path:** `/api/profile`
- **Access:** Protected (`Employee`)
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

#### Request Body
```json
{
  "bio": "Senior developer focusing on cloud microservices and distributed systems."
}
```

#### Success Response
- **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

#### Error Responses
- **Status:** `403 Forbidden` - Deactivated employee
```json
{
  "error": "Your account is deactivated. You cannot update your profile."
}
```
- **Status:** `404 Not Found` - Employee record not found
```json
{
  "error": "Employee not found"
}
```


---

## ⚡ Inngest Background Workflows & Cron (`/api/inngest`)

CoreTeam integrates with **Inngest** to execute resilient, distributed serverless background workflows, automated reminders, and scheduled cron jobs without blocking HTTP request cycles.

- **Webhook Path:** `/api/inngest`
- **Method:** `GET`, `POST`, `PUT` (handled automatically by `serve({ client, functions })`)
- **Client ID:** `Core-Team`

---

### 1. Auto Check-Out Workflow (`autoCheckOut`)
Handles automatic checkout safety and reminder notifications when an employee clocks in.

- **Event Trigger:** `employee/check-out`
- **Payload:**
  ```json
  {
    "name": "employee/check-out",
    "data": {
      "employeeId": "664c39b1a29381001a4092b1",
      "attendanceId": "664c3c10a29381001a4092d5"
    }
  }
  ```

#### Execution Lifecycle:
```mermaid
sequenceDiagram
    autonumber
    participant App as Express API
    participant Engine as Inngest Engine
    participant DB as MongoDB
    participant Mail as SMTP Mailer

    App->>Engine: Send employee/check-out event
    Engine-->>Engine: Sleep until 9 hours elapsed
    Engine->>DB: Query attendance record
    opt Attendance checkOut is null
        Engine->>Mail: Send check-out reminder email to employee
        Engine-->>Engine: Sleep until +1 hour elapsed (10h total)
        Engine->>DB: Query attendance record again
        opt Still no checkOut
            Engine->>DB: Set checkOut = checkIn + 4h, workingHours = 4, status = "LATE", dayType = "Half Day"
        end
    end
```

---

### 2. Leave Application Admin Reminder (`leaveApplicationReminder`)
Ensures leave requests are not forgotten by notifying the administrator if an application stays unattended for 24 hours.

- **Event Trigger:** `leave/pending`
- **Payload:**
  ```json
  {
    "name": "leave/pending",
    "data": {
      "leaveApplicationId": "664c3d82a29381001a4092ee"
    }
  }
  ```

#### Execution Steps:
1. `wait-for-the-24-hours`: Waits for 24 hours from submission time.
2. `send-leave-reminder-email`: Checks MongoDB if status is still `"Pending"`. If pending, sends HTML alert email to `ADMIN_EMAIL`.

---

### 3. Daily Attendance Audit Cron (`attendanceReminderCron`)
Daily automated audit scheduled for **11:30 AM IST** (`06:00 UTC`). Identifies employees who have neither checked in nor submitted approved leave for the current day.

- **Trigger Schedule:** `cron: "0 6 * * *"`

#### Execution Steps:
1. `get-today-date`: Computes start and end timestamps in `Asia/Kolkata` timezone.
2. `get-active-employees`: Fetches all non-deleted employees with status `ACTIVE`.
3. `get-on-leave-ids`: Identifies employees with `status: "APPROVED"` covering today.
4. `get-checked-in-ids`: Identifies employees who already created an attendance record today.
5. `filter-absent`: Isolates employees not in on-leave or checked-in sets.
6. `send-reminder-emails`: Dispatches warning emails via Nodemailer to all absent employees.
