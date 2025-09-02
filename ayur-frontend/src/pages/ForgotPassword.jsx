import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Call backend API to send OTP
      const res = await axios.post('/api/users/forgot-password', { email });
      setSuccess(res.data.message || 'OTP sent to your email');
      setEmail('');
    } catch (err) {
      setError(err.response?.data.message || 'Failed to send OTP');
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '28px' }}>
        Forgot Password
      </h1>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          placeholder="example@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#856404',
            backgroundColor: '#fff3cd',
            padding: '8px',
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            <AiOutlineExclamationCircle />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={{
            color: '#155724',
            backgroundColor: '#d4edda',
            padding: '8px',
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            {success}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Remember your password?{' '}
        <span
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() => navigate('/login')}
        >
          Login
        </span>
      </p>

      <p style={{ textAlign: 'center', marginTop: '5px' }}>
        Don't have an account?{' '}
        <span
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() => navigate('/signup')}
        >
          Signup
        </span>
      </p>
    </div>
  );
};

export default ForgotPassword;
