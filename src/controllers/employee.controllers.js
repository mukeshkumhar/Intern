import Employee from "../models/employee.models.js";

export const createEmployee = async (req, res) => {
    try {
        const { fullName, email, phone, designation, status } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({ message: "fullName and email are required" });
        }

        const employee = await Employee.create({
            fullName,
            email,
            phone,
            designation,
            status,
        });
        
        return res.status(201).json(employee);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({ order: [["id", "DESC"]] });
        return res.json(employees);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        return res.json(employee);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        await employee.update(req.body); // updates provided fields only
        return res.json(employee);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        await employee.destroy();
        return res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
