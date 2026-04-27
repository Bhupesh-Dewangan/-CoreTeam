import express from "express";
import cors from "cors";
import multer from "multer";
import connectDB from "./config/db.js";
import dotenv from "dotenv"
import authRoutes from "./Routes/authRoutes.js";
import employeeRoutes from "./Routes/employeeRoutes.js";
import profileRoutes from "./Routes/profileRoutes.js";
import attendanceRoutes from "./Routes/attendanceRoutes.js";
import leaveRoutes from "./Routes/leaveRoutes.js";
import payslipRoutes from "./Routes/payslipsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(multer().none());

// Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/payslips", payslipRoutes);

await connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});