import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import api from "../utils/axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const FeedbackChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/feedbacks");
      const list = res.data;

      const counts = { doctor: 0, delivery: 0, system: 0 };
      const sums = { doctor: 0, delivery: 0, system: 0 };

      list.forEach((f) => {
        counts[f.category] = (counts[f.category] || 0) + 1;
        sums[f.category] = (sums[f.category] || 0) + f.rating;
      });

      const pie = Object.keys(counts).map((k) => ({ name: k, value: counts[k] }));
      const bar = Object.keys(counts).map((k) => ({
        name: k,
        avg: counts[k] ? sums[k] / counts[k] : 0,
      }));

      setData({ pie, bar });
    };
    load();
  }, []);

  if (!data) return <div>Loading charts...</div>;

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <PieChart width={300} height={300}>
        <Pie data={data.pie} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
          {data.pie.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <BarChart width={400} height={300} data={data.bar}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <Bar dataKey="avg">
          {data.bar.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

export default FeedbackChart;
