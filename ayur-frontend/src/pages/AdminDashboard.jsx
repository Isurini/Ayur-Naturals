import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! You can manage users, view reports, and control the system.</p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ padding: '10px', marginRight: '10px', borderRadius: '6px', background: '#4caf50', color: 'white', border: 'none' }}>Manage Users</button>
        <button style={{ padding: '10px', borderRadius: '6px', background: '#2196f3', color: 'white', border: 'none' }}>View Reports</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
