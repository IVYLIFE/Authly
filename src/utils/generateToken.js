import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); 

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" }); // Shorter expiry
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: "7d" }); // Long expiry
};

export { generateAccessToken, generateRefreshToken };
