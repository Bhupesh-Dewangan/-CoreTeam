import Employee from "../Models/Employee.js";
import User from "../Models/User.js";
import bcrypt from "bcrypt";

// Get Employeee
// GET /api/employees

export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query;
        const where = {};
        if (department) where.department = department;

        // `Array.sort` expects a compare function; sort on the mongoose query instead.
        const employees = await Employee.find(where)
            .populate("userId", "email role")
            .sort({ createdAt: -1 })
            .lean();

        const result = employees.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? {
                email: emp.userId.email, role: emp.userId.role
            } : null
        }));
        return res.json(result)
    } catch (error) {
        console.error("Error getting employees", error);
        res.status(500).json({ success: false, message: "Failed to get employees" });
    }
}

// Add Employeee
// POST /api/employees
export const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, position,
            department, basicSalary, allowances, deductions, joinDate,
            password, role, bio } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: "Missing required fields" });

        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashed,
            role: role || "Employee"
        })

        const employee = new Employee({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(joinDate),
            bio: bio || ""
        });

        await user.save();
        await employee.save();

        return res.status(201).json({ success: true, employee })

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        console.error("Error adding employee", error);
        res.status(500).json({ success: false, message: "Failed to add employee" });
    }
}

// Update Employee
// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, position,
            department, basicSalary, allowances, deductions, joinDate,
            password, role, bio, employmentStatus } = req.body;
        const { id } = req.params;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        const updateData = {
            // These are expected to be provided by the form.
            firstName,
            email,
            position,
            department: department && String(department).trim() ? department : (employee.department || "Engineering"),
            basicSalary: basicSalary !== undefined && basicSalary !== '' ? Number(basicSalary) : (employee.basicSalary ?? 0),
            allowances: allowances !== undefined && allowances !== '' ? Number(allowances) : (employee.allowances ?? 0),
            deductions: deductions !== undefined && deductions !== '' ? Number(deductions) : (employee.deductions ?? 0),
            employmentStatus: employmentStatus && String(employmentStatus).trim() ? employmentStatus : (employee.employmentStatus || "Active"),
        };

        // Optional fields: if blank/omitted, keep old values.
        if (lastName !== undefined && String(lastName).trim() !== '') updateData.lastName = lastName;
        if (phone !== undefined && String(phone).trim() !== '') updateData.phone = phone;
        if (bio !== undefined && String(bio).trim() !== '') updateData.bio = bio;

        await Employee.findByIdAndUpdate(id, updateData);

        // Update user record
        const userUpdate = { email };
        if (role) userUpdate.role = role;
        if (password) {
            userUpdate.password = await bcrypt.hash(password, 10)
        }

        await User.findByIdAndUpdate(employee.userId, userUpdate);

        return res.status(201).json({ success: true })

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        res.status(500).json({ success: false, message: "Failed to add employee" });
    }
}

// Delete Employee
// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        employee.isDeleted = true;
        employee.employmentStatus = "Inactive";
        await employee.save();
        return res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete employee" });
    }
}

