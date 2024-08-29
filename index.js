import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./src/Routes/usersRoutes.js";
import wellMasterRoutes from "./src/Routes/wellMasterRoutes.js";
import Mongodb from "./src/Database/connectToDatabase.js";
import connectCloudinary from "./src/Config/cloudinary.js";
import fileUpload from "express-fileupload";
import deviceRouter from "./src/Routes/deviceManagerRoutes.js";
import externaldeviceRouter from "./src/Routes/externalDeviceRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectCloudinary();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/wellmaster", wellMasterRoutes);
app.use("/api/v1/devicemanager", deviceRouter);
app.use("/api/v1/externaldevice", externaldeviceRouter)

app.listen(PORT, () => {
  Mongodb();
  console.log(`Server is running on port ${PORT}`);
});
