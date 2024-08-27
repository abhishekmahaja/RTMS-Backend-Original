import express from "express";
import {
  addWell,
  updateWell,
  deleteWell,
  getAllWells,
  getOneWell,
} from "../Controllers/wellMasterController.js";

const wellRouter = express.Router(); // Correctly define wellRouter

// routes to call API
wellRouter.post("/add-well", addWell);
wellRouter.put("/update-well/:id", updateWell);
wellRouter.delete("/delete-well/:id", deleteWell);
wellRouter.get("/all-well", getAllWells);
wellRouter.get("/single-well/:id", getOneWell);

export default wellRouter;
