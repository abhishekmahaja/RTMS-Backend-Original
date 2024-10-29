import mongoose from "mongoose";

const externalDeviceSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  // },
  // data: {
  //   type: String,
  // },
  // organizationName: {
  //   type: String,
  //   // required: true,
  // },
  // wellNumber: {
  //   type: String,
  //   unique: true,
  // },
  // nodeID: {
  //   type: String,
  // },
  data: {
    type: Map, 
    of: Number, 
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

const ExternalDevice = mongoose.model("ExternalDevice", externalDeviceSchema);

export default ExternalDevice;

