import {
  sendNewCreateOrganization,
  sendOTPVerification,
} from "../Helpers/helper.js";
import bcrypt from "bcryptjs";
import Organization from "../Models/organizationModel.js";
import otpGenerator from "otp-generator";
import Users from "../Models/userModel.js";
import OTP from "../Models/OTP-model.js";

// organization Add Data APi
export const organizationAddData = async (req, res) => {
  try {
    const organizationAdd = await Organization.create(req.body);
    res.json({
      success: true,
      message: "Data Update Successfully",
      data: organizationAdd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating organization data",
    });
  }
};

// Organization Update Data API
export const organizationUpdateData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Enter The Id of Organization",
      });
    }

    const organizationUpdate = await Organization.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!organizationUpdate) {
      return res.status(404).json({
        success: false,
        message: "Organization Not Found",
      });
    }

    res.json({
      success: true,
      message: "Data Update Successfully",
      data: organizationUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating organization data",
    });
  }
};

// Organization Get Data API
export const organizationGetOneData = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationUpdate = await Organization.findById(
      { _id: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!organizationUpdate) {
      return res.status(404).json({
        success: false,
        message: "Organization Not Found",
      });
    }

    res.json({
      success: true,
      message: "Data Update Successfully",
      data: organizationUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating organization data",
    });
  }
};

//ADMIN TO CREATE ORGANIZATION

//admin Generate Otp for Create Organization
export const generateOtpOragnization = async (req, res) => {
  try {
    const { email, contactNumber } = req.body;

    //checking if all required
    if (!email || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
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

    //check if organization is already present
    const checkOrganizationPresent = await Organization.findOne({ email });
    if (checkOrganizationPresent) {
      return res.status(400).json({
        success: false,
        message: "Organization Already Present!",
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

    //generate contact otp
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

    console.log("email", emailOtp);

    //create new OTP record
    const newOTP = await OTP.create({
      email,
      contactNumber,
      emailOtp,
      contactOtp: emailOtp, // Using the same OTP for both email and contact number
    });

    //send OTP via Email and SMS
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

//Admin Create Organization
export const createOrganization = async (req, res) => {
  try {
    const {
      organizationName,
      username,
      password,
      email,
      contactNumber,
      // contactOtp,
      emailOtp,
    } = req.body;

    //checking if all fileds are provided
    if (
      !organizationName ||
      !username ||
      !password ||
      !email ||
      !contactNumber ||
      // !contactOtp ||
      !emailOtp
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    //checking if Organization is Allready created
    const existingOrganization = await Organization.findOne({
      $or: [{ email }, { username }, { organizationName }],
    });
    if (existingOrganization) {
      return res.status(400).json({
        success: false,
        message: "Organization Allready Created",
      });
    }

    //Fetching the most Recent OTP
    const recentOtp = await OTP.findOne({ email }).sort({ createAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not Found",
      });
    }

    // Log recent OTP and email OTP for debugging
    console.log("Recent OTP from DB:", recentOtp.emailOtp);
    console.log("Provided email OTP:", emailOtp);

    //validing OTPs
    if (
      // contactOtp !== recentOtp.contactOtp ||
      emailOtp !== recentOtp.emailOtp
    ) {
      return res.status(400).json({
        success: false,
        message: "Provided OTPs do not match the most recent OTPs",
      });
    }

    await OTP.deleteOne({ emailOtp: emailOtp });

    //organization Created by Admin
    const newOrganization = await Organization.create({
      username,
      organizationName,
    });

    //hash the password
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Creating new user for organization
    const newUser = await Users.create({
      username,
      email,
      contactNumber,
      organizationName,
      roleInRTMS: "owner",
      password: hashedPassword,
      isApprovedByManager: true,
      isApprovedByOwner: true,
    });

    //send Notification to Owner to created organization
    await sendNewCreateOrganization(
      newOrganization.username,
      newOrganization.organizationName,
      newUser.contactNumber,
      newUser.email,
      newUser.password
      // newUser
    );

    res.status(201).json({
      success: true,
      message: "Organization Created successfully.",
      data: {
        _id: newOrganization._id,
        username: newOrganization.username,
        email: newOrganization.email,
        contactNumber: newOrganization.contactNumber,
        organizationName: newOrganization.organizationName,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register user",
    });
  }
};

//Organization Dropdown
export const organizationDropDown = async (req, res) => {
  try {
    // Fetch only the 'organizationName' field
    const organizationName = await Organization.find().select(
      "organizationName"
    );

    res.status(200).json({
      success: true,
      message: "All Organization Name Fetch Successfully",
      data: organizationName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Fetching Organization Name",
    });
  }
};

//Department Dropdown on the base of orgnaziation name
export const departmentBaseOrgNameDropdown = async (req, res) => {
  try {
    const { organizationName } = req.body;
    const departmentdropdown = await Organization.find({
      organizationName,
    }).select("departments");

    res.status(200).json({
      success: true,
      message:
        "All Department Name Fetch Successfully on the base of Organization",
      data: departmentdropdown,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error Fetching Department Name",
    });
  }
};
