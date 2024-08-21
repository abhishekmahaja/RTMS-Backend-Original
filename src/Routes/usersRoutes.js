import express from "express";
// import protectRoute from "../middleware/protectRoutes.js";
import {
  // approveUserByManager,
  // approveUserByOwner,
  // forgotPassword,
  // loginUser,
  registerUser,
  // resetPassword,
  sendOTPRegister,
  // verifyOTP,
} from "../Controllers/usersController.js";
import upload from "../Middleware/multerConfig.js";

const router = express.Router();

// User registration with file upload
router.post(
  "/register",
  // upload.single("idCardPhoto,passportPhoto"),
  registerUser
);
// // User login
// router.post("/login", loginUser);
// // OTP verification
// router.post("/verify-otp", verifyOTP);
// // Forgot password
// router.post("/forgot-password", forgotPassword);
// // Reset password
// router.post("/reset-password", resetPassword);
// // Approve user by manager
// router.post("/approve-by-manager", approveUserByManager);
// // Approve user by owner
// router.post("/approve-by-owner", approveUserByOwner);

router.post("/send-otp-register", sendOTPRegister);

export default router;
