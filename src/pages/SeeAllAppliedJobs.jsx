// src/pages/SeeAllAppliedJobs.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import config from '../config';
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  EyeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { ClockIcon as ClockIconSolid } from '@heroicons/react/24/solid';

const SeeAllAppliedJobs = () => {
  const navigate = useNavigate();
  const { user, isLogin } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    rejected: 0,
    interview: 0,
    accepted: 0
  });

  const token = localStorage.getItem("token");

  // Status options for filtering
  const statusOptions = [
    { value: 'all', label: 'All Applications', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'reviewed', label: 'Reviewed', color: 'blue' },
    { value: 'interview', label: 'Interview', color: 'purple' },
    { value: 'accepted', label: 'Accepted', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' }
  ];

  useEffect(() => {
    if (!isLogin) {
      navigate('/login', { state: { from: '/my-applications' } });
      return;
    }
    fetchApplications();
  }, [isLogin]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${config.API_BASE_URL}/applications/my-applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Applications response:", response);

      if (response.data.success) {
        const applicationsData = response.data.applications || [];
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
        
        // Calculate stats
        calculateStats(applicationsData);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps) => {
    const stats = {
      total: apps.length,
      pending: apps.filter(app => app.status === 'pending').length,
      reviewed: apps.filter(app => app.status === 'reviewed').length,
      rejected: apps.filter(app => app.status === 'rejected').length,
      interview: apps.filter(app => app.status === 'interview').length,
      accepted: apps.filter(app => app.status === 'accepted').length
    };
    setStats(stats);
  };

  // Filter and sort applications
  useEffect(() => {
    let filtered = [...applications];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.job?.title?.toLowerCase().includes(term) ||
        app.job?.company?.name?.toLowerCase().includes(term) ||
        app.job?.location?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.appliedAt || a.createdAt) - new Date(b.appliedAt || b.createdAt);
      } else if (sortBy === 'company') {
        return (a.job?.company?.name || '').localeCompare(b.job?.company?.name || '');
      }
      return 0;
    });

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, sortBy, applications]);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'reviewed': 'bg-blue-100 text-blue-800 border-blue-200',
      'interview': 'bg-purple-100 text-purple-800 border-purple-200',
      'accepted': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'reviewed':
        return <EyeIcon className="h-4 w-4" />;
      case 'interview':
        return <UserGroupIcon className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const appliedDate = new Date(date);
    const diffInDays = Math.floor((now - appliedDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return formatDate(date);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <BriefcaseIcon className="absolute inset-0 m-auto h-10 w-10 text-blue-600 animate-pulse" />
          </div>
          <p className="mt-6 text-slate-600 text-lg">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            
            <h1 className="text-xl font-bold text-slate-900">My Applications</h1>
            
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center hover:shadow-md transition">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-600">Total</p>
          </div>
          <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-200 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            <p className="text-xs text-yellow-600">Pending</p>
          </div>
          <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.reviewed}</p>
            <p className="text-xs text-blue-600">Reviewed</p>
          </div>
          <div className="bg-purple-50 rounded-2xl shadow-sm border border-purple-200 p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">{stats.interview}</p>
            <p className="text-xs text-purple-600">Interview</p>
          </div>
          <div className="bg-green-50 rounded-2xl shadow-sm border border-green-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{stats.accepted}</p>
            <p className="text-xs text-green-600">Accepted</p>
          </div>
          <div className="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
            <p className="text-xs text-red-600">Rejected</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Applications
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || statusFilter !== 'all' || sortBy !== 'newest') && (
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-slate-600">Active Filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="ml-2 text-blue-600 hover:text-blue-800">
                    ×
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                  <button onClick={() => setStatusFilter('all')} className="ml-2 text-blue-600 hover:text-blue-800">
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-slate-600">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        </div>

        {/* Applications List */}
        {error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XMarkIcon className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Applications</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchApplications}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200">
            <BriefcaseIcon className="h-20 w-20 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">No applications found</h2>
            <p className="text-slate-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You haven\'t applied to any jobs yet'}
            </p>
            {searchTerm || statusFilter !== 'all' ? (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/jobs"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Browse Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-100 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Company Logo Placeholder */}
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {application.job?.company?.name?.charAt(0) || 'C'}
                        </div>
                        
                        <div className="flex-1">
                          <Link to={`/seejobs/${application.job?._id}`}>
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                              {application.job?.title || 'Job Title'}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <BuildingOfficeIcon className="h-4 w-4" />
                            <span className="text-sm">{application.job?.company?.name || 'Company Name'}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                            <span className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {application.job?.location || 'Location not specified'}
                            </span>
                            <span className="flex items-center">
                              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                              {application.job?.salary || 'Not disclosed'}
                            </span>
                          </div>

                          {/* Application Meta */}
                          <div className="flex flex-wrap items-center gap-4 text-xs">
                            <span className="flex items-center text-slate-500">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              Applied: {getTimeAgo(application.appliedAt || application.createdAt)}
                            </span>
                            
                            {application.job?.jobType && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                                {application.job.jobType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Status Badge */}
                      <div className={`px-4 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status || 'Pending'}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          to={`/seejobs/${application.job?._id}`}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          View Job
                        </Link>
                        
                        {application.status === 'interview' && (
                          <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-700 transition-colors">
                            Schedule
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline (if available) */}
                  {application.timeline && application.timeline.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-500 font-medium">Timeline:</span>
                        <div className="flex items-center gap-2">
                          {application.timeline.map((event, index) => (
                            <React.Fragment key={index}>
                              <span className="text-slate-700">{event.status}</span>
                              {index < application.timeline.length - 1 && (
                                <ChevronDownIcon className="h-3 w-3 text-slate-400" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
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

export default SeeAllAppliedJobs;