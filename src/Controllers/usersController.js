import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendApprovedNotifactionToManager,
  sendNotificationToManager,
  sendNotificationToOwner,
  sendOTPVerification,
  sendOTPVerificationLogin,
  sendPasswordResetEmail,
  sendPasswordToUser,
  sendRejectNotificationToOwner,
  uploadCloudinary,
} from "../Helpers/helper.js";
import Users from "../Models/userModel.js";
import otpGenerator from "otp-generator";
import OTP from "../Models/OTP-model.js";

// console.log("JWT Secret:", process.env.JWT_SECRET);

//sent otp api for register function
export const sendOTPRegister = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed! Please use POST method.",
      });
    }

    const { email, contactNumber } = req.body;

    // Check if all fields are provided
    if (!email || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Email validation with min/max length constraints
    const emailRegex =
      /^[\w.%+-]+@([a-zA-Z0-9-]+\.)+(gmail\.com|com|net|org|edu|gov|mil|co\.in|in|co|io|info|biz|tech|me|ai)$/i;
    if (!emailRegex.test(email) || email.length < 5 || email.length > 56) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email address! Please provide a valid email ending (com|net|org|edu|gov|mil|co.in|in|co|io|info|biz|tech|me|ai)",
      });
    }

    // Contact number validation - must start with '+91'
    const contactNumberRegex = /^\+91\d{10}$/;
    if (!contactNumberRegex.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "Contact number must be in the format '+91XXXXXXXXXX' and include the '+91' prefix without any Space.",
      });
    }

    // Check if the user is already present
    const checkUserPresent = await Users.findOne({ email });
    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already present!",
      });
    }

    // Generate OTP for email
    let emailOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    let emailResult = await OTP.findOne({ emailOtp });

    while (emailResult) {
      emailOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      emailResult = await OTP.findOne({ emailOtp });
    }

    // let contactOtp = otpGenerator.generate(6, {
    //   upperCaseAlphabets: false,
    //   specialChars: false,
    //   lowerCaseAlphabets: false,
    // });

    // let contactResult = await OTP.findOne({ contactOtp });

    // while (contactResult) {
    //   contactOtp = otpGenerator.generate(6, {
    //     upperCaseAlphabets: false,
    //     specialChars: false,
    //     lowerCaseAlphabets: false,
    //   });

    //   contactResult = await OTP.findOne({ contactOtp });
    // }

    // Create new OTP record
    const newOTP = await OTP.create({
      emailOtp,
      // contactOtp,
      contactOtp: emailOtp,
      email,
      contactNumber,
    });

    // console.log("register", emailOtp);

    // Send OTP via email and SMS
    await sendOTPVerification({
      email: newOTP.email,
      mobile: newOTP.contactNumber,
      emailOtp: newOTP.emailOtp,
      contactOtp: newOTP.contactOtp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully! Check your email and contact number.",
    });
  } catch (error) {
    console.log("Error in Sending OTP");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error in Sending OTP!",
    });
  }
};

// User Register
export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      contactNumber,
      employeeID,
      organizationName,
      department,
      roleInRTMS,
      emailOtp,
    } = req.body;

    const idCardPhoto = req.files?.idCardPhoto;
    const passportPhoto = req.files?.passportPhoto;

    // Checking if all fields are provided
    if (
      !username ||
      !email ||
      !contactNumber ||
      !employeeID ||
      !organizationName ||
      !department ||
      !roleInRTMS ||
      !emailOtp ||
      !idCardPhoto ||
      !passportPhoto
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Checking if user is already registered
    const existingUser = await Users.findOne({
      $or: [{ email }, { employeeID }, { contactNumber }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered with the provided details",
      });
    }

    // Fetching the most recent OTP
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Validating OTPs
    if (emailOtp !== recentOtp.emailOtp) {
      return res.status(400).json({
        success: false,
        message: "Provided OTP does not match the most recent OTP",
      });
    }
    recentOtp.deleteOne();

    // Validating file types (e.g., image)
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (
      !validImageTypes.includes(idCardPhoto.mimetype) ||
      !validImageTypes.includes(passportPhoto.mimetype)
    ) {
      return res.status(400).json({
        success: false,
        message: "Uploaded files must be images (jpeg, png, jpg)",
      });
    }

    // Uploading photos to Cloudinary
    const idCardPhotoRes = await uploadCloudinary(
      idCardPhoto,
      "rtms",
      1000,
      1000
    );
    const passportPhotoRes = await uploadCloudinary(
      passportPhoto,
      "rtms",
      1000,
      1000
    );

    // Creating new user
    const newUser = await Users.create({
      username,
      email,
      contactNumber,
      employeeID,
      organizationName,
      department,
      roleInRTMS,
      isApprovedByManager: roleInRTMS === "manager",
      idCardPhoto: idCardPhotoRes.secure_url,
      passportPhoto: passportPhotoRes.secure_url,
    });

    // Find the manager of the organization
    const manager = await Users.findOne({
      organizationName,
      roleInRTMS: "manager",
    });

    // Find the owner of the organization
    const owner = await Users.findOne({
      organizationName,
      roleInRTMS: "owner",
    });

    if (!manager || !owner) {
      return res.status(404).json({
        success: false,
        message: "No manager or owner found for this organization",
      });
    }

    // If the registered user is a manager, notify the owner
    if (roleInRTMS === "manager") {
      await sendNotificationToOwner(
        newUser.username,
        newUser.employeeID,
        newUser.contactNumber,
        newUser.email,
        newUser.department,
        owner.email
      );
      return res.status(201).json({
        success: true,
        message: "Manager registered successfully. Notification sent to Owner.",
      });
    }

    // If the registered user is an employee, notify both manager and owner
    if (roleInRTMS === "employee") {
      console.log("Sending notification to manager and owner for employee:", newUser.username);
      
      await sendNotificationToManager(
        newUser.username,
        newUser.employeeID,
        newUser.contactNumber,
        newUser.email,
        newUser.department,
        manager.email,
        owner.email
      )
      return res.status(201).json({
        success: true,
        message: "User registered successfully. Waiting for approval by Manager and Owner.",
      });
    }

    // Default response if the role is unhandled
    return res.status(400).json({
      success: false,
      message: "Invalid role provided for registration",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register user",
    });
  }
};

// Approve user by manager
export const approveUserByManager = async (req, res) => {
  try {
    const { employeeID } = req.body;

    if (!employeeID) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const user = await Users.findOne({ employeeID: employeeID });

    // return res.json({user})
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isApprovedByManager) {
      return res.json({
        success: false,
        message: "User already approved",
      });
    }

    //find the Organization of the Organization
    const owner = await Users.findOne({
      organizationName: user.organizationName,
      roleInRTMS: "owner",
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "No Owner found for this Organization",
      });
    }

    //send notifications to owner for approval
    await sendNotificationToOwner(
      user.username,
      user.employeeID,
      user.contactNumber,
      user.email,
      user.department,
      owner.email
    );

    // Set user's approval status
    user.isApprovedByManager = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User approved by manager and Now Wait for Owner Approvel",
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
    const { employeeID } = req.body;

    if (!employeeID) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const user = await Users.findOne({ employeeID: employeeID });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isApprovedByOwner) {
      return res.json({
        success: false,
        message: "User already approved",
      });
    }

    // Fetch the manager for the user's organization
    const manager = await Users.findOne({
      organizationName: user.organizationName,
      roleInRTMS: "manager",
    });

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found for the organization",
      });
    }

    // Check if user is also approved by owner
    if (user.isApprovedByOwner) {
      await sendPasswordToUser(user);
      await sendApprovedNotifactionToManager(user.employeeID, manager.email);
    }

    // Set user's approval status
    user.isApprovedByOwner = true;
    user.isApprovedByManager = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User approved by Owner and Manager and password sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve user by Owner",
    });
  }
};

// Reject user by manager
export const rejectUserByManager = async (req, res) => {
  try {
    const { employeeID } = req.body;

    if (!employeeID) {
      return res.status(400).json({
        success: false,
        message: "user ID is required",
      });
    }

    const user = await Users.findOne({ employeeID: employeeID });

    //return res.json({user})
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }

    //find the Owner of the Organization
    const owner = await Users.findOne({
      organizationName: user.organizationName,
      roleInRTMS: "owner",
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "No Owner found for this Organization",
      });
    }

    //set user reject status
    // const userDelete = await Users.deleteOne({ employeeID: employeeID });
    await Users.deleteOne({ employeeID: employeeID });

    //send notifications to owner for approval
    await sendRejectNotificationToOwner(
      user.username,
      user.employeeID,
      user.contactNumber,
      user.email,
      user.department,
      owner.email
    );

    res.status(200).json({
      success: true,
      message: "User Reject By Manger",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to Reject user by manager",
    });
  }
};

//Reject User By Owner
export const rejectUserByOwner = async (req, res) => {
  try {
    const { employeeID } = req.body;

    if (!employeeID) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const user = await Users.findOne({ employeeID: employeeID });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //find the manager of the Organization
    const manager = await Users.findOne({
      organizationName: user.organizationName,
      roleInRTMS: "manager",
    });

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "No Manager Found For the Organization",
      });
    }

    //set user reject status
    // const userDelete = await Users.deleteOne({ employeeID: employeeID });
    await Users.deleteOne({ employeeID: employeeID });

    //send notifications to manager for Reject User
    await sendRejectNotifactionToManager(
      user.username,
      user.employeeID,
      user.contactNumber,
      user.email,
      user.department,
      manager.email
    );

    res.status(200).json({
      success: true,
      message: "User Reject by Owner",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve user by Owner",
    });
  }
};

//Users Not Approval Yet (By Manager)
export const getNotApprovalManagerUser = async (req, res) => {
  try {
    const { organizationName } = req.params; 

    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required",
      });
    }

    // Find users where the manager has not approved, based on the organization name
    const approvedManagerUsers = await Users.find({
      organizationName: organizationName, 
      isApprovedByManager: false,        
    });

    res.status(200).json({
      success: true,
      message: "Unapproved Users Fetched Successfully",
      approvedManagerUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Fetching Unapproved Users By Manager",
    });
  }
};


//Users Not Approval Yet (By Manager and Owner)
export const getNotApprovalOwnerUser = async (req, res) => {
  try {
    const { organizationName } = req.params; 

    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required",
      });
    }

    // Find users where either manager or owner has not approved, based on the organization name
    const approvedOwnerUsers = await Users.find({
      organizationName: organizationName, 
      $or: [
        { isApprovedByManager: false },
        { isApprovedByOwner: false },  
      ],
    });

    res.status(200).json({
      success: true,
      message: "Unapproved Users Fetched Successfully",
      approvedOwnerUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Fetching Unapproved Users By Owner",
    });
  }
};


// Status check the registration
export const RegistrationStatusUser = async (req, res) => {
  try {
    const { employeeID } = req.body;

    // Find the user by employeeID
    const user = await Users.findOne({ employeeID });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Build the status message based on approval fields
    let statusMessage = "Registration Status: ";
    if (user.isApprovedByManager && user.isApprovedByOwner) {
      statusMessage +=
        "Registration Successful. Password sent to your email. Please login.";
    } else if (user.isApprovedByManager) {
      statusMessage += "Approved by Manager. Waiting for Owner approval.";
    } else {
      statusMessage += "Pending Manager approval.";
    }

    // Return the status
    res.status(200).json({
      success: true,
      message: "Data fetch successfull!",
      data: {
        employeeID: user.employeeID,
        username: user.username,
        email: user.email,
        contactNumber: user.contactNumber,
        organizationName: user.organizationName,
        department: user.department,
        roleInRTMS: user.roleInRTMS,
        idCardPhoto: user.idCardPhoto,
        passportPhoto: user.passportPhoto,
        isApprovedByManager: user.isApprovedByManager,
        isApprovedByOwner: user.isApprovedByOwner,
        status: statusMessage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve user status",
    });
  }
};

//sent otp api for login function
export const sendOTPLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Validate username according to the schema
    const usernamePattern = /^[a-zA-Z0-9_]{3,15}$/;
    if (!usernamePattern.test(username)) {
      return res.status(400).json({
        success: false,
        message:
          "Username must be 3-15 characters long and can only contain letters, numbers, and underscores(_).",
      });
    }

    // Find the user by username
    const user = await Users.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not present!",
      });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Check if the password matches
    if (!passwordMatch) {
      return res.status(404).json({
        success: false,
        message: "Password doesn't match. Please enter the correct password.",
      });
    }

    // Generate a unique 6-digit OTP
    let emailOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Ensure the OTP is unique
    let emailResult = await OTP.findOne({ emailOtp });

    while (emailResult) {
      emailOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      emailResult = await OTP.findOne({ emailOtp });
    }

    // Create a new OTP record in the database
    const newOTP = await OTP.create({
      emailOtp,
      contactOtp: emailOtp,
      email: user.email,
      contactNumber: user.contactNumber,
      // newOTP,// to show otp
    });

    // Send OTP to the user's email and phone
    await sendOTPVerificationLogin({
      email: user.email,
      mobile: user.contactNumber,
      emailOtp: emailOtp,
      contactOtp: emailOtp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully! Check your email and phone.",
    });
  } catch (error) {
    console.error("Error in sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error in sending OTP!",
    });
  }
};

// User login
export const loginUser = async (req, res) => {
  try {
    const { username, password, otp } = req.body;

    if (!username || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields required!",
      });
    }

    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not registered. Please Signup first!",
      });
    }

    const recentOtp = await OTP.findOne({ email: user.email }).sort({
      createdAt: -1,
    });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Validating OTPs
    if (otp !== recentOtp.contactOtp || otp !== recentOtp.emailOtp) {
      return res.status(400).json({
        success: false,
        message: "Provided OTPs do not match the most recent OTPs",
      });
    }
    recentOtp.deleteOne();

    const token = await jwt.sign(
      {
        _id: user._id,
        employeeID: user.employeeID,
        role: user.roleInRTMS,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      // user, //to all user details
      message: "User logged in successfully",
      token,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        contact: user.contactNumber,
        employeeID: user.employeeID,
        organization: user.organizationName,
        department: user.department,
        role: user.roleInRTMS,
        idCard: user.idCardPhoto,
        passport: user.passportPhoto,
      },
    });

    // Now wait for OTP verification step (implement verification endpoint)
  } catch (error) {
    // console.log("Error in Login Controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to login!",
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

    //sent otp
    let emailOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    let emailResult = await OTP.findOne({ emailOtp });

    while (emailResult) {
      emailOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      emailResult = await OTP.findOne({ emailOtp });
    }

    const newOTP = await OTP.create({
      emailOtp: emailOtp,
      contactOtp: emailOtp,
      email: user.email,
      contactNumber: user.contactNumber,
    });

    await sendPasswordResetEmail(email, emailOtp);

    res.status(200).json({
      success: true,
      message: "Password reset Verification OTP sent on email.",
      // newOTP,
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
    const { otp, newPassword, confirmPassword, email } = req.body;

    if (!otp || !newPassword || !confirmPassword || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // console.log("recent", req.body)

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetching the most recent OTP
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    // console.log("gxshg", recentOtp);

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Validating OTPs
    if (otp !== recentOtp.contactOtp || otp !== recentOtp.emailOtp) {
      return res.status(400).json({
        success: false,
        message: "Provided OTPs do not match the most recent OTPs",
      });
    }
    recentOtp.deleteOne();

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

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
