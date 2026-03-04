// src/components/Logout.jsx
import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Logout = () => {
  const navigate = useNavigate();

  const {setIsLogin} = useContext(AuthContext)

  const token = localStorage.getItem("token")
  const handleLogout = async () => {

  const confirmLogout = window.confirm("Are you sure you want to logout?");

  if (!confirmLogout) {
    return; // Stop if user clicks Cancel
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/users/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );

    console.log("this is logout respons", response)

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLogin(false);

    navigate('/login');

  } catch (error) {
    console.error('Logout failed:', error);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLogin(false);

    navigate('/login');
  }
};

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Logout
    </button>
  );
};

export default Logout;