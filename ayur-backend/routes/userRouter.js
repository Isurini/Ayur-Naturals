import express from "express";
import {
  signup,
  login,
  createStaff,
  listUsers,
  updateUserStatus,
  deleteUser,
  exportUsersPDF,
  getProfile,
  updateProfile,
  getMonthlyStats,
  requestDeleteAccount,
  listDeletionRequests,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===== Auth =====
router.post("/signup", signup);
router.post("/login", login);

// ===== Profile =====
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/request-delete", protect, requestDeleteAccount);

// ===== Users (Admin only) =====
router.get("/", protect, isAdmin, listUsers);
router.patch("/:id/status", protect, isAdmin, updateUserStatus);
router.delete("/:id", protect, isAdmin, deleteUser);
router.get("/export/pdf", protect, isAdmin, exportUsersPDF);

// ===== Stats (Admin only) =====
router.get("/stats/monthly", protect, isAdmin, getMonthlyStats);

// ===== Staff (Admin only) =====
router.post("/staff", protect, isAdmin, createStaff);

// ===== Deletion Requests (Admin only) =====
router.get("/deletion-requests", protect, isAdmin, listDeletionRequests);

export default router;
