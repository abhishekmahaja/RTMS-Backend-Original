import mongoose from "mongoose";

// Schema for well installations
const WellInstallationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },
  wellLocation: {
    type: String,
    required: true,
  },
  wellInstallation: {
    type: String,
    required: true,
  },
});

const Installation = mongoose.model("Installation", WellInstallationSchema);

export default Installation;
