import express from "express";
import {getRoleById,createRole,updateRole,deleteRole,getRoles} from "../controllers/Roles.Controller.js"
const router = express.Router();

router.route("/createrole").post(createRole)
router.route("/getroles").get(getRoles)
router.route("/getrole/:id").get(getRoleById)
router.route("/updaterole/:id").put(updateRole)
router.route("/deleterole/:id").delete(deleteRole)

export default router;