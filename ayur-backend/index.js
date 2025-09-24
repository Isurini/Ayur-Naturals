import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import feedbackRoutes from "./routes/feedbackRouter.js";

// Load environment variables
dotenv.config();
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {})
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Database Connected");
});

app.use(bodyParser.json());
//Routes
app.use("/api/users", userRouter);
app.use("/api/feedbacks", feedbackRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
