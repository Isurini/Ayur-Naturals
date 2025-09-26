// routes/feedbackRouter.js
import express from "express";
import {
  createFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
  exportFeedbacksCSV,
  exportFeedbacksPDF,
  downloadReport,
  feedbackStats
} from "../controllers/feedbackController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createFeedback);
router.get("/", protect, getFeedbacks);
router.put("/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);

// stats (for admin dashboard charts) - admin only
router.get("/stats", protect, isAdmin, feedbackStats);

// exports/reports (admin)
router.get("/export/csv", protect, isAdmin, exportFeedbacksCSV);
router.get("/export/pdf", protect, isAdmin, exportFeedbacksPDF);

// combined endpoint allowing ?format=csv|pdf
router.get("/report", protect, isAdmin, downloadReport);

export default router;
