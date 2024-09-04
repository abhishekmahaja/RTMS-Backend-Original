import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      validate: {
        validator: (v) => /^[a-zA-Z0-9_]{3,30}$/.test(v),
        message:
          "Username must be 3-30 characters long and can only contain letters, numbers, and underscores.",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: (v) => /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(v),
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      validate: {
        validator: (v) => /^\+91[0-9]{10}$/.test(v),
        message:
          "Contact number must be in the format '+91XXXXXXXXXX' and include the '+91' prefix Without any Space.",
      },
    },
    employeeID: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      validate: {
        validator: (v) => /^[a-zA-Z0-9]{5,20}$/.test(v),
        message:
          "Employee ID must be 5-20 characters long and can only contain letters and numbers.",
      },
    },
    assetName: {
      type: String,
      required: [true, "Asset name is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
    },
    roleInRTMS: {
      type: String,
      required: [true, "Role in RTMS is required"],
      enum: {
        values: ["manager", "owner", "employee"],
        message: "Role must be either 'manager', 'owner', or 'employee'.",
      },
      default: "employee",
    },
    idCardPhoto: {
      type: String,
      required: [true, "ID card photo is required"],
    },
    passportPhoto: {
      type: String,
      required: [true, "Passport photo is required"],
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
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
