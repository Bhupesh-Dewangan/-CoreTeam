# CoreTeam

CoreTeam is a full-stack employee management dashboard built with a React + Vite frontend and an Express + MongoDB backend.


## Project preview
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/af3051cc-de06-4fdf-b876-1a87ac0b728c" />

---
<img width="1920" height="913" alt="image" src="https://github.com/user-attachments/assets/2bca8b13-2266-47ac-a3d8-f9f2951fbd68" />

---
<img width="1920" height="911" alt="image" src="https://github.com/user-attachments/assets/9a991017-3638-47da-a268-4bb30ec2770c" />

---


## Project structure

- `frontend/` - React application using Vite, Tailwind CSS, and styled-components.
- `server/` - Express API server with MongoDB, JWT authentication, email support, and Inngest event handling.

## Features

- Employee login and profile management
- Attendance check-in and history
- Leave application and history
- Payslip generation and listing
- Admin dashboard and employee management
- Email notifications via SMTP
- MongoDB persistence

## Prerequisites

- Node.js 18+ or compatible LTS version
- npm
- MongoDB connection string
- SMTP credentials for email delivery (Brevo/Sendinblue or another SMTP provider)

## Setup

### 1. Backend (server)

```bash
cd server
npm install
```

Create a `.env` file in `server/` with values similar to:

```env
PORT=4000
MONGO_DB_URL=mongodb+srv://username:password@cluster0.example.mongodb.net/coreteam?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SENDER_EMAIL=sender@example.com
ADMIN_EMAIL=admin@example.com
```

Start the server:

```bash
npm run server
```

Optional: seed the database with default data:

```bash
npm run seed
```

### 2. Frontend (client)

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal (typically `http://localhost:5173`).

## API Endpoints

The backend exposes REST endpoints under `/api` for:

- `/api/auth`
- `/api/employees`
- `/api/profile`
- `/api/attendance`
- `/api/leave`
- `/api/payslips`
- `/api/dashboard`

## Notes

- The server uses `dotenv` to load environment variables.
- The frontend is configured with React Router and Axios for API calls.
- Update the frontend API base URL in `frontend/src/api/axios.js` if the server runs on a non-default port.

## License

This project does not include a license file. Add one if you want to share or publish the code.
