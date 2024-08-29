import express from "express";
import {
  externalDataCollect,
  externalDataShow,
} from "../Controllers/externalDevicesControllers.js";

const externaldeviceRouter = express.Router();

//routes to call api of external
externaldeviceRouter.post("/external-device-collect", externalDataCollect);
externaldeviceRouter.get("/external-device-show", externalDataShow);

export default externaldeviceRouter;
