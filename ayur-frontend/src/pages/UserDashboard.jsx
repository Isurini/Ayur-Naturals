// src/pages/UserDashboard.jsx
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4caf50", "#2196f3", "#f44336", "#ff9800"];

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState([]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch monthly signup stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/stats/monthly");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await api.patch(`/users/${id}/status`, { status });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("User Signup Report", 14, 10);
    const tableColumn = ["Name", "Email", "Role", "Status"];
    const tableRows = [];

    users.forEach((u) => {
      tableRows.push([`${u.firstName} ${u.lastName}`, u.email, u.role, u.status]);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("users_report.pdf");
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>

      {/* Search + PDF Export */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={exportPDF}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>

      {/* Users Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id}>
              <td className="border p-2">{u.firstName} {u.lastName}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">{u.status}</td>
              <td className="border p-2">
                {u.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApproval(u._id, "approved")}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(u._id, "rejected")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="signups" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats}
              dataKey="signups"
              nameKey="month"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {stats.map((_, i) => (
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

export default UserDashboard;
