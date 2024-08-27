import mongoose from "mongoose";

const WellSchema = new mongoose.Schema({
  wellNumber: {
    type: String,
    unique: true,
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
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  notificationSettings: [
    {
      parameter: {
        type: String,
      },
      normalAlert: {
        type: Number,
        required: true,
      },
      normalCondition: {
        type: String,
        required: true,
      },
      normalDescription: {
        type: String,
      },
      criticalAlert: {
        type: Number,
        required: true,
      },
      criticalCondition: {
        type: String,
        required: true,
      },
      criticalDescription: {
        type: String,
      },
    },
  ],
});

const Well = mongoose.model("Well", WellSchema);

export default Well;
