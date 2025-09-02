import React from 'react';

const DoctorDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Doctor Dashboard</h2>
      <p>Welcome Doctor! You can view appointments and patient records here.</p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ padding: '10px', marginRight: '10px', borderRadius: '6px', background: '#2196f3', color: 'white', border: 'none' }}>View Appointments</button>
        <button style={{ padding: '10px', borderRadius: '6px', background: '#4caf50', color: 'white', border: 'none' }}>Patient Records</button>
      </div>
    </div>
  );
};

export default DoctorDashboard;
