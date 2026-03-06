// src/components/layout/Header.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logout from '../Button/Logout';

const Header = () => {
  const { isLogin, user, logout, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false); // unified for mobile & offcanvas

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex-shrink-0">
              { !isLogin ?
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-indigo-600">Job</span>
                <span className="text-2xl font-bold text-gray-900">Hub</span>
              </Link> : <Link to="/dashboard" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-indigo-600">Job</span>
                <span className="text-2xl font-bold text-gray-900">Hub</span>
              </Link> 
             }
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-10">
              <Link to="/jobs" className="text-gray-700 hover:text-indigo-600 font-medium">
                Find Jobs
              </Link>
              <Link to="/companies" className="text-gray-700 hover:text-indigo-600 font-medium">
                Companies
              </Link>
            </nav>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center space-x-6">
              {isLogin ? (
                <>
                
                  {/* User Avatar / Menu Trigger */}
                  <button
                    onClick={() => setIsMenuOpen(true)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="User"
                        className="h-9 w-9 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium text-sm">
                        {getInitials(user?.fullName)}
                      </div>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition"
                  title="Menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offcanvas / Mobile Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
  onClick={() => setIsMenuOpen(false)}
/>

          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {isLogin ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 py-3 px-4 bg-gray-50 rounded-lg">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="User"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium text-lg">
                        {getInitials(user?.fullName)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{user?.fullName || 'User'}</p>
                      <p className="text-sm text-gray-500">{user?.email || ''}</p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-200 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>

                   {
                    role === "admin" || "recruiter" ? <Link
                    to="/add-company"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-200 rounded-lg transition"
                  >
                    See Company
                  </Link>: <Link
                    to="/add-company"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-200 rounded-lg transition"
                  >
                   Add Company
                  </Link>

                  }
                  

                  <Link
                    to="/setting"
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-200 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>



                   {
                    role === "admin" || "recruiter" ? <Link
                    to="/post-job"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-200 rounded-lg transition"
                  >
                    Job
                  </Link>: <Link
                    to="/post-job"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-200 rounded-lg transition"
                  >
                  Post a Jobs
                  </Link>

                  }

                  
                 
                  <div className="border-t border-gray-200 my-3"></div>
                  

                  {/* <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                  >
                    Log Out
                  </button> */}
                  <Logout/>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-5 py-3.5 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700 transition font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    className="block px-5 py-3.5 border border-indigo-600 text-indigo-600 rounded-lg text-center hover:bg-indigo-50 transition font-medium mt-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;