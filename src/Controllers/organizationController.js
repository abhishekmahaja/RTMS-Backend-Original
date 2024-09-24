import { sendOTPVerification } from "../Helpers/helper.js";
import Organization from "../Models/organizationModel.js";
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

//admin Generate Otp for Create Organization
export const generateOtpOragnization = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed! Please use Post Method",
      });
    }

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

    //create new OTP record
    const newOTP = await OTP.create({
      emailOtp,
      // contactOtp,
      email,
      contactNumber,
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
    const {organizationName, } = req.body;
  } catch (error) {
    
  }
}
