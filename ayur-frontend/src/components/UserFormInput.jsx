import React from "react";

const UserFormInput = ({ label, name, type = "text", value, onChange, placeholder, error, inputStyle }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px",
          boxSizing: "border-box",
          ...inputStyle, // 👈 allow overrides if passed
        }}
      />
      {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
    </div>
  );
};

export default UserFormInput;
