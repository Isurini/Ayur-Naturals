import React from 'react';

const PatientDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Patient Dashboard</h2>
      <p>Welcome Patient! You can book appointments and view your health records here.</p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ padding: '10px', marginRight: '10px', borderRadius: '6px', background: '#4caf50', color: 'white', border: 'none' }}>Book Appointment</button>
        <button style={{ padding: '10px', borderRadius: '6px', background: '#2196f3', color: 'white', border: 'none' }}>View Records</button>
      </div>
    </div>
  );
};

export default PatientDashboard;
