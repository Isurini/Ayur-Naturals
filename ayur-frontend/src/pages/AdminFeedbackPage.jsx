import React, { useState } from "react";
import FeedbackList from "../components/FeedbackList";
import FeedbackChart from "../components/FeedbackChart";
import api from "../utils/axios";


const AdminFeedbackPage = () => {
  const [tab, setTab] = useState("doctor"); // 'doctor' | 'delivery' | 'system' | 'all'

  const downloadCSV = async (type) => {
    try {
      const q = type ? `?type=${type}` : "";
      const res = await api.get(`/feedbacks/report${q}`, { responseType: "blob" });

      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `feedbacks${type ? "_" + type : ""}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download report", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Feedback Dashboard</h2>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setTab("doctor")}>Doctor</button>
        <button onClick={() => setTab("delivery")}>Delivery</button>
        <button onClick={() => setTab("system")}>System</button>
        <button onClick={() => setTab("all")}>All</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => downloadCSV(tab === "all" ? "" : tab)}>Download CSV</button>
      </div>

      <div style={{ marginTop: 18 }}>
        <FeedbackList filterType={tab === "all" ? null : tab} />
      </div>

      <hr />
      <FeedbackChart />
    </div>
  );
};

export default AdminFeedbackPage;
