import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await API.post("/users/verify-otp", { email, otp });
      setMessage(res.data.message || "OTP verified successfully");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 mb-2 rounded" />
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border p-2 mb-2 rounded" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Verify</button>
      </form>
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default VerifyOTP;
