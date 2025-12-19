import { Router } from "express";
import {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from "../controllers/employee.controllers.js";

const router = Router();

/**
 * @openapi
 * /api/employees:
 *   get:
 *     tags: [Employee]
 *     summary: Get all employees
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 */
router.get("/", getEmployees);

/**
 * @openapi
 * /api/employees:
 *   post:
 *     tags: [Employee]
 *     summary: Create a new employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeCreate'
 *     responses:
 *       201:
 *         description: Employee created
 */
router.post("/", createEmployee);

/**
 * @openapi
 * /api/employees/{id}:
 *   get:
 *     tags: [Employee]
 *     summary: Get employee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Not found
 */
router.get("/:id", getEmployeeById);

/**
 * @openapi
 * /api/employees/{id}:
 *   put:
 *     tags: [Employee]
 *     summary: Update employee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeCreate'
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put("/:id", updateEmployee);

/**
 * @openapi
 * /api/employees/{id}:
 *   delete:
 *     tags: [Employee]
 *     summary: Delete employee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete("/:id", deleteEmployee);

export default router;
