import { inngest } from "../inngest/index.js";
import Attendance from "../Models/Attendance.js";
import Employee from "../Models/Employee.js";

// Clock in/out for Employee
// POST /api/attendance
export const clockInOut = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });

        if (!employee) return res.status(404).json({
            error: "Employee not found"
        });
        if (employee.isDeleted) return res.status(403).json({ error: "Your account is deactivated. You cannot clock in/out." });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await Attendance.findOne({
            employeeId: employee._id,
            date: today,
        })

        const now = new Date();

        if (!existingAttendance) {
            const isLate = now.getHours() > 9 || now.getMinutes() > 0;
            const attendance = await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? "Late" : "Present"
            });

            await inngest.send({
                name: "employee/check-out",
                data: {
                    employeeId: employee._id,
                    attendanceId: attendance._id
                }
            })

            return res.status(200).json({
                message: "Clocked in successfully",
                success: true,
                type: "checkIn",
                data: attendance
            });
        }
        else if (!existingAttendance.checkOut) {
            const checkInTime = new Date(existingAttendance.checkIn).getTime();
            const checkOutTime = now.getTime();
            const diffMs = checkOutTime - checkInTime;
            const diffHours = diffMs / (1000 * 60 * 60);

            existingAttendance.checkOut = now;

            const workingHours = parseFloat(diffHours.toFixed(2));
            let dayType = "Half Day";

            if (workingHours >= 8) {
                dayType = "Full Day";
            }
            else if (workingHours >= 6) {
                dayType = "Three Quarter Day";
            }
            else if (workingHours >= 4) {
                dayType = "Half Day";
            }
            else {
                dayType = "Short Day";
            }
            existingAttendance.workingHours = workingHours;
            existingAttendance.dayType = dayType;

            await existingAttendance.save();

            return res.status(200).json({
                message: "Clocked out successfully",
                success: true,
                type: "checkOut",
                data: existingAttendance
            });
        }
        else {
            return res.json({
                success: true,
                type: "clockedOut"
            });
        }
    } catch (error) {
        console.error("Error in clocking in/out:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


// Get attendance for employee
// GET /api/attendance
export const getAttendance = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });

        if (!employee) return res.status(404).json({
            error: "Employee not found"
        });

        const limit = parseInt(req.query.limit) || 30;
        const history = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 }).limit(limit);

        return res.status(200).json({
            success: true,
            data: history,
            employee: { isDeleted: employee.isDeleted }
        });


    } catch (error) {
        console.error("Error in getting attendance:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
