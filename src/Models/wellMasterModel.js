// import mongoose from "mongoose";

// // Define a schema for notification settings
// const AlertSchema = new mongoose.Schema({
//   normalAlert: {
//     type: String,
//     required: true,
//   },
//   normalCondition: {
//     type: String,
//     required: true,
//     enum: {
//       values: ["low", "high"],
//       message: " ",
//     },
//     default: "low",
//   },
//   normalDescription: {
//     type: String,
//     required: true,
//   },
//   criticalAlert: {
//     type: String,
//     required: true,
//   },
//   criticalCondition: {
//     type: String,
//     required: true,
//     enum: {
//       values: ["low", "high"],
//       message: " ",
//     },
//     default: "high",
//   },
//   criticalDescription: {
//     type: String,
//     required: true,
//   },
// });

// // Define a schema for Flow
// const flowCheckSchema = new mongoose.Schema({
//   firstPressure: {
//     type: String,
//     required: true,
//     enum: {
//       values: ["GIP", "CHP", "THP", "solarVoltage"],
//       message: " ",
//     },
//     default: "GIP",
//   },
//   comparison: {
//     type: String,
//     required: true,
//     enum: {
//       values: [">", "<", "="],
//       message: " ",
//     },
//     default: "=",
//   },
//   secondPressure: {
//     type: String,
//     required: true,
//     enum: {
//       values: ["GIP", "CHP", "THP", "solarVoltage"],
//       message: " ",
//     },
//     default: "GIP",
//   },
//   Tolerance: {
//     type: Number,
//     required: true,
//   },
// });

// // Define a schema for well notification settings
// const NotificationSettingsSchema = new mongoose.Schema({
//   gip: AlertSchema,
//   chp: AlertSchema,
//   thp: AlertSchema,
//   solarVoltage: AlertSchema,
// });

// const WellSchema = new mongoose.Schema({
//   organizationName: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   wellNumber: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   wellLocation: {
//     type: String,
//     required: true,
//   },
//   wellInstallation: {
//     type: String,
//     required: true,
//   },
//   wellLandmark: {
//     type: String,
//     required: true,
//   },
//   wellLatitude: {
//     type: Number,
//     required: true,
//     min: -90,
//     max: 90,
//   },
//   wellLongitude: {
//     type: Number,
//     required: true,
//     min: -180,
//     max: 180,
//   },
//   wellDescription: {
//     type: String,
//     required: true,
//   },
//   isApprovedByManager: {
//     type: Boolean,
//     default: false,
//   },
//   isApprovedByOwner: {
//     type: Boolean,
//     default: false,
//   },
//   notificationSettings: {
//     type: NotificationSettingsSchema,
//     required: true,
//   },
//   flowing: {
//     type: flowCheckSchema,
//     required: true,
//   },
//   notFlowing: {
//     type: flowCheckSchema,
//     required: true,
//   },
// });

// const Well = mongoose.model("Well", WellSchema);

// export default Well;

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
  isApprovedByManager: {
    type: Boolean,
    default: false,
  },
  isApprovedByOwner: {
    type: Boolean,
    default: false,
  },
  // notificationSettings: [
  //   {
  //     parameter: {
  //       type: String,
  //     },
  //     normalAlert: {
  //       type: Number,
  //       required: true,
  //     },
  //     normalCondition: {
  //       type: String,
  //       required: true,
  //     },
  //     normalDescription: {
  //       type: String,
  //     },
  //     criticalAlert: {
  //       type: Number,
  //       required: true,
  //     },
  //     criticalCondition: {
  //       type: String,
  //       required: true,
  //     },
  //     criticalDescription: {
  //       type: String,
  //     },
  //   },
  // ],
  notificationSettings: {
    gip: {
      normalAlert: {},
      normalCondition: {},
      normalDescription: {},
      criticalAlert: {},
      criticalCondition: {},
      criticalDescription: {},
    },
    chp: {
      normalAlert: {},
      normalCondition: {},
      normalDescription: {},
      criticalAlert: {},
      criticalCondition: {},
      criticalDescription: {},
    },
    thp: {
      normalAlert: {},
      normalCondition: {},
      normalDescription: {},
      criticalAlert: {},
      criticalCondition: {},
      criticalDescription: {},
    },
    solarVoltage: {
      normalAlert: {},
      normalCondition: {},
      normalDescription: {},
      criticalAlert: {},
      criticalCondition: {},
      criticalDescription: {},
    },
  },
});

const Well = mongoose.model("Well", WellSchema);

export default Well;
