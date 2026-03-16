// src/pages/Companies.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import config from '../config';

const Companies = () => {
  const { role, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [locations, setLocations] = useState([]);
  const [actionLoading, setActionLoading] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    withWebsite: 0,
    recent: 0,
    totalLikes: 0,
    totalFollowers: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${config.API_BASE_URL}/company/get-companys`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("this is companys", response)

        const companyList = response.data.allcompany || response.data.companies || response.data || [];
        const companiesArray = Array.isArray(companyList) ? companyList : [];
        
        setCompanies(companiesArray);
        setFilteredCompanies(companiesArray);
        console.log("this company list", companiesArray)
        
        // Extract unique locations
        const uniqueLocations = [...new Set(companiesArray
          .map(c => c.location)
          .filter(location => location && location !== 'Location not specified')
        )];
        setLocations(uniqueLocations);
        
        // Calculate stats
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        setStats({
          total: companiesArray.length,
          withWebsite: companiesArray.filter(c => c.website).length,
          recent: companiesArray.filter(c => new Date(c.createdAt) > thirtyDaysAgo).length,
          totalLikes: companiesArray.reduce((acc, c) => acc + (c.totalLikes || 0), 0),
          totalFollowers: companiesArray.reduce((acc, c) => acc + (c.totalFollowers || 0), 0)
        });
        
      } catch (err) {
        console.error('Companies fetch error:', err);
        setError('Failed to load companies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [token]);

  // Filter companies based on search and location
  useEffect(() => {
    let filtered = companies;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.location && company.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.website && company.website.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(company => company.location === selectedLocation);
    }
    
    setFilteredCompanies(filtered);
  }, [searchTerm, selectedLocation, companies]);

  const handleLike = async (companyId) => {
    if (!token) {
      alert('Please login to like companies');
      return;
    }

    setActionLoading(prev => ({ ...prev, [companyId]: 'like' }));

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/company/companies/${companyId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Get current user ID from context or token
      const currentUserId = user?.id || user?._id;
      
      // Update the company in the list
      setCompanies(prevCompanies => 
        prevCompanies.map(company => {
          if (company._id === companyId) {
            // Check if user already liked this company
            const hasLiked = company.likes?.includes(currentUserId);
            
            // Update likes array
            let updatedLikes = [...(company.likes || [])];
            if (hasLiked) {
              updatedLikes = updatedLikes.filter(id => id !== currentUserId);
            } else {
              updatedLikes.push(currentUserId);
            }
            
            return { 
              ...company, 
              totalLikes: response.data.totalLikes || updatedLikes.length,
              likes: updatedLikes
            };
          }
          return company;
        })
      );

    } catch (err) {
      console.error('Like error:', err);
      alert(err.response?.data?.message || 'Failed to like company');
    } finally {
      setActionLoading(prev => ({ ...prev, [companyId]: null }));
    }
  };

  const handleFollow = async (companyId) => {
    if (!token) {
      alert('Please login to follow companies');
      return;
    }

    setActionLoading(prev => ({ ...prev, [companyId]: 'follow' }));

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/company/companies/${companyId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get current user ID from context or token
      const currentUserId = user?.id || user?._id;

      // Update the company in the list
      setCompanies(prevCompanies => 
        prevCompanies.map(company => {
          if (company._id === companyId) {
            // Check if user already follows this company
            const hasFollowed = company.followers?.includes(currentUserId);
            
            // Update followers array
            let updatedFollowers = [...(company.followers || [])];
            if (hasFollowed) {
              updatedFollowers = updatedFollowers.filter(id => id !== currentUserId);
            } else {
              updatedFollowers.push(currentUserId);
            }
            
            return { 
              ...company, 
              totalFollowers: response.data.totalFollowers || updatedFollowers.length,
              followers: updatedFollowers
            };
          }
          return company;
        })
      );

    } catch (err) {
      console.error('Follow error:', err);
      alert(err.response?.data?.message || 'Failed to follow company');
    } finally {
      setActionLoading(prev => ({ ...prev, [companyId]: null }));
    }
  };

  const handleDelete = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`${config.API_BASE_URL}/company/delete-company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies((prev) => prev.filter((c) => c._id !== companyId));
      
      // Show success toast (you can replace with a proper toast library)
      alert('Company deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete company');
    }
  };

  // Helper function to check if current user liked the company
  const isLikedByUser = (company) => {
    const currentUserId = user?.id || user?._id;
    return company.likes?.includes(currentUserId) || false;
  };

  // Helper function to check if current user follows the company
  const isFollowedByUser = (company) => {
    const currentUserId = user?.id || user?._id;
    return company.followers?.includes(currentUserId) || false;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('all');
  };

  // Format number for display (e.g., 1000 -> 1K)
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-4">
              Discover Amazing Companies
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore opportunities with top companies. Find your next career move or business partnership.
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{stats.total}</div>
              <div className="text-sm text-blue-200">Total Companies</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{stats.withWebsite}</div>
              <div className="text-sm text-blue-200">With Websites</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{stats.recent}</div>
              <div className="text-sm text-blue-200">New (30d)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{formatNumber(stats.totalLikes)}</div>
              <div className="text-sm text-blue-200">Total Likes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{formatNumber(stats.totalFollowers)}</div>
              <div className="text-sm text-blue-200">Total Followers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Companies
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, location, or website..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedLocation !== 'all') && (
            <div className="mt-4 flex items-center gap-4 flex-wrap">
              <span className="text-sm text-gray-600">Active Filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Location: {selectedLocation}
                  <button
                    onClick={() => setSelectedLocation('all')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCompanies.length} of {companies.length} companies
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-lg text-gray-600">Loading companies...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-lg mx-auto bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCompanies.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">No companies found</h3>
              <p className="mt-2 text-gray-600">
                {searchTerm || selectedLocation !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'New companies will appear here soon.'}
              </p>
              {(searchTerm || selectedLocation !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Companies Grid */}
        {!loading && !error && filteredCompanies.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => {
              const likedByUser = isLikedByUser(company);
              const followedByUser = isFollowedByUser(company);
              
              return (
                <div
                  key={company._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  {/* Company Header with Gradient */}
                  <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  
                  <div className="p-6">
                    {/* Company Name and Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {company.name}
                        </h3>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">🏢</span>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">
                        {company.location || 'Location not specified'}
                      </span>
                    </div>

                    {/* Website */}
                    {company.website && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{formatNumber(company.totalLikes || 0)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span className="text-sm font-medium">{formatNumber(company.totalFollowers || 0)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                        <span className="text-sm font-medium">{formatNumber(company.totalJobsPosted || 0)}</span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Joined {new Date(company.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      
                      {company.updatedAt && company.updatedAt !== company.createdAt && (
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Updated
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    {/* Like and Follow Buttons */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => handleLike(company._id)}
                        disabled={actionLoading[company._id] === 'like'}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
                          likedByUser
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${actionLoading[company._id] === 'like' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {actionLoading[company._id] === 'like' ? (
                          <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg className={`h-5 w-5 ${likedByUser ? 'fill-current' : ''}`} fill={likedByUser ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{likedByUser ? 'Liked' : 'Like'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleFollow(company._id)}
                        disabled={actionLoading[company._id] === 'follow'}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
                          followedByUser
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${actionLoading[company._id] === 'follow' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {actionLoading[company._id] === 'follow' ? (
                          <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg className={`h-5 w-5 ${followedByUser ? 'fill-current' : ''}`} fill={followedByUser ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <span>{followedByUser ? 'Following' : 'Follow'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* View Details and Delete Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/companies/${company._id}`}
                        className="flex-1 text-center py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View Details
                      </Link>

                      {role === 'admin' && (
                        <button
                          onClick={() => handleDelete(company._id, company.name)}
                          className="px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          title="Delete Company"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;