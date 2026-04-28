import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Login for Employee and Admin
// POST /api/auth/login

export const login = async (req, res) => {
    try {
        const { email, password, role_type } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (role_type === "admin" && user.role !== "Admin") {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (role_type === "employee" && user.role !== "Employee") {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const payload = { userId: user._id.toString(), role: user.role, email: user.email };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).json({ success: true, user: payload, token });

    } catch (error) {
        console.error("Error during login", error);
        res.status(500).json({ success: false, message: "Failed to login" });
    }
}


// Get session for employee and Admin
// GET /api/auth/session
export const getSession = async (req, res) => {
    const session = req.session;
    return res.status(200).json({ success: true, session });
}

// Change Password for employee and Admin
// POST /api/auth/change-password
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const session = req.session;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Old password and new password are required" });
        }
        const user = await User.findById(session.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(session.userId, { password: hashedPassword });
        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password", error);
        res.status(500).json({ success: false, message: "Failed to change password" });
    }
}
