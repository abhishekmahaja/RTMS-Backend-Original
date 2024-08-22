import express from "express";
// import protectRoute from "../middleware/protectRoutes.js";
import upload from "../Middleware/multerConfig.js";
import {
  sendOTPRegister,
  registerUser,
  approveUserByManager,
  approveUserByOwner,
  sendOTPLogin,
  loginUser,
  forgotPassword,
  resetPassword,
  RegistrationStatusUser,
} from "../Controllers/usersController.js";

const router = express.Router();

// User registration with file upload
router.post("/send-otp-register", sendOTPRegister);
router.post("/register", registerUser);
router.post("/approve-by-manager", approveUserByManager);
router.post("/approve-by-owner", approveUserByOwner);
router.post("/registration-status", RegistrationStatusUser);
router.post("/send-otp-login", sendOTPLogin);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
