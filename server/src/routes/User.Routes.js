import express from "express";
import {
  getUserById,getAllUsers,updateUser,deleteUser
} from "../controllers/Users.Controllers.js";
const router=express.Router()

router.route("/getAllUsers").get(getAllUsers)
router.route("/getUserbyId/:id").get(getUserById)
router.route("/updateUser/:id").put(updateUser)
router.route("/deleteUser/:id").delete(deleteUser)

export default router;