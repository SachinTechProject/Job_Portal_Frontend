// src/components/layout/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logout from '../Button/Logout';

const Header = () => { 
  const { isLogin, user, logout, role, userName } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // const handleLogout = () => {
  //   logout();
  //   navigate('/');
  //   setIsMenuOpen(false);
  //   setIsProfileMenuOpen(false);
  // };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getHomeRoute = () => {
    if (!isLogin) return "/";
    if (role === "admin") return "/admin";
    return "/dashboard";
  };

  // Navigation items based on role
  const getNavItems = () => {
    const items = [
      { name: 'Find Jobs', path: '/jobs', icon: '💼' },
      { name: 'Companies', path: '/companies', icon: '🏢' },
      { name: 'Help Desk', path: '/chat', icon: '💬' }
    ];

    if (role === 'admin') {
      items.push(
        { name: 'Add Company', path: '/add-company', icon: '➕' },
        { name: 'Post Job', path: '/post-job', icon: '📝' }
      );
    }

    if (role === 'recruiter') {
      items.push({ name: 'My Companies', path: '/companies', icon: '🏢' });
    }

    return items;
  };

  const navItems = getNavItems();

  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md' 
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo - Always visible */}
            <div className="flex-shrink-0">
              <Link to={getHomeRoute()} className="flex items-center  group">
                <span className="text-2xl lg:text-3xl font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                  Career
                </span>
                <span className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                  Mitra
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Visible on large screens */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLogin ? (
                <div className="relative">
                  {/* User Menu Button */}
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 focus:outline-none group"
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="User"
                        className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-indigo-300 transition-all"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-medium text-sm group-hover:shadow-md transition-all">
                        {getInitials(user?.fullName || user?.name || userName)}
                      </div>
                    )}
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-medium text-gray-700">{user?.fullName || user?.name || userName || 'User'}</p>
                      <p className="text-xs text-gray-500">{role || 'User'}</p>
                    </div>
                    <svg 
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.name || userName}</p>
                          <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <span className="text-lg">👤</span>
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          to="/myResume"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <span className="text-lg">📄</span>
                          <span>My Resume</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <span className="text-lg">⚙️</span>
                          <span>Settings</span>
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <button>
                             <Logout/>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Slide Down Panel */}
      <div 
        className={`lg:hidden fixed inset-x-0 top-16 bg-white shadow-xl z-40 transform transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* User Info Section - Only when logged in */}
          {isLogin && (
            <div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
              <div className="flex items-center space-x-4">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="User"
                    className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {getInitials(user?.fullName || user?.name || userName)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{user?.fullName || user?.name || userName}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                    {role || 'User'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {isActive(item.path) && (
                  <span className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></span>
                )}
              </Link>
            ))}

            {/* Additional Mobile Menu Items */}
            {isLogin ? (
              <>
                <div className="border-t border-gray-200 my-3"></div>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">👤</span>
                  <span className="font-medium">My Profile</span>
                </Link>
                
                <Link
                  to="/myResume"
                  className="flex items-center space-x-3 px-4 py-3.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">📄</span>
                  <span className="font-medium">My Resume</span>
                </Link>
                
                <Link
                  to="/settings"
                  className="flex items-center space-x-3 px-4 py-3.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">⚙️</span>
                  <span className="font-medium">Settings</span>
                </Link>
                
                <div className="border-t border-gray-200 my-3"></div>
                
                <button
             >
                 <Logout/>
                </button>
              </>
            ) : (
              <div className="mt-6 space-y-3 p-4">
                <Link
                  to="/login"
                  className="block w-full px-5 py-3.5 bg-indigo-600 text-white text-center font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-5 py-3.5 border-2 border-indigo-600 text-indigo-600 text-center font-medium rounded-xl hover:bg-indigo-50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;