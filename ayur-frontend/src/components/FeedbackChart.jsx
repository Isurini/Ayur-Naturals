// ayur-frontend/src/components/FeedbackChart.jsx
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const FeedbackChart = () => {
  const [data, setData] = useState(null);

  async function fetchData() {
    const token = localStorage.getItem("token");
    const resAll = await fetch("/api/feedbacks", { headers: { Authorization: `Bearer ${token}` }});
    const list = await resAll.json();

    // count by type
    const counts = { doctor: 0, delivery: 0, system: 0 };
    const ratingSums = { doctor: 0, delivery: 0, system: 0 };

    for (const f of list) {
      counts[f.feedback_type] = (counts[f.feedback_type] || 0) + 1;
      ratingSums[f.feedback_type] = (ratingSums[f.feedback_type] || 0) + (f.rating || 0);
    }

    const pie = [
      { name: "Doctor", value: counts.doctor },
      { name: "Delivery", value: counts.delivery },
      { name: "System", value: counts.system },
    ];

    const bar = [
      { name: "Doctor", avg: counts.doctor ? ratingSums.doctor / counts.doctor : 0 },
      { name: "Delivery", avg: counts.delivery ? ratingSums.delivery / counts.delivery : 0 },
      { name: "System", avg: counts.system ? ratingSums.system / counts.system : 0 },
    ];

    setData({ pie, bar });
  }

  useEffect(() => { fetchData(); }, []);

  if (!data) return <div>Loading charts...</div>;

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <div>
        <h4>Feedback distribution</h4>
        <PieChart width={300} height={300}>
          <Pie dataKey="value" data={data.pie} cx="50%" cy="50%" outerRadius={90} label>
            {data.pie.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <div>
        <h4>Average rating by type</h4>
        <BarChart width={400} height={300} data={data.bar}>
          <XAxis dataKey="name" />
          <YAxis domain={[0,5]} />
          <Tooltip />
          <Bar dataKey="avg" barSize={50}>
            {data.bar.map((entry, index) => <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default FeedbackChart;
