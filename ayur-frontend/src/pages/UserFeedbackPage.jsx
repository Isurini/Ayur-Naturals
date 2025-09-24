// ayur-frontend/src/pages/UserFeedbackPage.jsx
import React from "react";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";

const UserFeedbackPage = () => {
  const handleNew = () => {
    // you might refresh list via a ref or context; simple approach: reload page or use a shared state
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Give Feedback</h2>
      <FeedbackForm onSubmitted={handleNew} />
      <hr />
      <h2>My Feedbacks</h2>
      {/* If your API supports ?user=<id>, pass user prop or rely on token -> backend filters */}
      <FeedbackList filterType={null} />
    </div>
  );
};

export default UserFeedbackPage;
