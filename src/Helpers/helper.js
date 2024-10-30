import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { v2 as cloudinary } from "cloudinary";

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

// Send OTP Verification code for register
export const sendOTPVerification = async ({
  email,
  mobile,
  emailOtp,
  contactOtp,
}) => {
  try {
    // Mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Your Email and Mobile",
      html: `<p>Enter <b>${emailOtp}</b> in the app to verify email address and mobile number and complete the signup process.</p><p>This code <b>expires in 15 Minutes </b>.</p>`,
    };

    // Send email OTP
    await transporter.sendMail(mailOptions);

    // Send OTP to mobile as well
    const smsOptions = {
      body: `Your OTP is ${contactOtp}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    };

    const smsResponse = await twilioClient.messages.create(smsOptions);
    console.log("SMS sent successfully:", smsResponse.sid);
  } catch (error) {
    console.log(error.message || error, "OTP not sent. Issue:");
  }
};

// Send OTP Verification code for Login
export const sendOTPVerificationLogin = async ({
  email,
  mobile,
  emailOtp,
  contactOtp,
}) => {
  try {
    // Mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Your Email and Mobile",
      html: `<p>Enter <b>${emailOtp}</b> in the app to verify email address and mobile number and complete the Login process.</p><p>This code <b>expires in 15 minutes </b>.</p>`,
    };

    // Send email OTP
    await transporter.sendMail(mailOptions);

    // Send OTP to mobile as well
    const smsOptions = {
      body: `Your OTP is ${contactOtp}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    };

    const smsResponse = await twilioClient.messages.create(smsOptions);
    console.log("SMS sent successfully:", smsResponse.sid);
  } catch (error) {
    console.log("OTP not sent. Issue:", error.message || error);
  }
};

// Email helper function
export const sendPasswordResetEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Verification Code: ${otp}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Notify the manager
export const sendNotificationToManager = async (
  username,
  employeeID,
  contactNumber,
  email,
  department,
  managerEmail,
  ownerEmail
) => {
  try {
    // console.log(`Sending email to manager (${managerEmail}) and owner (${ownerEmail})`);
    const managerMailOptions = {
      from: process.env.AUTH_EMAIL,
      to: [managerEmail, ownerEmail],
      subject: "New User Registration Awaiting Approval",
      html: `<p>A new user has been registered and is awaiting approval. User details:</p>
           <ul>
             <li>Username: ${username}</li>
             <li>Email: ${email}</li>
             <li>Contact Number: ${contactNumber}</li>
             <li>Employee ID: ${employeeID}</li>
             <li>Department: ${department}</li>
           </ul>
           <p>Please review and approve the request.</p>`,
    };

    await transporter.sendMail(managerMailOptions);
    // console.log("Email sent to both manager and owner.");
  } catch (err) {
    console.error("Mail not sent to manager and owner:", err);
  }
};

// Notify the Owner for approval User
export const sendNotificationToOwner = async (
  username,
  employeeID,
  contactNumber,
  email,
  department,
  ownerEmail
) => {
  try {
    const ownerMailOptions = {
      from: process.env.AUTH_EMAIL,
      to: ownerEmail,
      subject:
        "New User Registration: Manager Approval Received, Pending Owner Approval",
      html: `<p>A new user has been registered and approved by the Manager. Please review and approve. Below are the user details:</p>
            <ul>
              <li>Username: ${username}</li>
              <li>Email: ${email}</li>
              <li>Contact Number: ${contactNumber}</li>
              <li>Employee ID: ${employeeID}</li>
              <li>Department: ${department}</li>
            </ul>
            <p>Please review and approve the request.</p>`,
    };

    // Send the email using the transporter
    await transporter.sendMail(ownerMailOptions);
    console.log("Notification email sent to the owner:", ownerEmail);
  } catch (err) {
    console.error("Failed to send notification email to owner:", err);
  }
};

// Notify the owner about the rejected user
export const sendRejectNotificationToOwner = async (
  username,
  employeeID,
  contactNumber,
  email,
  department,
  ownerEmail
) => {
  try {
    const ownerMailOptions = {
      from: process.env.AUTH_EMAIL,
      to: ownerEmail,
      subject: "User Rejection Notification from Manager",
      html: `<p>A user has been rejected by the Manager. Below are the user details:</p>
            <ul>
              <li>Username: ${username}</li>
              <li>Email: ${email}</li>
              <li>Contact Number: ${contactNumber}</li>
              <li>Employee ID: ${employeeID}</li>
              <li>Department: ${department}</li>
            </ul>
            <p>The user has been removed from the system.</p>`,
    };

    await transporter.sendMail(ownerMailOptions);
    console.log("Rejection notification email sent to owner:", ownerEmail);
  } catch (err) {
    console.error("Failed to send rejection notification to owner:", err);
  }
};

// Notify the owner when a user's registration is rejected by the manager
export const sendRejectNotifactionToManager = async (
  username,
  employeeID,
  contactNumber,
  email,
  department,
  ownerEmail
) => {
  // Email options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: ownerEmail,
    subject: "User Registration Rejected by Manager",
    html: `<p>The following user registration has been rejected by the manager:</p>
           <ul>
             <li>Username: ${username}</li>
              <li>Email: ${email}</li>
              <li>Contact Number: ${contactNumber}</li>
              <li>Employee ID: ${employeeID}</li>
              <li>Department: ${department}</li>
           </ul>
           <p>If you have any concerns, please contact the manager.</p>`,
  };

  try {
    // Send email notification to the owner
    await transporter.sendMail(mailOptions);

    // Here you could add SMS logic, if applicable
    // console.log("Rejection notification email sent to owner:", ownerEmail);
  } catch (error) {
    console.error("Error sending rejection notification to owner:", error);
    throw new Error("Failed to send rejection notification to owner");
  }
};

//notify the user to reject
export const sendRejectNotificationToUser = async (username, userEmail) => {
  try {
    const userMailOptions = {
      from: process.env.AUTH_EMAIL,
      to: userEmail,
      subject: "Registration Rejection Notification",
      html: `<p>Dear ${username},</p>
            <p>We regret to inform you that your registration has been rejected by the Manager/Owner. If you have any questions or concerns, please contact our support team.</p>
            <p>Thank you for your understanding.</p>`,
    };

    await transporter.sendMail(userMailOptions);
    // console.log("Rejection notification email sent to user:", userEmail);
  } catch (err) {
    console.error("Failed to send rejection notification to user:", err);
  }
};

//send password to user
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
    // await twilioClient.messages.create(smsOptions);
  } catch (error) {
    console.error("Error sending password:", error);
    throw new Error("Failed to send password");
  }
};

//approved owner mail to manager and user
export const sendApprovedNotifactionToManager = async (
  employeeID,
  managerEmail
) => {
  // Email options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: managerEmail,
    subject: "Your Account Password",
    html: `<p>This Employee id approved by Owner ${employeeID}`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    // Send SMS
  } catch (error) {
    console.error("Error sending password:", error);
    throw new Error("Failed to send password");
  }
};

//upload a image
export const uploadCloudinary = async (file, folder, height, quality) => {
  const options = { folder };

  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

// to Generated password
const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

// Add Well Function to send the email to owner
export const sendWellNotificationToOwner = async (wellNumberExists, ownerEmail) => {
  try {
    const subject = `Approval Needed for Well ${wellNumberExists.wellNumber}`;
    const htmlContent = `
      <p>Dear Owner,</p>
      <p>The well with the following details requires your approval and its Approved From Manager Side:</p>
      <ul>
        <li><strong>Well Number:</strong> ${wellNumberExists.wellNumber}</li>
        <li><strong>Well Type:</strong> ${wellNumberExists.wellType}</li>
        <li><strong>Location:</strong> ${wellNumberExists.wellLocation}</li>
        <li><strong>Installation Date:</strong> ${wellNumberExists.wellInstallation}</li>
        <li><strong>Description:</strong> ${wellNumberExists.wellDescription}</li>
      </ul>
      <p>Please review and provide your approval.</p>
    `;

    // Send email
    const ownerWellSendOption = {
      from: process.env.AUTH_EMAIL, 
      to: ownerEmail,
      subject: subject, 
      html: htmlContent, 
    };

    await transporter.sendMail(ownerWellSendOption);
    // console.log("Mail sent successfully to Owner");
  } catch (error) {
    console.log("Mail not sent to Owner", error);
  }
};

// Add Well Function to send the email to manager
export const sendWellNotificationToManager = async (managerEmail, wellNumberExists) => {
  try {
    const subject = `Approval Needed for Well ${wellNumberExists.wellNumber}`;
    const htmlContent = `
      <p>Dear Manager,</p>
      <p>The well with the following details is Approved Now to use:</p>
      <ul>
        <li><strong>Well Number:</strong> ${wellNumberExists.wellNumber}</li>
        <li><strong>Well Type:</strong> ${wellNumberExists.wellType}</li>
        <li><strong>Location:</strong> ${wellNumberExists.wellLocation}</li>
        <li><strong>Installation Date:</strong> ${wellNumberExists.wellInstallation}</li>
        <li><strong>Description:</strong> ${wellNumberExists.wellDescription}</li>
      </ul>
      <p>Please Use This Well.</p>
    `;

    // Send email
    const managerWellSendOption = {
      from: process.env.AUTH_EMAIL, 
      to: managerEmail,
      subject: subject, 
      html: htmlContent, 
    };

    await transporter.sendMail(managerWellSendOption);
    // console.log("Mail sent successfully to Owner");
  } catch (error) {
    console.log("Mail not sent to Owner", error);
  }
};

// Notify the owner about the rejected Well
export const sendWellRejectNotificationToOwner = async (
  wellNumberExists,
  ownerEmail
) => {
  try {
    const subject = `Approval Reject by Manager Well ${wellNumberExists.wellNumber}`;
    const htmlContent = `
      <p>Dear Owner,</p>
      <p>The well with the following details Reject From Manager Side:</p>
      <ul>
        <li><strong>Well Number:</strong> ${wellNumberExists.wellNumber}</li>
        <li><strong>Well Type:</strong> ${wellNumberExists.wellType}</li>
        <li><strong>Location:</strong> ${wellNumberExists.wellLocation}</li>
        <li><strong>Installation Date:</strong> ${wellNumberExists.wellInstallation}</li>
        <li><strong>Description:</strong> ${wellNumberExists.wellDescription}</li>
      </ul>
      <p>Thanks For Understanding.</p>
    `;

    // Send email
    const ownerWellSendOption = {
      from: process.env.AUTH_EMAIL, 
      to: ownerEmail,
      subject: subject, 
      html: htmlContent, 
    };

    await transporter.sendMail(ownerWellSendOption);
    // console.log("Mail sent successfully to Owner");
  } catch (error) {
    console.log("Mail not sent to Owner", error);
  }
};

// Notify the Manager about the rejected Well
export const sendWellRejectNotificationToManager = async (
  wellNumberExists,
  managerEmail
) => {
  try {
    const subject = `Approval Reject by Owner Well ${wellNumberExists.wellNumber}`;
    const htmlContent = `
      <p>Dear Manager,</p>
      <p>The well with the following details Reject From Owner Side:</p>
      <ul>
        <li><strong>Well Number:</strong> ${wellNumberExists.wellNumber}</li>
        <li><strong>Well Type:</strong> ${wellNumberExists.wellType}</li>
        <li><strong>Location:</strong> ${wellNumberExists.wellLocation}</li>
        <li><strong>Installation Date:</strong> ${wellNumberExists.wellInstallation}</li>
        <li><strong>Description:</strong> ${wellNumberExists.wellDescription}</li>
      </ul>
      <p>Thanks For Understanding.</p>
    `;

    // Send email
    const managerWellSendOption = {
      from: process.env.AUTH_EMAIL, 
      to: managerEmail,
      subject: subject, 
      html: htmlContent, 
    };

    await transporter.sendMail(managerWellSendOption);
    // console.log("Mail sent successfully to manager");
  } catch (error) {
    console.log("Mail not sent to Owner", error);
  }
};

// Notify the Manager about the Delete Well
export const sendWellDeleteNotificationToManager = async (
  well,
  managerEmail
) => {
  try {
    const subject = `Well Delete by Manager ${well.wellNumber}`;
    const htmlContent = `
      <p>Dear Manager,</p>
      <p>The well with the following details delete From Owner Side:</p>
      <ul>
        <li><strong>Well Number:</strong> ${well.wellNumber}</li>
        <li><strong>Well Type:</strong> ${well.wellType}</li>
        <li><strong>Location:</strong> ${well.wellLocation}</li>
        <li><strong>Installation Date:</strong> ${well.wellInstallation}</li>
        <li><strong>Description:</strong> ${well.wellDescription}</li>
      </ul>
      <p>Thanks For Understanding.</p>
    `;

    // Send email
    const managerWellSendOption = {
      from: process.env.AUTH_EMAIL, 
      to: managerEmail,
      subject: subject, 
      html: htmlContent, 
    };

    await transporter.sendMail(managerWellSendOption);
    // console.log("Mail sent successfully to manager");
  } catch (error) {
    console.log("Mail not sent to Owner", error);
  }
};

// Notify the Owner about the Delete Well
export const sendWellDeleteNotificationToOwner = async (
  well,
  ownerEmail
) => {
  try {
    const subject = `Well Delete by Owner ${well.wellNumber}`;
    const htmlContent = `
      <p>Dear Manager,</p>
      <p>The well with the following details Delete From Manager Side:</p>
      <ul>
        <li><strong>Well Number:</strong> ${well.wellNumber}</li>
        <li><strong>Well Type:</strong> ${well.wellType}</li>
        <li><strong>Location:</strong> ${well.wellLocation}</li>
        <li><strong>Installation Date:</strong> ${well.wellInstallation}</li>
        <li><strong>Description:</strong> ${well.wellDescription}</li>
      </ul>
      <p>Thanks For Understanding.</p>
    `;

    // Send email
    const ownerWellSendOption = {
      from: process.env.AUTH_EMAIL, 
      to: ownerEmail,
      subject: subject, 
      html: htmlContent, 
    };

    await transporter.sendMail(ownerWellSendOption);
    // console.log("Mail sent successfully to Owner");
  } catch (error) {
    console.log("Mail not sent to Owner", error);
  }
};

//AMIN PAGE HELPER FUNCTION

//Send Org SETUP To User
export const sendNewCreateOrganization = async (
  username,
  organizationName,
  contactNumber,
  email,
  password
) => {
  try {
    const OrgOwnerMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "New Organization Created! detail Given",
      html: `<p>A new Organization has been Created. :Organization details:</p>
           <ul>
             <li>Username: ${username}</li>
             <li>Email: ${email}</li>
             <li>Contact Number: ${contactNumber}</li>
             <li>Organization Name: ${organizationName}</li>
             <li>Password: ${password}</li>
           </ul>
           <p>Please review.</p>`,
    };

    await transporter.sendMail(OrgOwnerMailOptions);
  } catch (err) {
    console.log("Mail not send to Org Owner", err);
  }
};
