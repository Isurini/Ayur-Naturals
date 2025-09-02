import React from 'react';

const CustomerDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Customer Dashboard</h2>
      <p>Welcome Customer! You can browse and purchase herbal products here.</p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ padding: '10px', borderRadius: '6px', background: '#ff5722', color: 'white', border: 'none' }}>Browse Products</button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
