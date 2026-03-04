// src/pages/FindJob.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // assuming you're using react-router-dom

const FindJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token")
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:5000/api/jobs/getAllJobs',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.success) {
          setJobs(response.data.jobs || []);
        } else {
          setError('Failed to fetch jobs');
        }
      } catch (err) {
        setError('Unable to load jobs. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Find Your Next Opportunity
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {loading ? 'Loading...' : `${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'} available`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* No jobs */}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-800">No jobs found</h2>
            <p className="mt-3 text-gray-600">Check back soon or adjust your search.</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
              >
                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Title & Type */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {job.title}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {job.jobType}
                    </span>
                  </div>

                  {/* Company */}
                  <div className="mb-4">
                    <p className="text-lg font-medium text-gray-800">
                      {job.company?.name || 'Company Name'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {job.company?.location || job.location || 'Location not specified'}
                    </p>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-2 mb-5 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium">📍</span>
                      <span className="ml-2">{job.location || 'Hybrid / Remote'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">💰</span>
                      <span className="ml-2">{job.salary || 'Not disclosed'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Position:</span>
                      <span className="ml-2 capitalize">{job.position || '-'}</span>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {job.requirements?.length > 0 ? (
                        job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="line-clamp-1">{req}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">No requirements listed</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto flex items-center justify-between">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    View & Apply
                  </Link>

                  <span className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJob;