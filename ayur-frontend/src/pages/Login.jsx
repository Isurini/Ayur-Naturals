import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserFormInput from '../components/UserFormInput';
import { loginSchema } from '../utils/validators';
import { setToken } from '../utils/auth';
import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    try {
      loginSchema.parse(formData);

      // Check localStorage for user
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || storedUser.email !== formData.email) {
        setErrors({ email: 'User not found' });
        return;
      }

      // Demo password check (replace with backend check in real app)
      if (formData.password !== 'demo-token' && formData.password !== 'google-demo-token') {
        setErrors({ password: 'Incorrect password' });
        return;
      }

      // Login success
      setToken(formData.password);
      localStorage.setItem('user', JSON.stringify(storedUser));

      // Redirect based on role
      switch (storedUser.role) {
        case 'admin': navigate('/dashboard/admin'); break;
        case 'delivery': navigate('/dashboard/delivery'); break;
        case 'doctor': navigate('/dashboard/doctor'); break;
        case 'therapist': navigate('/dashboard/therapist'); break;
        case 'patient': navigate('/dashboard/patient'); break;
        case 'customer': navigate('/dashboard/customer'); break;
        default: navigate('/');
      }

    } catch (err) {
      const zodErrors = err.formErrors?.fieldErrors || {};
      setErrors(zodErrors);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = {
        email: result.user.email,
        firstName: result.user.displayName || 'Google',
        role: 'patient' // default role for Google login
      };
      localStorage.setItem('user', JSON.stringify(user));
      setToken('google-demo-token');
      navigate('/dashboard/patient');
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <UserFormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
        <UserFormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Login</button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button onClick={handleGoogleLogin} style={{ padding: '10px', background: '#db4437', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Login with Google
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Forgot password? <a href="/signup">Reset here</a>
      </p>
    </div>
  );
};

export default Login;
