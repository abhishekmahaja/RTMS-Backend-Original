import bcrypt from "bcrypt";
import crypto from "crypto";
import { response } from "express";
import jwt from "jsonwebtoken";
import {
  sendOTPVerification,
  sendPasswordResetEmail,
  sendApprovalNotification,
  sendPasswordToUser,
} from "../helpers/helper.js";
import Users from "../Models/userModel.js";
import UserOTPVerification from "../Models/userOtpVerificationModel.js";
import PasswordResetToken from "../Models/forgotPasswordSchema.js";

// User Register
export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      contactNumber,
      employeeID,
      assetName,
      department,
      roleInRTMS,
    } = req.body;

    const idCardPhoto = req.file ? req.file.path : null;

    // Checking if all fields are provided
    if (
      !username ||
      !email ||
      !contactNumber ||
      !employeeID ||
      !assetName ||
      !department ||
      !roleInRTMS
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Checking if user is already registered
    const existingUser = await Users.findOne({
      email,
      employeeID,
      contactNumber,
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Present!",
      });
    }

    // Creating new user
    const newUser = await Users.create({
      username,
      email,
      contactNumber,
      employeeID,
      assetName,
      department,
      roleInRTMS,
      idCardPhoto,
    });

    // Send OTP verification
    await sendOTPVerification(
      {
        _id: newUser._id,
        email: newUser.email,
        mobile: newUser.contactNumber,
      },
      res
    );

    // Send approval notifications
    await sendApprovalNotification(newUser);

    res.status(201).json({
      success: true,
      message: "User is Registered and OTP sent for verification!",
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        contactNumber: newUser.contactNumber,
        employeeID: newUser.employeeID,
        assetName: newUser.assetName,
        department: newUser.department,
        roleInRTMS: newUser.roleInRTMS,
        idCardPhoto: newUser.idCardPhoto,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to Signup",
    });
  }
};

// User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required!",
      });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not registered. Please Signup first!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(404).json({
        success: false,
        message: "Password doesn't match. Please enter the correct password",
      });
    }

    // Send OTP for verification
    await sendOTPVerification(
      { _id: user._id, email: user.email, mobile: user.contactNumber },
      res
    );

    // Now wait for OTP verification step (implement verification endpoint)
  } catch (error) {
    console.log("Error in Login Controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to login!",
    });
  }
};

//send otp verification email
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userOTPVerification = await UserOTPVerification.findOne({
      userId,
    });

    if (!userOTPVerification) {
      return res.status(400).json({
        success: false,
        message: "OTP not found, please request a new OTP",
      });
    }

    const isOTPValid = await bcrypt.compare(otp, userOTPVerification.otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid, complete the login or signup process
    await UserOTPVerification.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify OTP",
    });
  }
};

//forgot password api
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString("hex");

    const resetToken = new PasswordResetToken({
      userId: user._id,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    await resetToken.save();

    await sendPasswordResetEmail(email, token);

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send password reset email",
    });
  }
};

//Reset password api
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const resetToken = await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: Date.now() },
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await Users.findById(resetToken.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await PasswordResetToken.deleteMany({ userId: user._id });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};

// Approve user by manager
export const approveUserByManager = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Set user's approval status
    user.isApprovedByManager = true;
    await user.save();

    // Check if user is also approved by owner
    if (user.isApprovedByOwner) {
      await sendPasswordToUser(user);
      return res.status(200).json({
        success: true,
        message: "User approved by manager and password sent",
      });
    }

    res.status(200).json({
      success: true,
      message: "User approved by manager",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve user by manager",
    });
  }
};

// Approve user by owner
export const approveUserByOwner = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Set user's approval status
    user.isApprovedByOwner = true;
    await user.save();

    // Check if user is also approved by manager
    if (user.isApprovedByManager) {
      await sendPasswordToUser(user);
      return res.status(200).json({
        success: true,
        message: "User approved by owner and password sent",
      });
    }

    res.status(200).json({
      success: true,
      message: "User approved by owner",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve user by owner",
    });
  }
};
