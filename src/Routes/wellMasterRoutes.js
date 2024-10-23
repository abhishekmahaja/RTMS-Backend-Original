import express from "express";
import {
  addAndUpdateWell,
  getAllWellsApprovedBoth,
  getSingleWellApprovedBoth,
  getNotApprovalOwnerWells,
  wellApprovedByManager,
  wellApprovedByOwner,
  addWellLocation,
  addInstallationToLocation,
  addWellTypeAndNumber,
  getWellLocation,
  getInstallationsByLocation,
  getAllWellTypesAndNumber,
  getOneWellByWellNumber,
  getNotApprovalManagerWells,
  rejectWellByManager,
  rejectWellByOwner,
  deleteWellByNumber,
} from "../Controllers/wellMasterController.js";
import {
  isManager,
  isOwner,
  protectRoute,
} from "../Middleware/protectedRoutes.js";

const wellRouter = express.Router();

// routes to call API
wellRouter.post("/add-well-location", addWellLocation);
wellRouter.get("/get-well-location", getWellLocation);
wellRouter.post("/add-installation-to-location", addInstallationToLocation);
wellRouter.get("/get-installations-by-location", getInstallationsByLocation);
wellRouter.post("/add-well-type-and-number", addWellTypeAndNumber);
wellRouter.get("/get-all-well-types-and-number", getAllWellTypesAndNumber);
wellRouter.get("/get-one-well-by-well-number", getOneWellByWellNumber);
wellRouter.post("/add-and-update-well", addAndUpdateWell);
wellRouter.post(
  "/well-approved-by-manager",
  protectRoute,
  isManager,
  wellApprovedByManager
);
wellRouter.post(
  "/well-Approved-by-owner",
  protectRoute,
  isOwner,
  wellApprovedByOwner
);
wellRouter.post(
  "/reject-well-by-manager",
  protectRoute,
  isManager,
  rejectWellByManager
);
wellRouter.post(
  "/reject-well-by-owner",
  protectRoute,
  isOwner,
  rejectWellByOwner
);
wellRouter.get("/get-not-approval-owner-wells", getNotApprovalOwnerWells);
wellRouter.get("/get-not-approval-manager-wells", getNotApprovalManagerWells);
wellRouter.get("/get-all-wells-approved-both", getAllWellsApprovedBoth);
wellRouter.get("/get-single-well-approved-both", getSingleWellApprovedBoth);
wellRouter.delete(
  "/delete-well-by-number",
  protectRoute,
  isOwner,
  deleteWellByNumber
);

export default wellRouter;
