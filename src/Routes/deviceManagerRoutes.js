import express from "express";
import {
  allDevice,
  deleteDevice,
  deviceApprovalByManager,
  deviceApprovalByOwner,
  generatePublishSecurityCode,
  generateSubscribeSecurityCode,
  getNotApprovalDevices,
  getOneDevice,
  submitDeviceData,
  updateDevice,
} from "../Controllers/deviceManagerController.js";

const deviceRouter = express.Router();

//routes to call API
deviceRouter.post("/publish-code", generatePublishSecurityCode);
deviceRouter.post("/subscribe-code", generateSubscribeSecurityCode);
deviceRouter.get("/all-device", allDevice);
deviceRouter.get("/single-device/:id", getOneDevice);
deviceRouter.post("/submit-device", submitDeviceData);
deviceRouter.post("device-approval-by-manager/:id", deviceApprovalByManager);
deviceRouter.post("device-approval-by-owner/:id", deviceApprovalByOwner);
deviceRouter.get("get-not-approval-devices", getNotApprovalDevices);
deviceRouter.delete("/delete-device/:id", deleteDevice);
deviceRouter.put("/update-device/:id", updateDevice);

export default deviceRouter;
