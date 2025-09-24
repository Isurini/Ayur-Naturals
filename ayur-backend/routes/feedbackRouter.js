import express from "express";
import {
  createFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
  downloadReport
} from "../controllers/feedbackController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createFeedback);
router.get("/", protect, getFeedbacks);
router.put("/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);

// Admin only
router.get("/report", protect, isAdmin, downloadReport);

export default router;
