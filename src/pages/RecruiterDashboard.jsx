import React from 'react';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-indigo-900 text-white hidden md:block">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-2xl font-bold">JobPortal</h1>
          <p className="text-sm opacity-80 mt-1">Recruiter Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          <Link to="/recruiter/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-800">
            Overview
          </Link>
          <Link to="/recruiter/jobs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800">
            My Jobs
          </Link>
          <Link to="/recruiter/post-job" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800">
            Post New Job
          </Link>
          <Link to="/recruiter/applicants" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800">
            Applicants
          </Link>
          <Link to="/recruiter/pipeline" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800">
            Hiring Pipeline
          </Link>
          <Link to="/recruiter/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-800">
            Analytics
          </Link>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recruiter Dashboard</h2>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium">
            + Post New Job
          </button>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-600">
              <p className="text-gray-500">Active Jobs</p>
              <p className="text-3xl font-bold mt-1">8</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600">
              <p className="text-gray-500">New Applications</p>
              <p className="text-3xl font-bold mt-1">24</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-600">
              <p className="text-gray-500">Interviews Today</p>
              <p className="text-3xl font-bold mt-1">5</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-600">
              <p className="text-gray-500">Time to Hire</p>
              <p className="text-3xl font-bold mt-1">18 days</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
            <div className="space-y-4">
              {/* Table or list of recent applicants */}
              <div className="flex justify-between items-center py-3 border-b">
                <div>
                  <p className="font-medium">Rahul Sharma</p>
                  <p className="text-sm text-gray-500">Senior Frontend Developer</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">Screening</span>
              </div>
              {/* more rows... */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;