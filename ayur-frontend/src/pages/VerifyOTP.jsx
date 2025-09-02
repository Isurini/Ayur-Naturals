import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !otp) {
      setError('Email and OTP are required');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/users/verify-otp', { email, otp });
      setSuccess(res.data.message || 'OTP verified successfully');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
    } catch (err) {
      setError(err.response?.data.message || 'OTP verification failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      borderRadius: '10px',
      background: '#fff',
      color: '#000'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '28px' }}>Verify OTP</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <label>OTP</label>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
        {success && <p style={{ color: 'green', fontSize: '13px' }}>{success}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#4caf50', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
