import express from "express";
import {
  addEmployeeAndUser,
  updateEmployee,
  removeEmployee,
  getAllEmployees,
  getEmployeeById,
} from "../controllers/Employee2.Controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";
const router = express.Router();

router.route("/addEmployee").post(
  upload.fields([
    { name: "AppointmentLetter", maxCount: 1 },
    { name: "SalarySlip", maxCount: 1 },
    { name: "RelievingLetter", maxCount: 1 },
    { name: "ExperienceLetter", maxCount: 1 },
  ]),
  addEmployeeAndUser
);
router.route("/getEmployees").get(getAllEmployees);
router.route("/getEmployeeByid/:id").get(getEmployeeById);
router.route("/updateEmployee").put(
  upload.fields([
    { name: "AppointmentLetter", maxCount: 1 },
    { name: "SalarySlip", maxCount: 1 },
    { name: "RelievingLetter", maxCount: 1 },
    { name: "ExperienceLetter", maxCount: 1 },
  ]),
  updateEmployee
);
router.route("/deleteEmployee").delete(removeEmployee);

export default router;
