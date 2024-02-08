import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { error } from "console";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mongodb connection
const connectDB = async () => {
  return await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`);
};

connectDB()
  .then(() => {
    console.log("*****Database Connected*****");
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on localhost:3000");
    });
  })
  .catch((error) => {
    console.log("MongoDB Error : ", error);
    process.exit(1);
  });

//  starting express server
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Api handling

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
