import { Router } from "express";
import { applyLeave, getLeaves, updateLeave } from "../Controllers/leaveController.js";
import { protect, protectAdmin } from "../Middleware/auth.js";

const router = Router();

router.post("/apply", protect, applyLeave);
router.get("/", protect, getLeaves);
router.patch("/:id", protect, protectAdmin, updateLeave);

export default router;