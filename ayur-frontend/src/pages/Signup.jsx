import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserFormInput from '../components/UserFormInput';
import { setToken } from '../utils/auth';
import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle } from 'react-icons/ai';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    password: '',
    confirmPassword: '',
    phone: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePhoneChange = value => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.terms) newErrors.terms = 'You must accept terms & conditions';
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await axios.post('/api/users/signup', formData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
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
      setErrors({ backend: 'Google login failed' });
    }
  };

  const getPasswordStrength = password => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return { label: 'Weak', color: 'red' };
    if (strength === 2 || strength === 3) return { label: 'Medium', color: 'orange' };
    if (strength === 4) return { label: 'Strong', color: 'green' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px', background: '#fff', color: '#000' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '32px' }}>Signup</h1>

      <form onSubmit={handleSubmit}>
        <UserFormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" error={errors.firstName}/>
        <UserFormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Perera" error={errors.lastName} />
        <UserFormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" error={errors.email}  />
        <UserFormInput label="Birthday" name="birthday" type="date" value={formData.birthday} onChange={handleChange} error={errors.birthday} placeholder="YYYY-MM-DD" />

        {/* Phone Number */}
        <div style={{ marginBottom: '10px' }}>
          <label>Contact Number</label>
          <PhoneInput
            country={'us'}
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            inputStyle={{ width: '100%' }}
            buttonStyle={{ borderRadius: '6px 0 0 6px' }}
          />
          {errors.phone && <p style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</p>}
        </div>

        {/* Password with warning box */}
        <div style={{ marginBottom: '10px' }}>
          <label>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              placeholder="MySecret123!"
              style={{ flex: 1, padding: '8px 35px 8px 8px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <span onClick={() => setShowPassword(prev => !prev)} style={{ position: 'absolute', right: '8px', cursor: 'pointer' }}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {passwordFocus && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginTop: '6px',
              padding: '10px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeeba',
              borderRadius: '4px',
              color: '#856404',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                <AiOutlineExclamationCircle style={{ fontSize: '16px', color: '#856404' }} />
                <span>Warning!</span>
              </div>
              <span>Must be at least 8 characters, include uppercase, lowercase, number, and symbol.</span>
            </div>
          )}

          {formData.password && (
            <div style={{ marginTop: '5px', fontWeight: 'bold', color: passwordStrength.color }}>
              Strength: {passwordStrength.label}
            </div>
          )}
          {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '10px' }}>
          <label>Confirm Password</label>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="MySecret123!"
              style={{ flex: 1, padding: '8px 35px 8px 8px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <span onClick={() => setShowConfirmPassword(prev => !prev)} style={{ position: 'absolute', right: '8px', cursor: 'pointer' }}>
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.confirmPassword && <p style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</p>}
        </div>

        {/* Terms & Conditions */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px 0' }}>
          <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} style={{ marginRight: '8px' }} />
          <label>
            Accept{' '}
            <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/terms')}>
              Terms & Conditions
            </span>
          </label>
        </div>
        {errors.terms && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{errors.terms}</p>}
        {errors.backend && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{errors.backend}</p>}

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', marginBottom: '15px' }}>
          Signup
        </button>
      </form>

      {/* Google login button */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button onClick={handleGoogleLogin} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', color: '#000', cursor: 'pointer', fontSize: '16px' }}>
          <FcGoogle style={{ fontSize: '20px' }} />
          Signup with Google
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <span style={{ color: 'blue',textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
      </p>
    </div>
  );
};

export default Signup;
