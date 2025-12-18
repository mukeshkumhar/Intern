import Employee from "../models/employee.models.js";
import { Op } from "sequelize";

// LIST (with search)
export const listEmployeesPage = async (req, res) => {
    try {
        const q = (req.query.q || "").trim();

        const where = q
            ? {
                [Op.or]: [
                    { fullName: { [Op.like]: `%${q}%` } },
                    { email: { [Op.like]: `%${q}%` } },
                    { phone: { [Op.like]: `%${q}%` } },
                ],
            }
            : undefined;

        const employees = await Employee.findAll({
            where,
            order: [["id", "DESC"]],
            raw: true,
        });

        res.render("employees/list", { employees, q }); // ✅ send q back to view
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// CREATE PAGE
export const newEmployeePage = (req, res) => {
    res.render("employees/new");
};

// CREATE ACTION
export const createEmployeeFromUI = async (req, res) => {
    try {
        const { fullName, email, phone, designation, status } = req.body;

        if (!fullName || !email) {
            return res.status(400).render("employees/new", {
                error: "Full Name and Email are required",
                form: req.body,
            });
        }

        await Employee.create({ fullName, email, phone, designation, status });
        return res.redirect("/employees");
    } catch (err) {
        return res.status(400).render("employees/new", {
            error: err.message,
            form: req.body,
        });
    }
};

// VIEW SINGLE
export const viewEmployeePage = async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).send("Employee not found");
    res.render("employees/view", { employee });
};

// EDIT PAGE
export const editEmployeePage = async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).send("Employee not found");
    res.render("employees/edit", { employee });
};

// UPDATE ACTION
export const updateEmployeeFromUI = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).send("Employee not found");

        await employee.update(req.body);
        return res.redirect("/employees");
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

// DELETE ACTION
export const deleteEmployeeFromUI = async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).send("Employee not found");

    await employee.destroy();
    return res.redirect("/employees");
};
