import mongoose from "mongoose";

//Department update schema
const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: [true, "Department name is required"],
  },
  positions: {
    type: [String],
  },
  approvalChain: [{
    action: {
      type: String,
    },
    level1: {
      type: String, 
    },
    level2: {
      type: String, 
    },
  }],
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
    organizationlogo: {
      type: String,
      required: [true, "Organization Logo is Required"],
      unique: true,
      default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdribbble.com%2Fshots%2F22963525-Mahajan-Logo-Design&psig=AOvVaw1vg_MLNNACVe7imTQPab3p&ust=1728365702726000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICitZbG-4gDFQAAAAAdAAAAABAE",
    },
    subtitlename: {
      type: String,
      required: true,
      unique: true,
      // default: "organization Subtitle",
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
    departments: [departmentSchema], 
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
