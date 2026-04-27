import { Router } from "express";
import { protect, protectAdmin, } from "../Middleware/auth.js";
import { createPayslip, getPayslipById, getPayslips } from "../Controllers/payslipController.js";

const router = Router();

//create payslip
router.post("/", protect, protectAdmin, createPayslip);

//get all payslips
router.get("/", protect, getPayslips);

//get payslip by id
router.get("/:id", protect, getPayslipById);

export default router;