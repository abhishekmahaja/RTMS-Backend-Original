import express from "express";
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
  getNotApprovalManagerUser,
  getNotApprovalOwnerUser,
  rejectUserByManager,
  rejectUserByOwner,
} from "../Controllers/usersController.js";
import {
  isManager,
  isOwner,
  protectRoute,
} from "../Middleware/protectedRoutes.js";

const router = express.Router();

// User registration with file upload
router.post("/send-otp-register", sendOTPRegister);
router.post("/register", registerUser);
router.post(
  "/approve-by-manager",
  protectRoute,
  isManager,
  approveUserByManager
);
router.post("/reject-user-by-manager", rejectUserByManager);
router.post("/reject-user-by-owner", rejectUserByOwner);
router.get("/get-not-approved-manager-user", getNotApprovalManagerUser);
router.get("/get-not-approval-owner-user", getNotApprovalOwnerUser);
router.post("/approve-by-owner", protectRoute, isOwner, approveUserByOwner);
router.post("/registration-status", RegistrationStatusUser);
router.post("/send-otp-login", sendOTPLogin);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
