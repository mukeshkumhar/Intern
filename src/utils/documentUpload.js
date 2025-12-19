import multer from "multer";
import path from "path";
import fs from "fs";
import Employee from "../models/employee.models.js";

function slugify(str = "") {
    return str
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const employeeId = Number(req.params.employeeId);
            if (!employeeId) return cb(new Error("Invalid employeeId"), "");

            const emp = await Employee.findByPk(employeeId, { raw: true });
            if (!emp) return cb(new Error("Employee not found"), "");

            const safeName = slugify(emp.fullName);
            const folderName = `${emp.id}_${safeName}`;
            const dest = path.join("public", "uploads", "employees", folderName);

            fs.mkdirSync(dest, { recursive: true });
            cb(null, dest);
        } catch (err) {
            cb(err, "");
        }
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path
            .basename(file.originalname, ext)
            .replace(/[^a-z0-9_-]/gi, "_");

        cb(null, `${base}_${Date.now()}${ext}`);
    },
});

function fileFilter(req, file, cb) {
    // Keep strict: PDF only (change if you want jpg/png)
    const allowed = ["application/pdf"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
}

export const uploadEmployeeDoc = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
