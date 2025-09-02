import React from 'react';

const UserFormInput = ({ label, type="text", name, value, onChange,placeholder, error }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <label>{label} </label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        placeholder={placeholder} 
        onChange={onChange} 
        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} 
      />
      {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
    </div>
  );
};

export default UserFormInput;
