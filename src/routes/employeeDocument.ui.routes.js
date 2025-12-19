import { Router } from "express";
import {
    listDocs,
    newDocForm,
    createDoc,
    viewDoc,
    editDocForm,
    updateDoc,
    deleteDoc,
} from "../controllers/employeeDocument.ui.controller.js";

import { uploadEmployeeDoc } from "../utils/documentUpload.js";

const router = Router({ mergeParams: true });

router.get("/", listDocs);
router.get("/new", newDocForm);
router.post("/", uploadEmployeeDoc.single("documentFile"), createDoc);

router.get("/:docId", viewDoc);
router.get("/:docId/edit", editDocForm);
router.put("/:docId", uploadEmployeeDoc.single("documentFile"), updateDoc);
router.delete("/:docId", deleteDoc);

export default router;
