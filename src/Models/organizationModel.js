import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true, 
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
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
      },
      level1: {
        type: String,
        required: true,
      },
      level2: {
        type: String,
        required: true,
      },
    },
  ],
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
