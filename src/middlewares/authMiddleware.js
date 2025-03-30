import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";


dotenv.config();

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    // Fetch user once and attach to req
    const user = await User.findById(decoded.id);
    // const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach the user object to req
    next(); // Proceed to the controller
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" }); // 🔴 THIS IS IMPORTANT!
    }
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};



// Middleware to allow users to only access their own profile
const verifyUser = async (req, res, next) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Forbidden: You can't access this profile" });
  }
  next();
};

export { protect, verifyUser };
