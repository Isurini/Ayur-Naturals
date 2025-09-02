import React from 'react';

const TherapistDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Therapist Dashboard</h2>
      <p>Welcome Therapist! You can view therapy sessions and patient schedules.</p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ padding: '10px', borderRadius: '6px', background: '#9c27b0', color: 'white', border: 'none' }}>View Sessions</button>
      </div>
    </div>
  );
};

export default TherapistDashboard;
