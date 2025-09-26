// ayur-backend/models/feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  feedback_type: {
    type: String,
    enum: ["doctor", "therapist", "delivery", "system"],
    required: true
  },
  relatedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // optional: doctor id
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
