import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle } from 'react-icons/ai';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw) => {
    return pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Both fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 chars, include uppercase, number, and symbol');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/users/reset-password', { email, password });
      setSuccess(res.data.message || 'Password reset successful');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data.message || 'Password reset failed');
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '28px' }}>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        {/* Password */}
        <label>New Password</label>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px 35px 10px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer' }}>
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <label>Confirm Password</label>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '10px 35px 10px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer' }}>
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '8px', borderRadius: '4px', marginBottom: '10px' }}>
            <AiOutlineExclamationCircle />
            <span>{error}</span>
          </div>
        )}
        {success && <p style={{ color: 'green', fontSize: '13px', marginBottom: '10px' }}>{success}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#4caf50', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
