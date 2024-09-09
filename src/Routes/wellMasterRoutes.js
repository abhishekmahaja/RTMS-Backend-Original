import express from "express";
import {
  addWell,
  updateWell,
  deleteWell,
  getAllWells,
  getOneWell,
  getNotApprovalWells,
  wellApprovedByManager,
  wellApprovedByOwner,
} from "../Controllers/wellMasterController.js";

const wellRouter = express.Router(); // Correctly define wellRouter

// routes to call API
wellRouter.post("/add-well", addWell);
wellRouter.put("/update-well/:id", updateWell);
wellRouter.delete("/delete-well/:id", deleteWell);
wellRouter.get("/all-well", getAllWells);
wellRouter.get("/single-well/:id", getOneWell);
wellRouter.post("/well-approved-by-manager/:id", wellApprovedByManager);
wellRouter.post("/well-Approved-by-owner/:id", wellApprovedByOwner);
wellRouter.get("/get-not-approval-wells", getNotApprovalWells);

export default wellRouter;
