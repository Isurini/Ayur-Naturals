import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();

  let user = null;
  try {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Failed to parse user from storage in ProtectedRoute:", err);
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
