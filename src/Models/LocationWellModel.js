import mongoose from "mongoose";

// Schema for well locations
const WellLocationSchema = new mongoose.Schema({
    organizationName :{
      type: String,
      required: true,
    },
    wellLocation: {
      type: String,
      required: true, 
    },
  });

const Location = mongoose.model("Location", WellLocationSchema);

export default Location;