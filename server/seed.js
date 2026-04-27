import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./Models/User.js";
import bcrypt from "bcrypt";

const TemporaryPassword = "admin123";

async function registerAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        if (!ADMIN_EMAIL) {
            console.error('Missing ADMIN_EMAIL env variable')
            process.exit(1);
        }
        await connectDB()

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(TemporaryPassword, 10);

        await User.create({
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "Admin"
        });

        console.log("Admin created successfully");
        console.log(`Email: ${ADMIN_EMAIL}, Temp Password: ${TemporaryPassword}`);
        console.log("Please change password after first login.");
        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
}

registerAdmin();