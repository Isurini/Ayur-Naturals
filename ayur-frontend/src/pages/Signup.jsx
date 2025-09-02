import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserFormInput from '../components/UserFormInput';
import { signupSchema } from '../utils/validators';
import { setToken } from '../utils/auth';
import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    terms: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    try {
      signupSchema.parse(formData);

      const user = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      };
      localStorage.setItem('user', JSON.stringify(user));
      setToken('demo-token'); 
      
      switch(formData.role){
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
    const result = await signInWithPopup(auth, googleProvider);
    const user = {
      email: result.user.email,
      firstName: result.user.displayName || 'Google',
      role: 'patient'
    };
    localStorage.setItem('user', JSON.stringify(user));
    setToken('google-demo-token');
    navigate('/dashboard/patient');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Signup</h2>
      <form onSubmit={handleSubmit}>
        <UserFormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
        <UserFormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
        <UserFormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
        <UserFormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
        <UserFormInput label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

        <div style={{ marginBottom: '10px' }}>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
            <option value="patient">Patient</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
          <label> Accept Terms & Conditions</label>
          {errors.terms && <p style={{ color: 'red', fontSize: '12px' }}>{errors.terms}</p>}
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Signup</button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button onClick={handleGoogleLogin} style={{ padding: '10px', background: '#db4437', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Signup with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
