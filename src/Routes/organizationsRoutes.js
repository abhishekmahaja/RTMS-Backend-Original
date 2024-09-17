import express from "express";
import {
  organizationAddData,
  organizationGetOneData,
  organizationUpdateData,
} from "../Controllers/organizationController.js";

const organizationRouter = express.Router();

// Route to add Organization
organizationRouter.post("/organization-add-data", organizationAddData);
// Route to Update organization
organizationRouter.put("/organization-update-data/:id", organizationUpdateData);
// Route to Get Organization
organizationRouter.get(
  "/organization-get-one-data/:id",
  organizationGetOneData
);

export default organizationRouter;
