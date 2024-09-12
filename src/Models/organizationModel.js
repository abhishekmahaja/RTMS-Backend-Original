import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({

});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;