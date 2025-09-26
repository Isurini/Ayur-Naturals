// ayur-frontend/src/pages/UserFeedbackPage.jsx
import React, { useState, useEffect } from "react";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import { getToken } from "../utils/auth";

const UserFeedbackPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Get logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleNew = () => {
    // ✅ Instead of reloading page, just toggle refresh flag
    setRefresh((prev) => !prev);
  };

  if (!getToken() || !user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Please login to give feedback</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Give Feedback</h2>
      <FeedbackForm onSubmitted={handleNew} />

      <hr style={{ margin: "20px 0" }} />

      <h2>My Feedbacks</h2>
      {/* Pass refresh state to re-fetch when new feedback is added */}
      <FeedbackList userId={user._id} refresh={refresh} />
    </div>
  );
};

export default UserFeedbackPage;
