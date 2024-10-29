import express from "express";
import {
  externalDataCollect,
  externalDataShow,
  externalDataWellAndNodeIDShow,
} from "../Controllers/externalDevicesControllers.js";

const externaldeviceRouter = express.Router();

//routes to call api of external
externaldeviceRouter.post("/external-device-collect", externalDataCollect);
externaldeviceRouter.get("/external-device-show", externalDataShow);
externaldeviceRouter.get("/external-data-well-and-nodeID-show", externalDataWellAndNodeIDShow);

export default externaldeviceRouter;
