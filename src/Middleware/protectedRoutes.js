import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const isManager = (req, res, next) => {
  try {
    const user = req.user;

    if (user.roleInRTMS !== "manager" || user.roleInRTMS !== "owner") {
      return res.json({
        success: false,
        message: "You are not authorised!",
      });
    }

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const isOwner = (req, res, next) => {
  try {
    const user = req.user;

    if (user.roleInRTMS !== "owner") {
      return res.json({
        success: false,
        message: "You are not authorised!",
      });
    }

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
