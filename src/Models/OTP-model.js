import mongoose from "mongoose";
import { sendOTPVerification } from "../Helpers/helper.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  emailOtp: {
    type: String,
    required: true,
  },
  contactOtp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "5m",
  },
});

otpSchema.pre("save", async function (next) {
  await sendOTPVerification({
    email: this.email,
    mobile: this.contactNumber,
    emailOtp : this.emailOtp,
    contactOtp : this.contactOtp
  });

  next();
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
