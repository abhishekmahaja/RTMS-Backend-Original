import mongoose from "mongoose";

//Department update schema
const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: [true, "Department name is required"],
  },
  positions: {
    type: [String], // No default, will be added only if provided
  },
  approvalChain: {
    action: {
      type: [String], // Array of strings, no default value
    },
    level1: {
      type: [String], // Array of strings, no default value
    },
    level2: {
      type: [String], // Array of strings, no default value
    },
  },
});

//organization update schema
const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      default: "abc",
    },
    city: {
      type: String,
      required: true,
      default: "abc",
    },
    state: {
      type: String,
      required: true,
      default: "avd",
    },
    country: {
      type: String,
      required: true,
      default: "sddcd",
    },
    pinCode: {
      type: String,
      required: true,
      default: "201555",
    },
    phone: {
      type: String,
      required: true,
      default: "+915545547854",
    },
    fax: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: (v) => /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(v),
        message: (props) => `${props.value} is not a valid email address!`,
      },
      default: "owner@gmail.com",
    },
    departments: [departmentSchema], // Updated with department schema
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
