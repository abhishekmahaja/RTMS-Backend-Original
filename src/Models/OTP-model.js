import mongoose from "mongoose";

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

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
