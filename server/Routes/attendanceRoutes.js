import express from "express";
import { clockInOut, getAttendance } from "../Controllers/attendanceController.js";
import { protect } from "../Middleware/auth.js";

const router = express.Router();

router.post("/", protect, clockInOut);
router.get("/", protect, getAttendance);

export default router; 