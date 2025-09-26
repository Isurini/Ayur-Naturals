import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Safely parse user
  let user = null;
  try {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
    user = JSON.parse(storedUser);
  }
 } catch (err) {
    console.error("Failed to parse user from storage:", err);
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login'); // ✅ better than window.location.href
  };

  return (
    <nav
      style={{
        background: '#4caf50',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <h2>Ayur Naturals</h2>
      <div>
        {user ? (
          <>
            <Link to="/profile" style={{ color: 'white', marginRight: '10px' }}>
              Profile
            </Link>

            {/* ✅ Show Feedback link for patient users */}
            {user.role === 'patient' && (
              <Link to="/feedback" style={{ color: 'white', marginRight: '10px' }}>
                Feedback
              </Link>
            )}

            {/* ✅ Show Admin Feedback Dashboard link for admins */}
            {user.role === 'admin' && (
              <Link to="/admin/feedbacks" style={{ color: 'white', marginRight: '10px' }}>
                Admin Feedbacks
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                background: 'white',
                color: '#4caf50',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '10px' }}>
              Login
            </Link>
            <Link to="/signup" style={{ color: 'white' }}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
