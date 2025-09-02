import React from 'react';

const DeliveryDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Delivery Staff Dashboard</h2>
      <p>Welcome! You can view delivery assignments and update delivery status here.</p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ padding: '10px', borderRadius: '6px', background: '#ff9800', color: 'white', border: 'none' }}>View Deliveries</button>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
