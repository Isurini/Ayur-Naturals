// ayur-frontend/src/components/FeedbackList.jsx
import React, { useEffect, useState } from "react";

const FeedbackList = ({ userId, filterType }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const query = filterType ? `?type=${filterType}` : "";
    try {
      // If you want only user's feedback, pass user query: ?user=<id>
      const res = await fetch(`/api/feedbacks${query}`, { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [filterType]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this feedback?")) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/feedbacks/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }});
    setItems(items.filter(i => i._id !== id));
  };

  return (
    <div>
      <h3>Feedbacks {filterType ? `- ${filterType}` : ""}</h3>
      {loading ? <div>Loading...</div> : (
        <div>
          {items.length === 0 && <div>No feedbacks yet.</div>}
          <ul>
            {items.map(it => (
              <li key={it._id} style={{ border: "1px solid #ddd", margin: 8, padding: 8 }}>
                <div><strong>User:</strong> {it.user?.name ?? "Unknown"}</div>
                <div><strong>Type:</strong> {it.feedback_type}</div>
                <div><strong>Rating:</strong> {it.rating}</div>
                <div><strong>Comment:</strong> {it.comment}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{new Date(it.createdAt).toLocaleString()}</div>
                {/* Only allow edit/delete if owner or admin. For demo, show delete */}
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => handleDelete(it._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
