import Payslip from "../Models/Payslips.js";

// Create payslip
// POST /api/payslips
export const createPayslip = async (req, res) => {
    try {
        const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;

        if (!employeeId || !month || !year || !basicSalary) {
            return res.status(400).json({ message: "Missing fields are required" });
        }

        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

        const payslip = await Payslip.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0),
            netSalary: Number(netSalary)
        })
        return res.status(201).json({ message: "Payslip created successfully", success: true, data: payslip });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// Get all payslips
// GET /api/payslips
export const getPayslips = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === "Admin";
        if (isAdmin) {
            const payslips = await Payslip.find().populate("employeeId").sort({ createdAt: -1 });
            const data = payslips.map((p) => {
                const obj = p.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employeeId: obj.employeeId?._id?.toString(),
                }
            })
            res.status(200).json({ message: "Payslips fetched successfully", success: true, data });
        }
        else {
            const employee = await Employee.findOne({ userId: session.userId })

            if (!employee)
                return res.status(404).json({ error: "Not found" });

            const payslips = await Payslip.find({ employeeId: employee._id }).sort({ createdAt: -1 });

            res.status(200).json({ message: "Payslips fetched successfully", success: true, data });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// Get payslip by id
// GET /api/payslips/:id
export const getPayslipById = async (req, res) => {
    try {
        const payslip = await Payslip.findById(req.params.id).populate
            ("employeeId").lean();

        if (!payslip) return res.status(404).json({ error: "Not found" });

        const result = {
            ...payslip,
            id: payslip._id.toString(),
            employee: payslip.employeeId,
        }

        res.status(200).json({ message: "Payslip fetched successfully", success: true, data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

}   
