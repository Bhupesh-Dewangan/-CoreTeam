import { Router } from "express";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../Controllers/employeeController.js";
import { protect, protectAdmin } from "../Middleware/auth.js";
const router = Router();

router.get("/", protect, protectAdmin, getEmployees);
router.post("/", protect, protectAdmin, createEmployee);
router.put("/:id", protect, protectAdmin, updateEmployee);
router.delete("/:id", protect, protectAdmin, deleteEmployee);

export default router;