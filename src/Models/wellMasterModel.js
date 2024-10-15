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

// Schema for well details
const WellDetailsSchema = new mongoose.Schema({
  wellLocation: {
    type: String,
    required: true,
  },
  wellInstallations: {
    type: [String],
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
    wellNumber: {
      type: String,
      unique: true,
    },
    wellType: {
      type: String,
      enum: ["All", "selfFlowing", "puggerWell"],
    default: "All",
    },
    wellLocations: {
      type: [WellDetailsSchema],
      required: true,
    },
    wellLandmarks: {
      type: String,
    },
    wellLatitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    wellLongitude: {
      type: Number,
      min: -180,
      max: 180,
    },
    wellDescription: {
      type: String,
    },
    isApprovedByManager: {
      type: Boolean,
      default: false,
    },
    isApprovedByOwner: {
      type: Boolean,
      default: false,
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
  },
  { timestamps: true }
);

const Well = mongoose.model("Well", WellSchema);

export default Well;
