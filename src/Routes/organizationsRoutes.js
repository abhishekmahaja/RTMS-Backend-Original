import express from "express";
import {
  organizationAddData,
  organizationUpdateData,
} from "../Controllers/organizationController.js";

const organizationRouter = express.Router();


// Route to add Organization
organizationRouter.post("/organization-add-data", organizationAddData);
// Route to Update organization
organizationRouter.put("/organization-update-data", organizationUpdateData);
// Route to Get Organization

export default organizationRouter;
