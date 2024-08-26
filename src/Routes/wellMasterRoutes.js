import express from "express";
import {
  addWell,
  updateWell,
  deleteWell,
  getWells,
} from "../Controllers/wellMasterController.js";

const wellRouter = express.Router(); // Correctly define wellRouter

// routes to call API
wellRouter.post("/add", addWell);
wellRouter.put("/update/:id", updateWell);
wellRouter.delete("/delete/:id", deleteWell);
wellRouter.get("/all", getWells);

export default wellRouter;
