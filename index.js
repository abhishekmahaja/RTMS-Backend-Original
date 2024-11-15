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
import organizationRouter from "./src/Routes/organizationsRoutes.js";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
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
app.use("/api/v1/externaldevice", externaldeviceRouter);
app.use("/api/v1/organization", organizationRouter);

const server = app.listen(PORT, () => {
  Mongodb();
  console.log(`Server is running on port ${PORT}`);
});

// WebSocket server setup
const wss = new WebSocketServer({ server });

// Broadcast function to send messages to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// wss.on("headers", (headers, request) => {
//   console.log("Headers received during handshake:", headers);
// });

// Event handling for new WebSocket connections
wss.on("connection", (ws) => {
  console.log(`WebSocket connecteding on port ${PORT}`);

  // Listen for messages from clients
  ws.on("message", (data) => {
    console.log("Received data from client: %s", data);

    // Here, you can process the received data if necessary
    ws.send(JSON.stringify({ message: "Thank you for sending Well data!" }));
  });

  ws.on("close", () => console.log("WebSocket connection closed"));
});

// wss.on("connection", (ws, req) => {
//   console.log(`New connection from: ${req.socket.remoteAddress}`);
// });

export { broadcast };
