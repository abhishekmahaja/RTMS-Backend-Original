import express from "express";
import { organizationAddData } from "../Controllers/organizationController.js";

const organizationRouter = express.Router();

//Routes to Call API
organizationRouter.post("/organization-add-data",organizationAddData);

export default organizationRouter;
