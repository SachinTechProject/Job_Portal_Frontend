// src/pages/CompanyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);

        // Adjust endpoint if your backend uses a different path
        // Example: /api/company/:id or /api/company/get-company/:id
        const response = await axios.get(`http://localhost:5000/api/company/get-companys/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Company details response:", response.data);

        // Adjust based on your actual response structure
        setCompany(response.data.company || response.data || null);
      } catch (err) {
        console.error('Company fetch error:', err);
        setError(
          err.response?.data?.message ||
          'Failed to load company details. It may not exist or you lack permission.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
        <p className="ml-4 text-lg text-gray-600">Loading company details...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 max-w-lg w-full p-10 text-center rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-red-600 mb-5">Error</h2>
          <p className="text-gray-700 mb-8 text-lg">{error || 'Company not found'}</p>
          <button
            onClick={() => navigate('/companies')}
            className="px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-md"
          >
            Back to Companies List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/companies')}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back to Companies
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-16 md:py-20 text-white text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {company.name}
            </h1>

            {company.website && (
              <a
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-white text-lg underline hover:text-gray-200 hover:no-underline transition"
              >
                Visit Website → {company.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 lg:p-16 space-y-12">
            {/* Description - Prominent section */}
            {company.description ? (
              <section className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Company</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {company.description}
                </p>
              </section>
            ) : (
              <p className="text-gray-500 italic text-center py-8">
                No description available yet.
              </p>
            )}

            {/* Key Info Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Location</h3>
                <p className="text-gray-700 flex items-center gap-2 text-base">
                  <span className="text-xl">📍</span>
                  {company.location || 'Not specified'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Founded Year</h3>
                <p className="text-gray-700 text-base">
                  {company.foundedYear || 'Not specified'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Industry</h3>
                <p className="text-gray-700 text-base">
                  {company.industry || 'Not specified'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Company Size</h3>
                <p className="text-gray-700 text-base">
                  {company.companySize || 'Not specified'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-full md:col-span-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Joined Platform</h3>
                <p className="text-gray-700 text-base">
                  {new Date(company.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-10 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Company Activity</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-5xl font-extrabold text-blue-700">
                    {company.totalJobsPosted || 0}
                  </p>
                  <p className="text-gray-600 mt-2 font-medium">Jobs Posted</p>
                </div>

                <div>
                  <p className="text-5xl font-extrabold text-green-700">
                    {company.totalApplicationsReceived || 0}
                  </p>
                  <p className="text-gray-600 mt-2 font-medium">Applications Received</p>
                </div>

                <div>
                  <p className="text-5xl font-extrabold text-purple-700">
                    {company.applications?.length || 0}
                  </p>
                  <p className="text-gray-600 mt-2 font-medium">Active Applications</p>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-10">
              {company.website && (
                <a
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 max-w-sm text-center py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
                >
                  Visit Company Website
                </a>
              )}
              <button
                onClick={() => navigate('/companies')}
                className="flex-1 max-w-sm py-4 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 transition shadow-md"
              >
                Back to Companies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;