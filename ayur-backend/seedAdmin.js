// scripts/seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/user.js";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/ayurdb";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB for seeding...");

    const adminEmail = "admin@example.com";
    const adminPassword = "Admin@123";

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log("Admin already exists:", adminEmail);
      process.exit(0);
    }

    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "Admin@123",   // ✅ Change after first login
      role: "admin",
      status: "approved",
      contactNumber: "0000000000", // ✅ Required field
    });

    await admin.save();
    console.log("Admin created:", adminEmail, "/", adminPassword);
    process.exit(0);
  } catch (err) {
    console.error("Seed admin error:", err);
    process.exit(1);
  }
};

createAdmin();
