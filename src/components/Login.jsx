// src/pages/Login.jsx
import React,{ useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import config from '../config';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const {setIsLogin, setRole} = useContext(AuthContext)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'applicant', // many apps pre-select or remove this
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${config.API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("login response", data.user.role);
      setRole(data.user.role)

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // backend may return token under different keys, be defensive
      const tokenValue =
        data.accessToken || data.token || data.authToken || data?.data?.accessToken ||
        data?.data?.token;
      if (!tokenValue) {
        throw new Error('No token returned from server');
      }

      // Assuming your backend returns token & user info
      localStorage.setItem('token', tokenValue);
      localStorage.setItem('user', JSON.stringify(data.user || data.data?.user || {}));
      setIsLogin(true);
     
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        // Redirect based on role (common pattern)
        if (formData.role === 'admin') {
          navigate('/application');
        } else if (formData.role === 'recruiter') {
          navigate('/recruiter');
        } else {
          navigate('/dashboard');
        }
      }, 1500);

    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left - Visual */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-blue-700 p-10 text-white">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold">Welcome Back to Job-Porter</h1>
            <p className="text-indigo-100 text-lg">
              Log in to discover great opportunities or find the perfect talent.
            </p>
            <div className="mt-8">
              <img
                src="https://thumbs.dreamstime.com/b/modern-vibrant-office-interior-neon-lighting-showcasing-computer-desk-ergonomic-chair-various-elements-like-potted-plants-407151253.jpg"
                alt="Modern vibrant office workspace"
                className="rounded-xl shadow-lg opacity-90"
              />
            </div>
          </div>
        </div>

        {/* Right - Login Form */}
        <div className="p-8 md:p-12 lg:p-16">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600 mb-8">Access your Job-Porter account</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-2 text-xs font-medium text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 transition-all pointer-events-none"
                >
                  Email Address
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all pr-11"
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-2 text-xs font-medium text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 transition-all pointer-events-none"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Role (optional — comment out if not needed on login) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Signing in as
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['applicant', 'recruiter', 'admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
                      className={`py-2.5 px-3 text-sm font-medium rounded-lg border transition-all ${
                        formData.role === r
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-gray-300 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      {r === 'applicant' ? 'Job Seeker' : r === 'recruiter' ? 'Recruiter' : 'Admin'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 mt-2 rounded-xl text-white font-medium shadow-lg transition-all ${
                  loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" className="opacity-75" />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                  Create one now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;