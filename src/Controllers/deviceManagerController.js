// import express from "express";
// const router = express.Router();

// // Sample data for wells (replace with database calls)
// const wells = [
//   { id: "1", name: "Well A" },
//   { id: "2", name: "Well B" },
// ];

// // GET /read-mac
// router.get("/read-mac", (req, res) => {
//   const macAddress = "00:1A:2B:3C:4D:5E"; // Replace with actual MAC address retrieval logic
//   res.json({ macAddress });
// });

// // GET /get-wells
// router.get("/get-wells", (req, res) => {
//   res.json(wells);
// });

// // POST /generate-publish-code
// router.post("/generate-publish-code", (req, res) => {
//   const publishCode = Math.random().toString(36).substring(2, 10).toUpperCase(); // Generate a random code
//   res.json({ publishCode });
// });

// // POST /generate-subscribe-code
// router.post("/generate-subscribe-code", (req, res) => {
//   const subscribeCode = Math.random()
//     .toString(36)
//     .substring(2, 10)
//     .toUpperCase(); // Generate a random code
//   res.json({ subscribeCode });
// });

// // POST /submit-well-settings
// router.post("/submit-well-settings", (req, res) => {
//   const { macAddress, wellId, publishCode, subscribeCode, parameters } =
//     req.body;

//   // Here you would save these settings to the database
//   res.json({ message: "Well settings submitted successfully" });
// });

// export default router;


// ///routes code 
// import wellRoutes from "./routes/wellRoutes.js";

// app.use("/api/well", wellRoutes);

