import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserFormInput from '../components/UserFormInput';
import { setToken } from '../utils/auth';
import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Language toggle
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem('language', e.target.value);
  };

  const handleChange = async e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    // Password strength
    if (name === 'password') {
      if (value.length < 8) setPasswordStrength('Weak');
      else if (/[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value)) setPasswordStrength('Strong');
      else setPasswordStrength('Medium');
    }

    // Real-time email check
    if (name === 'email') {
      try {
        const res = await axios.post('/api/users/check-email', { email: value });
        setEmailExists(res.data.exists);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const validateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.terms) newErrors.terms = 'You must accept terms & conditions';
    if (!validateAge(formData.birthday)) newErrors.birthday = 'You must be at least 18 years old';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (emailExists) newErrors.email = 'Email is already registered';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await axios.post('/api/users/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        birthday: formData.birthday,
        password: formData.password
      });

      alert(res.data.message); // Backend success message
      navigate('/login');
    } catch (err) {
      console.log(err.response?.data);
      setErrors({ backend: err.response?.data.message || 'Signup failed' });
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
      localStorage.setItem('user', JSON.stringify(user));
      setToken('google-demo-token');
      navigate('/dashboard/patient');
    } catch (err) {
      console.log(err);
      setErrors({ backend: 'Google login failed' });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px',
      background: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#000' : '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Signup</h2>

      {/* Theme & Language */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <button onClick={toggleTheme}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</button>
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="si">Sinhala</option>
          <option value="ta">Tamil</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <UserFormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
        <UserFormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
        <UserFormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
        <UserFormInput label="Birthday" name="birthday" type="date" value={formData.birthday} onChange={handleChange} error={errors.birthday} />
        <UserFormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
        {passwordStrength && <p>Password Strength: {passwordStrength}</p>}
        <UserFormInput label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

        <div style={{ marginBottom: '10px' }}>
          <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
          <label> Accept Terms & Conditions</label>
          {errors.terms && <p style={{ color: 'red', fontSize: '12px' }}>{errors.terms}</p>}
        </div>

        {errors.backend && <p style={{ color: 'red', fontSize: '12px' }}>{errors.backend}</p>}

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Signup</button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button onClick={handleGoogleLogin} style={{ padding: '10px', background: '#db4437', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Signup with Google
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Already have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
      </p>
    </div>
  );
};

export default Signup;
