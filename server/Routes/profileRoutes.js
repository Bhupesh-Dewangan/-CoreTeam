import { Router } from "express";
import { protect } from "../Middleware/auth.js";
import { updateProfile, getProfile } from "../Controllers/profileController.js";

const router = Router();

router.get("/", protect, getProfile);
router.post("/", protect, updateProfile);

export default router;