// src/pages/StaffDashboard.jsx
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

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

const StaffDashboard = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get("/staff");
        setStaff(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStaff();
  }, []);

  // Delete staff
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/staff/${id}`);
      setStaff((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Staff Report", 14, 10);
    const tableColumn = ["Name", "Email", "Role"];
    const tableRows = [];

    staff.forEach((s) => {
      tableRows.push([s.name, s.email, s.role]);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("staff_report.pdf");
  };

  // Role distribution for chart
  const roleStats = () => {
    const counts = {};
    staff.forEach((s) => {
      counts[s.role] = (counts[s.role] || 0) + 1;
    });
    return Object.keys(counts).map((role) => ({
      name: role,
      value: counts[role],
    }));
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Staff Dashboard</h2>

      {/* Top bar: search + buttons */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />

        <div className="space-x-2">
          <a
            href="/admin/staff-registration"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Register Staff
          </a>
          <button
            onClick={exportPDF}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((s) => (
            <tr key={s._id}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2">{s.role}</td>
              <td className="border p-2">
                <button
                  onClick={() =>
                    (window.location.href = `/admin/staff-edit/${s._id}`)
                  }
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Role Distribution Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">Staff Role Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={roleStats()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {roleStats().map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffDashboard;
