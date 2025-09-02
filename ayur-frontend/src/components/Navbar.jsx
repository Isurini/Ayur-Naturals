import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav style={{ background: '#4caf50', padding: '10px', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
      <h2>Ayur Naturals</h2>
      <div>
        {user ? (
          <>
            <Link to="/profile" style={{ color: 'white', marginRight: '10px' }}>Profile</Link>
            <button onClick={handleLogout} style={{ background: 'white', color: '#4caf50', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '10px' }}>Login</Link>
            <Link to="/signup" style={{ color: 'white' }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
