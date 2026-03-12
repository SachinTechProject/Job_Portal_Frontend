// src/pages/Companies.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // ← import your context

const Companies = () => {
  const { role } = useContext(AuthContext); // ← get role from context
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:5000/api/company/get-companys', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const companyList = response.data.allcompany || response.data.companies || response.data || [];
        setCompanies(Array.isArray(companyList) ? companyList : []);
      } catch (err) {
        console.error('Companies fetch error:', err);
        setError('Failed to load companies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [token]);

  // Delete handler - only visible to admin
  const handleDelete = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/company/delete-company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted company from list (optimistic update)
      setCompanies((prev) => prev.filter((c) => c._id !== companyId));

      alert('Company deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete company');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Discover Companies
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {loading
              ? 'Loading companies...'
              : `${companies.length} ${companies.length === 1 ? 'company' : 'companies'} found`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4"></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-lg mx-auto bg-red-50 border-l-4 border-red-500 p-6 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && companies.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-800">No companies yet</h2>
            <p className="mt-3 text-gray-600">New companies will appear here soon.</p>
          </div>
        )}

        {/* Companies Grid */}
        {!loading && !error && companies.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies.map((company) => (
              <div
                key={company._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {company.name}
                  </h3>

                  {company.website && (
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm mb-4 block hover:underline"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}

                  <div className="flex items-center text-gray-600 mb-5">
                    <span className="text-lg">📍</span>
                    <span className="ml-2">
                      {company.location || 'Location not specified'}
                    </span>
                  </div>

                  <div className="mt-auto text-sm text-gray-500 pt-4 border-t border-gray-100">
                    Joined {new Date(company.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                {/* Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                  <Link
                    to={`/companies/${company._id}`}
                    className="block w-full text-center py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Company
                  </Link>

                  {/* Delete button - ONLY for admin */}
                  {role === 'admin' && (
                    <button
                      onClick={() => handleDelete(company._id, company.name)}
                      className="w-full py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Company
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;