// ayur-backend/controllers/feedbackController.js
import Feedback from "../models/feedback.js";
import User from "../models/user.js"; // optional if you want populated user names

// Create feedback
export const createFeedback = async (req, res) => {
  try {
    const { feedback_type, rating, comment } = req.body;
    const userId = req.user._id; // set by auth middleware

    if (!feedback_type || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fb = new Feedback({
      user: userId,
      feedback_type,
      rating,
      comment
    });

    await fb.save();
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get feedbacks (optionally filter by type, or by user)
export const getFeedbacks = async (req, res) => {
  try {
    const { type, user } = req.query;
    const filter = {};
    if (type) filter.feedback_type = type;
    if (user) filter.user = user;

    const feedbacks = await Feedback.find(filter).populate("user", "name email").sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update feedback (only owner or admin -- auth middleware should set req.user.isAdmin)
export const updateFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });

    // only owner or admin
    if (!req.user.isAdmin && fb.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { feedback_type, rating, comment } = req.body;
    if (feedback_type) fb.feedback_type = feedback_type;
    if (rating) fb.rating = rating;
    if (comment) fb.comment = comment;

    await fb.save();
    res.json(fb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete feedback (owner or admin)
export const deleteFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });

    if (!req.user.isAdmin && fb.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await fb.remove();
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Simple CSV report by type
export const downloadReport = async (req, res) => {
  try {
    const { type } = req.query; // doctor/delivery/system or undefined for all
    const filter = {};
    if (type) filter.feedback_type = type;

    const feedbacks = await Feedback.find(filter).populate("user", "name email").sort({ createdAt: -1 });

    // Build CSV
    const header = ["id", "userName", "userEmail", "type", "rating", "comment", "createdAt"];
    const rows = feedbacks.map(f => [
      f._id,
      f.user?.name ?? "",
      f.user?.email ?? "",
      f.feedback_type,
      f.rating,
      `"${(f.comment || "").replace(/"/g, '""')}"`,
      f.createdAt.toISOString()
    ]);

    const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");

    res.setHeader("Content-Disposition", `attachment; filename=feedbacks${type ? "_" + type : ""}.csv`);
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
