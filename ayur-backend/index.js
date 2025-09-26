// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import feedbackRoutes from "./routes/feedbackRouter.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/ayurdb";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/users", userRouter);
app.use("/api/feedbacks", feedbackRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
