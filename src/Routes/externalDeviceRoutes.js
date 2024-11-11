import express from "express";
import {
  externalDataCollect,
  externalDataShow,
  externalDataWellAndNodeIDShow,
  getNodeAllDataByOrganization,
} from "../Controllers/externalDevicesControllers.js";

const externaldeviceRouter = express.Router();

//routes to call api of external
externaldeviceRouter.post("/external-device-collect", externalDataCollect);
externaldeviceRouter.get("/external-device-show", externalDataShow);
externaldeviceRouter.get("/get-node-all-data-by-organization", getNodeAllDataByOrganization);
externaldeviceRouter.get("/external-data-well-and-nodeID-show", externalDataWellAndNodeIDShow);

export default externaldeviceRouter;
