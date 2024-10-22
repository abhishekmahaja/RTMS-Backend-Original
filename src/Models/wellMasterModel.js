import mongoose from "mongoose";

// Alert schema for notification settings
const AlertSchema = new mongoose.Schema({
  normalAlert: {
    type: String,
  },
  normalCondition: {
    type: String,
    required: true,
    enum: ["low", "high"],
    default: "low",
  },
  normalDescription: {
    type: String,
  },
  criticalAlert: {
    type: String,
  },
  criticalCondition: {
    type: String,
    required: true,
    enum: ["low", "high"],
    default: "high",
  },
  criticalDescription: {
    type: String,
  },
});

// Flow check schema for pressure comparisons
const FlowCheckSchema = new mongoose.Schema({
  firstPressure: {
    type: String,
    required: true,
    enum: ["GIP", "CHP", "THP", "solarVoltage"],
    default: "GIP",
  },
  comparison: {
    type: String,
    required: true,
    enum: [">", "<", "="],
    default: "=",
  },
  secondPressure: {
    type: String,
    required: true,
    enum: ["GIP", "CHP", "THP", "solarVoltage"],
    default: "GIP",
  },
  tolerance: {
    type: Number,
  },
});

// Main Well schema
const WellSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      unique: true,
    },
    wellLocation: {
      type: String,
      required: true,
    },
    wellInstallation: {
      type: String,
      required: true,
    },
    wellNumber: {
      type: String,
      unique: true,
    },
    wellType: {
      type: String,
      enum: ["All", "selfFlowing", "puggerWell"],
      default: "All",
    },
    wellLandmarks: {
      type: String,
    },
    wellLatitude: {
      type: String,
    },
    wellLongitude: {
      type: String,
    },
    wellDescription: {
      type: String,
    },
    alertSettings: {
      type: AlertSchema,
    },
    flowing: {
      type: FlowCheckSchema,
    },
    notFlowing: {
      type: FlowCheckSchema,
    },
    isApprovedByManager: {
      type: Boolean,
      default: false,
    },
    isApprovedByOwner: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Well = mongoose.model("Well", WellSchema);

export default Well;
