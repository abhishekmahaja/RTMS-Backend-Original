import express from "express";
import {
  organizationAddApprovalChainData,
  organizationAddDepartmentData,
  organizationAddPositionData,
  organizationUpdateData,
} from "../Controllers/organizationController.js";

const organizationRouter = express.Router();

// Route to update organization data
organizationRouter.post("/organization-update-data", organizationUpdateData);
// Route to add department
organizationRouter.post(
  "/organization-add-department-data",
  organizationAddDepartmentData
);
// Route to add position
organizationRouter.post(
  "/organization-add-position-data",
  organizationAddPositionData
);
// Route to add approval chain
organizationRouter.post(
  "/organization-add-approval-chain-data",
  organizationAddApprovalChainData
);

export default organizationRouter;
