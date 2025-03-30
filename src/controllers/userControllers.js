import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { generateRefreshToken, generateAccessToken } from "../utils/generateToken.js";

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
    throw new Error("Missing JWT_SECRET or REFRESH_SECRET in environment variables");
}


// Register User
const registerUser = async (req, res) => {
    const { name, email, password, address, bio, profilePicture } = req.body;

    const requiredFields = ['name', 'email', 'password', 'address'];

    // Loop through required fields and check if any are missing
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ message: `Missing required field: ${field}` });
        }
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        address,
        bio,
        profilePicture
    });

    if (user) {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Set refresh token in an HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken, // Access token in response
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user exists with that email" });
        }

        const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Set refresh token in an HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Ensure this is properly set in env
            sameSite: "strict",
        });

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken, // Access token in response
        });

    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


// Refresh Token - Generate a New Access Token
const refreshAccessToken = async (req, res) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const id = decoded.id;

        // Generate a new access token
        const newAccessToken = generateAccessToken(id);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Error verifying refresh token:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
};


// Get Profile
const getUserProfile = async (req, res) => {
    try {
        const user = req.user; // User is already populated by the protect middleware
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Update Profile
const updateUserProfile = async (req, res) => {
    const user = req.user;

    if (user) {
        user.name = req.body.name || user.name;
        user.address = req.body.address || user.address;
        user.bio = req.body.bio || user.bio;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        user.email = req.body.email || user.email;
        let password = req.body?.password.trim();

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();
        res.json({ message: "Profile updated successfully", user: updatedUser });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    getUserProfile,
    updateUserProfile
};
