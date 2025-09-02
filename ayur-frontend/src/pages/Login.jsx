import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth';
import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await axios.post('/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      if (formData.rememberMe) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
      } else {
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        sessionStorage.setItem('token', res.data.token);
      }

      navigate('/dashboard/patient');
    } catch (err) {
      setErrors({ backend: err.response?.data.message || 'Login failed' });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = {
        email: result.user.email,
        firstName: result.user.displayName || 'Google',
        type: 'user'
      };
      const res = await axios.post('/api/users/google-login', user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      navigate('/dashboard/patient');
    } catch (err) {
      setErrors({ backend: 'Google login failed' });
    }
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '32px' }}>Login</h1>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div style={{ marginBottom: '10px' }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '10px' }}>
          <label>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              style={{ flex: 1, padding: '8px 35px 8px 8px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              style={{ position: 'absolute', right: '8px', cursor: 'pointer' }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password}</p>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              style={{ marginRight: '5px' }}
            />
            Remember Me
          </label>
          <span
            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </span>
        </div>

        {errors.backend && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{errors.backend}</p>}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '15px'
          }}
        >
          Login
        </button>
      </form>

      {/* Google login */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button onClick={handleGoogleLogin} style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: '#fff',
          color: '#000',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          <FcGoogle style={{ fontSize: '20px' }} />
          Login with Google
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
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

export default Login;
