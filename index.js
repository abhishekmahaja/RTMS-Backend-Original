import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./src/Routes/usersRoutes.js";
import Mongodb from "./src/Database/connectToDatabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => {
  Mongodb();
  console.log(`Server is running on port ${PORT}`);
});
