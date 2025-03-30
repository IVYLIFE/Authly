import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); 

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // No callbacks, use async/await
    console.log(`✅ Connected to MongoDB`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit if connection fails
  }
};

// Export the connectDB function
export default connectDB;
