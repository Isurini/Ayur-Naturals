import React, { useState, useEffect, useRef } from "react";

const FeedbackForm = ({ onSubmitted }) => {
  const [category, setCategory] = useState(""); // default = none selected
  const [doctorId, setDoctorId] = useState(""); // selected doctor/therapist
  const [doctors, setDoctors] = useState([]); // list of doctors/therapists
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // 🔹 Fetch recent feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/feedbacks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setFeedbacks(data.slice(-10)); // last 10 feedbacks
        }
      } catch (err) {
        console.error("Failed to load feedbacks:", err);
      }
    };
    fetchFeedbacks();
  }, []);

  // 🔹 Fetch doctors/therapists
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setDoctors(data);
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // 🔹 Auto-scroll effect (pause on hover)
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

  // 🔹 Submit feedback
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!category) {
      setError("Please select a feedback type.");
      return;
    }

    if (category === "doctor" && !doctorId) {
      setError("Please select a doctor/therapist.");
      return;
    }

    if (message.trim().length < 10) {
      setError("Feedback must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, doctorId, rating, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit feedback");

      // reset form
      setMessage("");
      setRating(5);
      setCategory("");
      setDoctorId("");

      // update list
      setFeedbacks((prev) => [...prev, data]);
      onSubmitted && onSubmitted(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      {/* Title */}
      <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#333" }}>
        Share Your Feedback
      </h2>
      <p style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
        Read what others said and leave your thoughts!
      </p>

      {/* 🔹 Auto-scrolling Recent Feedbacks */}
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
          scrollBehavior: "smooth",
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
              flexShrink: 0,
            }}
          >
            <strong>{fb.category?.toUpperCase()}</strong>
            <div style={{ color: "#FFD700" }}>
              {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
            </div>
            <p style={{ fontStyle: "italic" }}>
              {fb.message.length > 80
                ? fb.message.slice(0, 80) + "..."
                : fb.message}
            </p>
          </div>
        ))}
      </div>

      {/* 🔹 Feedback Form */}
      <h3>Leave Your Feedback</h3>
      <form onSubmit={submit} style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Category */}
        <div style={{ marginBottom: "15px" }}>
          <label>Feedback Type</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              display: "block",
              marginTop: "5px",
              padding: "8px",
              width: "100%",
            }}
          >
            <option value="">-- Select Type --</option>
            <option value="doctor">Doctor / Therapist</option>
            <option value="delivery">Delivery</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Doctor Dropdown (only if doctor is selected) */}
        {category === "doctor" && (
          <div style={{ marginBottom: "15px" }}>
            <label>Select Doctor / Therapist</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              style={{
                display: "block",
                marginTop: "5px",
                padding: "8px",
                width: "100%",
              }}
            >
              <option value="">-- Choose a Doctor/Therapist --</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Star Rating */}
        <div style={{ marginBottom: "15px" }}>
          <label>Rating</label>
          <div
            style={{ fontSize: "24px", cursor: "pointer", color: "#FFD700" }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  marginRight: "5px",
                  color: star <= rating ? "#FFD700" : "#ccc",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Message */}
        <div style={{ marginBottom: "15px" }}>
          <label>Your Feedback</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Write your feedback here..."
            style={{
              display: "block",
              marginTop: "5px",
              padding: "10px",
              width: "100%",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#4caf50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
