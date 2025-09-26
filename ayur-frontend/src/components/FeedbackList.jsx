import React, { useEffect, useState } from "react";
import api from "../utils/axios";

const FeedbackList = ({ filterType }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/feedbacks${filterType ? "?category=" + filterType : ""}`);
      setItems(res.data);
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
    if (!window.confirm("Delete this feedback?")) return;
    await api.delete(`/feedbacks/${id}`);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div>
      <h3>Feedbacks {filterType ? `- ${filterType}` : ""}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No feedbacks yet</p>
      ) : (
        <ul>
          {items.map((f) => (
            <li key={f._id} style={{ border: "1px solid #ddd", padding: 8, margin: 6 }}>
              <strong>{f.category}</strong> | Rating: {f.rating}
              <p>{f.message}</p>
              <small>{new Date(f.createdAt).toLocaleString()}</small>
              <br />
              <button onClick={() => handleDelete(f._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackList;
