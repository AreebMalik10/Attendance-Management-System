import React from 'react';
import './css/homepage.css';
import { useNavigate } from 'react-router-dom';

export default function Homepage({ setLoginUser }) {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    setLoginUser(null); // Clear user state
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className='centered-container'>
      <h1>Homepage</h1>
      <div className='button' onClick={handleLogout}>Logout</div>
    </div>
  );
}
