import express from "express";
import {
  allDevice,
  generatePublishSecurityCode,
  generateSubscribeSecurityCode,
  getOneDevice,
  submitDeviceData,
} from "../Controllers/deviceManagerController.js";

const deviceRouter = express.Router();

//routes to call API
deviceRouter.post("/publish-code", generatePublishSecurityCode);
deviceRouter.post("/subscribe-code", generateSubscribeSecurityCode);
deviceRouter.get("/all-device", allDevice);
deviceRouter.get("/one-device/:id", getOneDevice);
deviceRouter.post("/submit-device", submitDeviceData);

export default deviceRouter;
