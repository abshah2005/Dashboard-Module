import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/Departments.Controller.js";
const router=express.Router()

router.route("/createdepartment").post(createDepartment)
router.route("/getdepartments").get(getDepartments)
router.route("/getdepartment/:id").get(getDepartmentById)
router.route("/updatedepartment/:id").put(updateDepartment)
router.route("/deletedepartment/:id").delete(deleteDepartment)
export default router;
