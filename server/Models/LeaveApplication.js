import mongoose from "mongoose";

const leaveApplicationSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    type: {
        type: String,
        // Frontend submits uppercase values (SICK/CASUAL/ANNUAL)
        // Keep both variants to avoid validation errors.
        enum: ["Sick", "Casual", "Annual", "SICK", "CASUAL", "ANNUAL"],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
}, { timestamps: true });

const LeaveApplication = mongoose.models.LeaveApplication || mongoose.model("LeaveApplication", leaveApplicationSchema);

export default LeaveApplication;
