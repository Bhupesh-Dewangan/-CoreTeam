
import LeaveApplication from "../Models/LeaveApplication.js";
import Employee from "../Models/Employee.js";
import { inngest } from "../inngest/index.js";

// Apply for leave
// POST /api/leave
export const applyLeave = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) return res.status(404).json({
            error: "Employee not found"
        });
        if (employee.isDeleted) {
            return res.status(403).json({
                error: "Your account is deactivated. You cannot apply for leave."
            })
        }
        const { type, startDate, endDate, reason } = req.body;
        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({
                error: "All fields are required, Some fields are missing."
            })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (new Date(startDate) <= today || new Date(endDate) <= today) {
            return res.status(400).json({
                error: "Start date and end date must be greater than today"
            })
        }
        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({
                error: "End date must be greater than start date"
            })
        }

        const leave = await LeaveApplication.create({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "Pending"
        });

        await inngest.send({
            name: "leave/pending",
            data: {
                leaveApplicationId: leave._id,
            }
        });

        return res.status(200).json({ message: "Leave applied successfully", success: true, data: leave });
    } catch (error) {
        console.error("Error in applying for leave:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get leave
// GET /api/leave
export const getLeaves = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === "Admin";
        if (isAdmin) {
            const status = req.query.status;
            const where = status ? { status } : {};
            const leaves = await LeaveApplication.find(where).
                populate("employeeId").sort({ createdAt: -1 });
            const data = leaves.map((leave) => {
                const obj = leave.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString(),
                }
            })
            return res.status(200).json({
                success: true,
                data,
            });
        }
        else {
            const employee = await Employee.findOne({ userId: session.userId }).lean();
            if (!employee) return res.status(404).json({
                error: "Employee not found"
            });
            const leaves = await LeaveApplication.find({ employeeId: employee._id }).sort({ date: -1 });
            return res.status(200).json({
                success: true,
                data: leaves,
                employee: { ...employee, id: employee._id.toString() }
            });
        }
    } catch (error) {
        console.error("Error in getting leaves:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

// Update leave status
// PUT /api/leave/:id
export const updateLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) return res.status(400).json({
            error: "Status is required"
        });
        if (status !== "Approved" && status !== "Rejected" && status !== "Pending") {
            return res.status(400).json({
                error: "Invalid status"
            })
        }
        const leave = await LeaveApplication.findByIdAndUpdate(req.params.id, { status }, { returnDocument: "after" });

        return res.status(200).json({
            message: "Leave status updated successfully",
            success: true,
            data: leave
        });
    } catch (error) {
        console.error("Error in updating leave:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
