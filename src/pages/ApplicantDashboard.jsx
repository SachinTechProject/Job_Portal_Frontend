import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const ApplicantDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">JobPortal</h1>
          <p className="text-sm text-gray-500 mt-1">Job Seeker</p>
        </div>
        <nav className="p-4 space-y-1">
          <Link to="/applicant/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
            <span>🏠</span> Dashboard
          </Link>
          <Link to="/applicant/jobs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
            <span>🔍</span> Find Jobs
          </Link>
          <Link to="/applicant/applications" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
            <span>📬</span> My Applications
          </Link>
          <Link to="/applicant/saved" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
            <span>❤️</span> Saved Jobs
          </Link>
          <Link to="/applicant/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
            <span>👤</span> My Profile
          </Link>
          <Link to="/applicant/alerts" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
            <span>🔔</span> Job Alerts
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Welcome back, Test</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Profile 78% complete</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Complete Profile</button>
          </div>
        </header>

        <main className="p-6 flex-1">
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-gray-500">Applications Sent</p>
              <p className="text-3xl font-bold mt-2">12</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-gray-500">Interviews Scheduled</p>
              <p className="text-3xl font-bold mt-2 text-green-600">3</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-gray-500">Profile Views</p>
              <p className="text-3xl font-bold mt-2 text-purple-600">47</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Recommended Jobs</h3>
              {/* List of job cards here */}
              <p className="text-gray-500">3 new matches today</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <ul className="space-y-3 text-sm">
                <li>Applied to Senior Frontend Developer – 2 days ago</li>
                <li>Profile viewed by TechNova – 1 day ago</li>
                <li>Interview scheduled with ScaleFast – Tomorrow 3 PM</li>
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav - optional */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
        <Link to="/applicant/dashboard">🏠</Link>
        <Link to="/applicant/jobs">🔍</Link>
        <Link to="/applicant/applications">📬</Link>
        <Link to="/applicant/profile">👤</Link>
      </nav>
    </div>
  );
};

export default ApplicantDashboard;