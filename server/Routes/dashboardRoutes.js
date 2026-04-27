import { Router } from "express";
import { getDashboard } from "../Controllers/dashboardController.js";
import { protect } from "../Middleware/auth.js";

const router = Router();


router.get("/", protect, getDashboard);

export default router;