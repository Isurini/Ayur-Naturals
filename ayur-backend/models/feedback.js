import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    feedback_type: {
      type: String,
      enum: ["doctor/therapists", "delivery", "system"], // FIXED
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true } // auto creates createdAt, updatedAt
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
