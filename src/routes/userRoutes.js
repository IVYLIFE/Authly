import express from "express";
import dotenv from "dotenv";
import { 
    registerUser, 
    loginUser, 
    refreshAccessToken, 
    getUserProfile, 
    updateUserProfile 
} from "../controllers/userControllers.js";

import { protect, verifyUser } from "../middlewares/authMiddleware.js";
import { loginLimiter } from "../middlewares/rateLimitMiddleware.js";

dotenv.config(); 

const userRouter = express.Router();

userRouter.post("/register", registerUser);  // Public
userRouter.post("/login", loginLimiter, loginUser); // Public
userRouter.post("/refresh", refreshAccessToken); // Public

// Protected Profile Routes
userRouter.get("/profile", protect, getUserProfile); // Fetch own profile
userRouter.put("/profile", protect, updateUserProfile); // Update own profile

export default userRouter;
