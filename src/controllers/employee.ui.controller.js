import Employee from "../models/employee.models.js";
import { Op } from "sequelize";

// LIST (with search)
export const listEmployeesPage = async (req, res) => {
    try {
        const limit = 2;

        const q = (req.query.q || "").trim();
        let page = parseInt(req.query.page, 10);
        if (Number.isNaN(page) || page < 1) page = 1;

        const where = q
            ? {
                [Op.or]: [
                    { fullName: { [Op.like]: `%${q}%` } },
                    { email: { [Op.like]: `%${q}%` } },
                    { phone: { [Op.like]: `%${q}%` } },
                ],
            }
            : undefined;

        // 1) count total
        const totalCount = await Employee.count({ where });
        const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

        // clamp page within range
        if (page > totalPages) page = totalPages;

        const offset = (page - 1) * limit;

        // 2) fetch current page rows
        const employees = await Employee.findAll({
            where,
            order: [["id", "ASC"]],
            limit,
            offset,
            raw: true,
        });

        // helper to build URLs preserving q and page
        const buildUrl = (p) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (p && p > 1) params.set("page", String(p));
            const qs = params.toString();
            return qs ? `/employees?${qs}` : `/employees`;
        };

        const pages = Array.from({ length: totalPages }, (_, i) => {
            const num = i + 1;
            return {
                num,
                url: buildUrl(num),
                active: num === page,
            };
        });

        const hasPrev = page > 1;
        const hasNext = page < totalPages;

        const from = totalCount === 0 ? 0 : offset + 1;
        const to = Math.min(offset + employees.length, totalCount);

        res.render("employees/list", {
            employees,
            q,
            pagination: {
                show: totalPages > 1,
                page,
                totalPages,
                totalCount,
                from,
                to,
                pages,
                hasPrev,
                hasNext,
                prevUrl: hasPrev ? buildUrl(page - 1) : null,
                nextUrl: hasNext ? buildUrl(page + 1) : null,
            },
        });
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
