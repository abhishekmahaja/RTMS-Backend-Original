import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema({
  MACAddress: {
    type: String,
    required: true,
  },
  selectWell: {
    type: String,
    required: true,
  },
  publishSecurityCode: {
    type: String,
    required: true,
  },
  subscribeSecurityCode: {
    type: String,
    required: true,
  },
  parameter: [
    {
      GIP: {
        type: Boolean,
        default: false,
      },
      THP: {
        type: Boolean,
        default: false,
      },
      battery: {
        type: Boolean,
        default: false,
      },
      solarPower: {
        type: Boolean,
        default: false,
      },
      Comunication: {
        type: Boolean,
        default: false,
      },
      CPUTemperature: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Device = mongoose.model("Device", DeviceSchema);

export default Device;
