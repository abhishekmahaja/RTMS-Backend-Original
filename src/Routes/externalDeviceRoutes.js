import express from "express";
import {
  externalDataCollect,
  externalDataShow,
  getSingleWellNodeDataByOrganization,
  getNodeAllDataByOrganization,
} from "../Controllers/externalDevicesControllers.js";

const externaldeviceRouter = express.Router();

//routes to call api of external
externaldeviceRouter.post("/external-device-collect", externalDataCollect);
externaldeviceRouter.get("/external-device-show", externalDataShow);
externaldeviceRouter.get("/get-node-all-data-by-organization", getNodeAllDataByOrganization);
externaldeviceRouter.get("/get-single-well-node-data-by-organization", getSingleWellNodeDataByOrganization);

export default externaldeviceRouter;
