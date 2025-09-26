// src/pages/FeedbackDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4caf50", "#ff9800", "#f44336"];

const FeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get("/feedback");
        setFeedbacks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeedbacks();
  }, []);

  const groupByCategory = (category) => {
    const data = { good: 0, average: 0, bad: 0 };
    feedbacks
      .filter((f) => f.type === category)
      .forEach((f) => {
        if (f.rating === "good") data.good++;
        if (f.rating === "average") data.average++;
        if (f.rating === "bad") data.bad++;
      });
    return [
      { name: "Good", value: data.good },
      { name: "Average", value: data.average },
      { name: "Bad", value: data.bad },
    ];
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Feedback Report", 14, 10);
    const tableColumn = ["User", "Category", "Rating", "Comment"];
    const tableRows = [];

    feedbacks.forEach((f) => {
      tableRows.push([f.user?.email || "N/A", f.type, f.rating, f.comment]);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("feedback_report.pdf");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Feedback Dashboard</h2>
      <button
        onClick={exportPDF}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Download Monthly Report
      </button>

      <div className="grid grid-cols-3 gap-6">
        {["doctor", "therapist", "system"].map((category, idx) => (
          <div key={idx} className="shadow p-4 rounded bg-white">
            <h3 className="text-lg font-bold mb-2 capitalize">{category}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={groupByCategory(category)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {groupByCategory(category).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackDashboard;
