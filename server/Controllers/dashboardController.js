import Employee from "../Models/Employee.js";
import Attendance from "../Models/Attendance.js";
import { DEPARTMENTS } from "../constants/department.js";
import LeaveApplication from "../Models/LeaveApplication.js";
import Payslip from "../Models/Payslips.js";

// Get dashboard for admin and employee
// GET /api/dashboard
export const getDashboard = async (req, res) => {
    try {
        const session = req.session;
        if (session.role === "Admin") {
            const [totalEmployees, todayAttendance, pendingLeaves] = await
                Promise.all([
                    Employee.countDocuments({ isDeleted: { $ne: true } }),
                    Attendance.countDocuments({
                        date: {
                            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                            $lt: new Date(new Date().setHours(24, 0, 0, 0)),
                        }

                    }),
                    LeaveApplication.countDocuments({ status: "PENDING" })
                ]);

            return res.status(200).json({
                message: "Dashboard data fetched successfully",
                success: true,
                data: {
                    role: "Admin",
                    totalEmployees,
                    totalDepartments: DEPARTMENTS.length,
                    todayAttendance,
                    pendingLeaves
                }
            })
        }
        else {
            const employee = await Employee.findOne({ userId: session.userId }).lean();
            if (!employee) return res.status(404).json({ error: "Employee not found" });

            const today = new Date();
            const [currentMonthAttendance, pendingLeaves, latestPayslips] = await Promise.all([
                Attendance.countDocuments({
                    employeeId: employee._id,
                    date: {
                        $gte: new Date(today.getFullYear(), today.getMonth
                            (), 1),
                        $lt: new Date(today.getFullYear(), today.getMonth
                            () + 1, 1),

                    }
                }),

                LeaveApplication.countDocuments({
                    employeeId: employee._id,
                    status: "Pending"
                }),

                Payslip.findOne({
                    employeeId: employee._id
                }).
                    sort({ createdAt: -1 }).
                    lean(),
            ])

            return res.status(200).json({
                message: "Dashboard data fetched successfully",
                success: true,
                data: {
                    role: "Employee",
                    employee: {
                        ...employee,
                        id: employee._id.toString()
                    },
                    currentMonthAttendance,
                    pendingLeaves,
                    latestPayslip: latestPayslips ? { ...latestPayslips, id: latestPayslips._id.toString() } : null
                }
            })
        }

    } catch (error) {
        console.log("Dashboard error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

