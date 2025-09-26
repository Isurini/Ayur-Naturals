// controllers/feedbackController.js
import Feedback from "../models/feedback.js";
import { stringify } from "csv-stringify/sync";
import PDFDocument from "pdfkit";

// Create feedback
export const createFeedback = async (req, res) => {
  try {
    const { feedback_type, rating, comment, relatedTo } = req.body;
    if (!feedback_type || rating === undefined || !comment) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const fb = new Feedback({
      user: req.user._id,
      feedback_type,
      rating,
      comment,
      relatedTo: relatedTo || null,
    });
    await fb.save();
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get feedbacks (optionally filter by type)
export const getFeedbacks = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.feedback_type = type;
    const list = await Feedback.find(filter)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a feedback (author or admin)
export const updateFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });

    // allow admin or owner
    if (req.user.role !== "admin" && fb.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { feedback_type, rating, comment, relatedTo } = req.body;
    if (feedback_type !== undefined) fb.feedback_type = feedback_type;
    if (rating !== undefined) fb.rating = rating;
    if (comment !== undefined) fb.comment = comment;
    if (relatedTo !== undefined) fb.relatedTo = relatedTo;

    await fb.save();
    res.json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a feedback (author or admin)
export const deleteFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });

    // allow admin or owner
    if (req.user.role !== "admin" && fb.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await fb.deleteOne();
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export feedbacks as CSV
export const exportFeedbacksCSV = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.feedback_type = type;
    const list = await Feedback.find(filter).populate("user", "firstName lastName email").sort({ createdAt: -1 });
    const records = list.map(f => ({
      id: f._id.toString(),
      user: f.user?.email || "",
      type: f.feedback_type,
      rating: f.rating,
      comment: f.comment,
      createdAt: f.createdAt.toISOString()
    }));
    const csv = stringify(records, { header: true });
    res.setHeader("Content-Disposition", `attachment; filename=feedbacks${type ? "_" + type : ""}.csv`);
    res.setHeader("Content-Type", "text/csv");
    return res.send(csv);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Export feedbacks as PDF
export const exportFeedbacksPDF = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.feedback_type = type;
    const list = await Feedback.find(filter).populate("user", "firstName lastName email").sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=feedbacks${type ? "_" + type : ""}.pdf`);

    doc.pipe(res);
    doc.fontSize(18).text(`Feedbacks ${type || "all"}`, { align: "center" });
    doc.moveDown();

    list.forEach(f => {
      const userEmail = f.user?.email || "unknown";
      const when = f.createdAt ? new Date(f.createdAt).toISOString() : "";
      doc.fontSize(10).text(`${userEmail} | ${f.feedback_type} | ${f.rating} | ${f.comment} | ${when}`);
      doc.moveDown(0.2);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stats for charts: counts and average rating by type
export const feedbackStats = async (req, res) => {
  try {
    const agg = await Feedback.aggregate([
      { $group: { _id: "$feedback_type", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } }
    ]);
    res.json(agg); // [{_id: 'doctor', count: X, avgRating: Y}, ...]
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Combined report endpoint: query ?format=csv or ?format=pdf (default csv)
export const downloadReport = async (req, res) => {
  const format = (req.query.format || "csv").toLowerCase();
  if (format === "pdf") {
    return exportFeedbacksPDF(req, res);
  } else {
    return exportFeedbacksCSV(req, res);
  }
};
