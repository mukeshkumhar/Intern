import fs from "fs";
import path from "path";
import Employee from "../models/employee.models.js";
import EmployeeDocument from "../models/employeeDocument.model.js";

// GET /employees/:employeeId/documents
export const listDocs = async (req, res) => {
    const employeeId = Number(req.params.employeeId);

    const employee = await Employee.findByPk(employeeId, { raw: true });
    if (!employee) return res.status(404).send("Employee not found");

    const documents = await EmployeeDocument.findAll({
        where: { employeeId },
        order: [["id", "DESC"]],
        raw: true,
    });

    return res.render("employee-documents/list", { employee, documents });
};

// GET /employees/:employeeId/documents/new
export const newDocForm = async (req, res) => {
    const employeeId = Number(req.params.employeeId);
    const employee = await Employee.findByPk(employeeId, { raw: true });
    if (!employee) return res.status(404).send("Employee not found");

    return res.render("employee-documents/new", { employee });
};

// POST /employees/:employeeId/documents
// export const createDoc = async (req, res) => {
//     try {
//         const employeeId = Number(req.params.employeeId);

//         const employee = await Employee.findByPk(employeeId, { raw: true });
//         if (!employee) return res.status(404).send("Employee not found");

//         if (!req.file) return res.status(400).send("Document file is required");

//         const relativePath =
//             req.file.path.replace(/^public[\\/]/, "/").split(path.sep).join("/");

//         await EmployeeDocument.create({
//             employeeId,
//             docType: (req.body.docType || "OTHER").trim(),

//             originalName: req.file.originalname,
//             fileName: req.file.filename,
//             filePath: relativePath,

//             mimeType: req.file.mimetype,
//             fileSize: req.file.size,
//         });

//         return res.redirect(`/employees/${employeeId}/documents`);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send(err.message);
//     }
// };

// POST /employees/:employeeId/documents (multiple)
export const createDoc = async (req, res) => {
    try {
        const employeeId = Number(req.params.employeeId);

        const employee = await Employee.findByPk(employeeId, { raw: true });
        if (!employee) return res.status(404).send("Employee not found");

        if (!req.files || req.files.length === 0) {
            return res.status(400).send("At least one PDF is required");
        }

        const docType = (req.body.docType || "OTHER").trim();

        const rows = req.files.map((f) => {
            const relativePath = f.path
                .replace(/^public[\\/]/, "/")
                .split(path.sep)
                .join("/");

            return {
                employeeId,
                docType,
                originalName: f.originalname,
                fileName: f.filename,
                filePath: relativePath,
                mimeType: f.mimetype,
                fileSize: f.size,
            };
        });

        await EmployeeDocument.bulkCreate(rows);

        return res.redirect(`/employees/${employeeId}/documents`);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
};

// GET /employees/:employeeId/documents/:docId
export const viewDoc = async (req, res) => {
    const employeeId = Number(req.params.employeeId);
    const docId = Number(req.params.docId);

    const employee = await Employee.findByPk(employeeId, { raw: true });
    if (!employee) return res.status(404).send("Employee not found");

    const document = await EmployeeDocument.findOne({
        where: { id: docId, employeeId },
        raw: true,
    });
    if (!document) return res.status(404).send("Document not found");

    return res.render("employee-documents/view", { employee, document });
};

// GET /employees/:employeeId/documents/:docId/edit
export const editDocForm = async (req, res) => {
    const employeeId = Number(req.params.employeeId);
    const docId = Number(req.params.docId);

    const employee = await Employee.findByPk(employeeId, { raw: true });
    if (!employee) return res.status(404).send("Employee not found");

    const document = await EmployeeDocument.findOne({
        where: { id: docId, employeeId },
        raw: true,
    });
    if (!document) return res.status(404).send("Document not found");

    return res.render("employee-documents/edit", { employee, document });
};

// PUT /employees/:employeeId/documents/:docId
// (optional replace file)
export const updateDoc = async (req, res) => {
    try {
        const employeeId = Number(req.params.employeeId);
        const docId = Number(req.params.docId);

        const existing = await EmployeeDocument.findOne({
            where: { id: docId, employeeId },
            raw: true,
        });
        if (!existing) return res.status(404).send("Document not found");

        const payload = {
            docType: (req.body.docType || existing.docType).trim(),
        };

        // if file uploaded, replace old
        if (req.file) {
            const oldAbs = path.join("public", existing.filePath.replace(/^\//, ""));
            if (fs.existsSync(oldAbs)) fs.unlinkSync(oldAbs);

            const newRelative =
                req.file.path.replace(/^public[\\/]/, "/").split(path.sep).join("/");

            payload.originalName = req.file.originalname;
            payload.fileName = req.file.filename;
            payload.filePath = newRelative;
            payload.mimeType = req.file.mimetype;
            payload.fileSize = req.file.size;
        }

        await EmployeeDocument.update(payload, { where: { id: docId, employeeId } });

        return res.redirect(`/employees/${employeeId}/documents/${docId}`);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
};

// DELETE /employees/:employeeId/documents/:docId
export const deleteDoc = async (req, res) => {
    try {
        const employeeId = Number(req.params.employeeId);
        const docId = Number(req.params.docId);

        const existing = await EmployeeDocument.findOne({
            where: { id: docId, employeeId },
            raw: true,
        });
        if (!existing) return res.status(404).send("Document not found");

        const abs = path.join("public", existing.filePath.replace(/^\//, ""));
        if (fs.existsSync(abs)) fs.unlinkSync(abs);

        await EmployeeDocument.destroy({ where: { id: docId, employeeId } });

        return res.redirect(`/employees/${employeeId}/documents`);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
};
