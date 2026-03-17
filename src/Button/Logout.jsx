// src/components/Logout.jsx
import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import config from '../config';

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
      `${config.API_BASE_URL}/users/logout`,
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

    navigate('/home');
console.log("this is the error")
  } catch (error) {
    console.error('Logout failed:', error);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLogin(false);

    navigate('/login');
  }
};

  return (
    <>
   
    <button
      onClick={handleLogout}
      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
    >
      <span className="text-lg">🚪</span>
     <span>Logout</span> 
    </button> 
    </>
  );
};

export default Logout;