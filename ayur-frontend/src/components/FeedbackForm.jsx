import React, { useState, useEffect, useRef } from "react";
import api from "../utils/axios";

const FeedbackForm = ({ onSubmitted }) => {
  const [category, setCategory] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // fetch feedbacks
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/feedbacks");
        setFeedbacks(res.data.slice(-10));
      } catch (err) {
        console.error("Failed to load feedbacks:", err);
      }
    };
    load();
  }, []);

  // fetch doctors
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to load doctors:", err);
      }
    };
    load();
  }, []);

  // autoscroll
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const startScroll = () => {
      intervalRef.current = setInterval(() => {
        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainer.scrollBy({ left: 220, behavior: "smooth" });
        }
      }, 3000);
    };
    if (!paused) startScroll();
    return () => clearInterval(intervalRef.current);
  }, [feedbacks, paused]);

  // submit feedback
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!category) return setError("Please select a type");
    if (category === "doctor" && !doctorId)
      return setError("Please select a doctor");
    if (message.trim().length < 10)
      return setError("Feedback must be at least 10 characters");

    setLoading(true);
    try {
      const res = await api.post("/feedbacks", {
        category,
        doctorId,
        rating,
        message,
      });
      setMessage("");
      setRating(5);
      setCategory("");
      setDoctorId("");
      setFeedbacks((prev) => [...prev, res.data]);
      onSubmitted && onSubmitted(res.data);
    } catch (err) {
      setError(err.response?.data.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Share Your Feedback</h2>
      <h3>Recent Feedbacks</h3>
      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "15px",
          padding: "10px 0",
          marginBottom: "30px",
        }}
      >
        {feedbacks.length === 0 && <p>No feedbacks yet.</p>}
        {feedbacks.map((fb, i) => (
          <div
            key={i}
            style={{
              minWidth: "220px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <strong>{fb.category?.toUpperCase()}</strong>
            <div style={{ color: "#FFD700" }}>
              {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
            </div>
            <p>{fb.message}</p>
          </div>
        ))}
      </div>

      {/* form */}
      <form onSubmit={submit}>
        <label>Type</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        >
          <option value="">-- Select Type --</option>
          <option value="doctor">Doctor / Therapist</option>
          <option value="delivery">Delivery</option>
          <option value="system">System</option>
        </select>

        {category === "doctor" && (
          <>
            <label>Doctor/Therapist</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              style={{ display: "block", marginBottom: 10 }}
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </>
        )}

        <label>Rating</label>
        <div style={{ fontSize: "20px", marginBottom: 10 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              onClick={() => setRating(s)}
              style={{ cursor: "pointer", color: s <= rating ? "#FFD700" : "#ccc" }}
            >
              ★
            </span>
          ))}
        </div>

        <label>Message</label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button disabled={loading} type="submit">
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
