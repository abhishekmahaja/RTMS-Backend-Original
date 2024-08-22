import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(v),
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    contactNumber: {
      type: String,
      required: true,
    },
    employeeID: {
      type: String,
      required: true,
      unique: true,
    },
    assetName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    roleInRTMS: {
      type: String,
      required: true,
      enum: ["manager", "owner", "employee"],
      default: "emloyee",
    },
    idCardPhoto: {
      type: String, // Path to ID card photo
    },
    passportPhoto: {
      type: String,
    },
    isApprovedByManager: {
      type: Boolean,
      default: false,
    },
    isApprovedByOwner: {
      type: Boolean,
      default: false,
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true } // This will automatically add `createdAt` and `updatedAt` fields
);

const Users = mongoose.model("Users", userSchema);

export default Users;
