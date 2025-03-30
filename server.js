import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";


import connectDB from "./src/config/db.js";
import userRouter  from './src/routes/userRoutes.js';
import errorHandler from "./src/middlewares/errorMiddleware.js";


dotenv.config();
const allowedOrigins = process.env.CLIENT_URLS.split(",");

connectDB();
const app = express();

app.use(express.json());
app.use(helmet()); // Security headers
app.use(cookieParser()); // Parse secure cookies
app.use(morgan("dev"));
app.use(errorHandler);
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.trim())) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use("/api/users", userRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

