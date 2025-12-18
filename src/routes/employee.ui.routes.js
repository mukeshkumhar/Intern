import { Router } from "express";
import {
    listEmployeesPage,
    newEmployeePage,
    createEmployeeFromUI,
    viewEmployeePage,
    editEmployeePage,
    updateEmployeeFromUI,
    deleteEmployeeFromUI,
} from "../controllers/employee.ui.controller.js";

const router = Router();

router.get("/", (req, res) => res.redirect("/employees"));

router.get("/employees", listEmployeesPage);
router.get("/employees/new", newEmployeePage);
router.post("/employees", createEmployeeFromUI);

router.get("/employees/:id", viewEmployeePage);
router.get("/employees/:id/edit", editEmployeePage);

router.put("/employees/:id", updateEmployeeFromUI);
router.delete("/employees/:id", deleteEmployeeFromUI);

export default router;
