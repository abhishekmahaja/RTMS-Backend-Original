import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
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
  departments: [String],
  positions: [String],
  approvalChain: [
    {
      action: {
        type: String,
        required: true,
        default: "fgdf",
      },
      level1: {
        type: String,
        required: true,
        default: "dsfrsg",
      },
      level2: {
        type: String,
        required: true,
        default: "fesrtg",
      },
    },
  ],
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
