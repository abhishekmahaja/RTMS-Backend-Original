import mongoose from "mongoose";

const externalDeviceSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  data: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

const externalDevice = mongoose.model("externalDevice", externalDeviceSchema);

export default externalDevice;
