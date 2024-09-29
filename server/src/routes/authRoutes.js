import express from "express";
import {
  signin,
  forgotPassword,
  verifySignInOtp,
  resetPassword,
  resendOtp,
  getAllUsers,
} from "../controllers/authController.js";
const router = express.Router();
router.route("/signin").post(signin);
router.route("/verify-otp").post(verifySignInOtp);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/resend-otp").post(resendOtp);
router.route("/getAllUsers").get(getAllUsers)
export default router;
