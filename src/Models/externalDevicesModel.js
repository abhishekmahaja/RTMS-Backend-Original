import mongoose from "mongoose";

const externalDeviceSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  // },
  // data: {
  //   type: String,
  // },
  data: {
    type: Map, // Using Map allows storing key-value pairs
    of: Number, // Values in the map are expected to be Numbers
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

const externalDevice = mongoose.model("externalDevice", externalDeviceSchema);

export default externalDevice;

