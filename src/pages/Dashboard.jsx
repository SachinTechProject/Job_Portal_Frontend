// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';
import { MagnifyingGlassIcon, BriefcaseIcon, BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [keyword, setKeyword] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;
  const token = localStorage.getItem("token")
  const fetchJobs = async (searchKeyword = keyword, pageNum = page) => {
    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`${config.API_BASE_URL}/jobsearch/search`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          keyword: searchKeyword.trim() || undefined,
          page: pageNum,
          limit,
        },
      });

      setJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load recent/popular jobs on first mount
  useEffect(() => {
    fetchJobs('', 1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs(keyword, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchJobs(keyword, newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero + Single Search Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10">
            Search jobs by title, company, location, type...
          </p>

          {/* Single Search Input */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="companyName, location, jobType, title, skills..."
                className="w-full pl-14 pr-6 py-4 text-lg border-none rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-2xl"
              />
              <button
                type="submit"
                disabled={loading}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-indigo-700 text-white font-medium rounded-full hover:bg-indigo-800 transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm opacity-80">
            Try: "TCS Hyderabad Full-time" or "Remote developer"
          </p>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-2xl font-medium text-gray-900">No jobs found</h3>
            <p className="mt-3 text-gray-600">
              Try different search terms (company, location, job type, etc.)
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {job.title}
                      </h3>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        {job.jobType || 'Full-time'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-6 text-gray-600">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                        <span>{job.company?.name || 'Company'}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span>{job.location || 'Location'}</span>
                      </div>
                    </div>

                    <Link
                      to={`/jobs/${job._id}`}
                      className="block w-full text-center py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-6">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <span className="text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;