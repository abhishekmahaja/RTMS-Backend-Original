import express from "express";
import {
  addApprovalChain,
  addDepartment,
  addPosition,
  createOrganization,
  deleteApprovalChain,
  deleteDepartment,
  deletePosition,
  departmentBaseOrgNameDropdown,
  generateOtpOragnization,
  getApprovalChain,
  getDataBasedOnOrganization,
  getPositions,
  organizationAddData,
  organizationDropDown,
  organizationGetData,
  organizationUpdateData,
  updateApprovalChain,
  updateDepartment,
  updatePosition,
} from "../Controllers/organizationController.js";

const organizationRouter = express.Router();
organizationRouter.get("/get-data-based-on-organization", getDataBasedOnOrganization);
organizationRouter.post("/organization-add-data", organizationAddData);
organizationRouter.put("/organization-update-data", organizationUpdateData);
organizationRouter.get("/organization-get-data", organizationGetData);
organizationRouter.post("/generate-otp-oragnization", generateOtpOragnization);
organizationRouter.post("/create-organization", createOrganization);
organizationRouter.get("/organization-drop-down", organizationDropDown);
organizationRouter.post(
  "/department-base-org-name-dropdown",
  departmentBaseOrgNameDropdown
);
organizationRouter.post("/add-department", addDepartment);
organizationRouter.put("/update-department", updateDepartment);
organizationRouter.delete("/delete-department", deleteDepartment);
organizationRouter.post("/add-position", addPosition);
organizationRouter.get("/get-positions", getPositions);
organizationRouter.put("/update-position", updatePosition);
organizationRouter.delete("/delete-position", deletePosition);
organizationRouter.post("/add-approval-chain", addApprovalChain);
organizationRouter.get("/get-approval-chain", getApprovalChain);
organizationRouter.put("/update-approval-chain", updateApprovalChain);
organizationRouter.delete("/delete-approval-chain", deleteApprovalChain);

export default organizationRouter;
