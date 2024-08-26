import mongoose from "mongoose";

const WellSchema = new mongoose.Schema({
  wellNumber: String,
  wellLocation: String,
  wellInstallation: String,
  latitude: Number,
  longitude: Number,
  notificationSettings: [
    {
      parameter: String,
      normalAlert: Number,
      normalCondition: String,
      normalDescription: String,
      criticalAlert: Number,
      criticalCondition: String,
      criticalDescription: String,
    },
  ],
});

export default WellSchema;
