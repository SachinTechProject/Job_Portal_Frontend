import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-72 bg-gray-900 text-gray-300 hidden lg:block">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-sm opacity-70 mt-1">Platform Management</p>
        </div>
        <nav className="p-4 space-y-1">
          <Link to="/admin/overview" className="block px-4 py-3 rounded-lg bg-gray-800 text-white">
            Overview
          </Link>
          <Link to="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-gray-800">
            Users Management
          </Link>
          <Link to="/admin/jobs" className="block px-4 py-3 rounded-lg hover:bg-gray-800">
            Jobs & Moderation
          </Link>
          <Link to="/admin/companies" className="block px-4 py-3 rounded-lg hover:bg-gray-800">
            Companies
          </Link>
          <Link to="/admin/reports" className="block px-4 py-3 rounded-lg hover:bg-gray-800">
            Reports & Analytics
          </Link>
          <Link to="/admin/settings" className="block px-4 py-3 rounded-lg hover:bg-gray-800">
            Platform Settings
          </Link>
          <Link to="/admin/subscriptions" className="block px-4 py-3 rounded-lg hover:bg-gray-800">
            Plans & Payments
          </Link>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b p-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Admin Overview</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Last login: Today 10:42 AM</span>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow border-t-4 border-red-600">
              <p className="text-gray-600">Total Users</p>
              <p className="text-4xl font-bold mt-2">12,847</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-600">
              <p className="text-gray-600">Active Jobs</p>
              <p className="text-4xl font-bold mt-2">3,921</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-t-4 border-green-600">
              <p className="text-gray-600">Applications Today</p>
              <p className="text-4xl font-bold mt-2">284</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-t-4 border-purple-600">
              <p className="text-gray-600">Revenue (This Month)</p>
              <p className="text-4xl font-bold mt-2">₹4.82L</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Pending Moderation</h3>
              <p className="text-2xl font-bold text-orange-600">17 Jobs</p>
              <p className="text-sm text-gray-500 mt-1">8 new companies • 9 job postings</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">System Health</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Uptime</span><span className="text-green-600">99.98%</span>
                </div>
                <div className="flex justify-between">
                  <span>Server Load</span><span className="text-green-600">42%</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;