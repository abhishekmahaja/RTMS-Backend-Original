import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import UserOTPVerification from "../Models/userOtpVerificationModel.js";
import User from "../Models/userModel.js";

// Create a transporter using your email service provider
const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service provider
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_EMAIL_PASSWORD,
  },
});

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send OTP Verification code
export const sendOTPVerification = async ({ _id, email, mobile }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    // Mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Your Email and Mobile",
      html: `<p>Enter <b>${otp}</b> in the app to verify email address and mobile number and complete the signup process.</p><p>This code <b>expires in 1 hour</b>.</p>`,
    };

    // Hash the OTP
    const saltRounds = 10;
    const hashOTP = await bcrypt.hash(otp, saltRounds);

    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      otp: hashOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    // Save OTP record
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);

    // Send OTP to mobile as well
    const smsOptions = {
      body: `Your OTP is ${otp}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    };

    await twilioClient.messages.create(smsOptions);

    res.status(200).json({
      status: "PENDING",
      message: "Verification OTP sent to email and mobile",
      data: {
        userId: _id,
        email,
        mobile,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

// Email helper function
export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link will expire in 1 hour.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Send approval or reject notification message
export const sendApprovalNotification = async (user) => {
  try {
    const ownerEmail = "karan4007ch@gmail.com"; // Replace with actual owner email
    const managerEmail = "karan4007ch@gmail.com"; // Replace with actual manager email

    // Notify the manager
    const managerMailOptions = {
      from: process.env.AUTH_EMAIL,
      to: managerEmail,
      subject: "New User Registration Awaiting Approval",
      html: `<p>A new user has been registered and has been approved by the owner. User details:</p>
             <ul>
               <li>Username: ${user.username}</li>
               <li>Email: ${user.email}</li>
               <li>Employee ID: ${user.employeeID}</li>
               <li>Contact Number: ${user.contactNumber}</li>
             </ul>
             <p>Please review and approve the request.</p>`,
    };

    await transporter.sendMail(managerMailOptions);

    // Notify the owner
    const ownerMailOptions = {
      from: process.env.AUTH_EMAIL,
      to: ownerEmail,
      subject: "New User Registration Awaiting Approval",
      html: `<p>A new user has registered and is awaiting approval. User details:</p>
             <ul>
               <li>Username: ${user.username}</li>
               <li>Email: ${user.email}</li>
               <li>Employee ID: ${user.employeeID}</li>
               <li>Contact Number: ${user.contactNumber}</li>
             </ul>
             <p>Please review and approve or reject the request.</p>`,
    };

    await transporter.sendMail(ownerMailOptions);
  } catch (error) {
    console.error("Error sending approval notifications:", error);
    throw new Error("Failed to send approval notifications");
  }
};

// Send password to user after successful approval
const generatePassword = () => {
  // Generate a random password
  return Math.random().toString(36).slice(-8); // 8-character random password
};

export const sendPasswordToUser = async (user) => {
  const newPassword = generatePassword();

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update user's password
  user.password = hashedPassword;
  await user.save();

  // Email options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: user.email,
    subject: "Your Account Password",
    html: `<p>Your account has been approved. Your new password is <b>${newPassword}</b>. Please use this to log in.</p>`,
  };

  // SMS options
  const smsOptions = {
    body: `Your account has been approved. Your new password is ${newPassword}. Please use this to log in.`,
    to: user.contactNumber,
    from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    // Send SMS
    await twilioClient.messages.create(smsOptions);
  } catch (error) {
    console.error("Error sending password:", error);
    throw new Error("Failed to send password");
  }
};
