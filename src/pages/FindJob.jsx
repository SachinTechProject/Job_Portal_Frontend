// src/pages/FindJob.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CalendarIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  UserGroupIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  TrashIcon,
  PencilIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import config from '../config';

const FindJob = () => {
  const { isLogin, user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [savedJobs, setSavedJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    fullTime: 0,
    remote: 0,
    urgent: 0
  });

  const token = localStorage.getItem("token");

  // Job types for filter
  const jobTypes = ['all', 'full-time', 'part-time', 'contract', 'internship'];
  const workModes = ['all', 'remote', 'onsite', 'hybrid'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${config.API_BASE_URL}/jobs/getAllJobs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const jobsData = response.data.jobs || [];
          setJobs(jobsData);
          setFilteredJobs(jobsData);
          
          // Calculate stats
          setStats({
            total: jobsData.length,
            fullTime: jobsData.filter(job => job.jobType === 'full-time').length,
            remote: jobsData.filter(job => job.workMode === 'remote').length,
            urgent: jobsData.filter(job => job.urgent || false).length
          });
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

    // Load saved jobs from localStorage
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
  }, [token]);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(term) ||
        job.company?.name?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term) ||
        job.skills?.some(skill => skill.toLowerCase().includes(term))
      );
    }

    // Job type filter
    if (selectedJobType !== 'all') {
      filtered = filtered.filter(job => job.jobType === selectedJobType);
    }

    // Work mode filter
    if (selectedWorkMode !== 'all') {
      filtered = filtered.filter(job => job.workMode === selectedWorkMode);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedJobType, selectedWorkMode, selectedLocation, jobs]);

  const toggleSaveJob = (jobId) => {
    let updatedSaved;
    if (savedJobs.includes(jobId)) {
      updatedSaved = savedJobs.filter(id => id !== jobId);
    } else {
      updatedSaved = [...savedJobs, jobId];
    }
    setSavedJobs(updatedSaved);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSaved));
  };

  // Check if user can delete a job using AuthContext
  const canDeleteJob = (job) => {
    // Admin can delete any job
    if (role === 'admin') return true;
    
    // Company/Recruiter can delete their own jobs
    if (role === 'recruiter' || role === 'company') {
      return job.userId === user?.id || job.companyId === user?.companyId;
    }
    
    return false;
  };

  // Handle delete job
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    setDeleteLoading(prev => ({ ...prev, [jobToDelete._id]: true }));

    try {
      const response = await axios.delete(
        `${config.API_BASE_URL}/jobs/deletejob/${jobToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Remove job from state
        setJobs(prevJobs => prevJobs.filter(job => job._id !== jobToDelete._id));
        setFilteredJobs(prevJobs => prevJobs.filter(job => job._id !== jobToDelete._id));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          fullTime: jobToDelete.jobType === 'full-time' ? prev.fullTime - 1 : prev.fullTime,
          remote: jobToDelete.workMode === 'remote' ? prev.remote - 1 : prev.remote,
          urgent: jobToDelete.urgent ? prev.urgent - 1 : prev.urgent
        }));

        // Show success message
        alert('Job deleted successfully');
      } else {
        alert(response.data.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [jobToDelete._id]: false }));
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  const openDeleteModal = (job, e) => {
    e.preventDefault();
    e.stopPropagation();
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedJobType('all');
    setSelectedWorkMode('all');
    setSelectedLocation('all');
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'part-time': 'bg-amber-100 text-amber-800 border-amber-200',
      'contract': 'bg-purple-100 text-purple-800 border-purple-200',
      'internship': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[type] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getWorkModeIcon = (mode) => {
    switch(mode) {
      case 'remote': return '🏠';
      case 'hybrid': return '🔄';
      default: return '🏢';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Delete Confirmation Modal - Fixed overlay issue */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop with proper z-index and click handler */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowDeleteModal(false)}
            style={{ zIndex: 100 }}
          ></div>

          {/* Modal Container - centered */}
          <div className="flex min-h-full items-center justify-center p-4 relative" style={{ zIndex: 101 }}>
            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-6 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Delete Job Posting
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-gray-700">"{jobToDelete.title}"</span>?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        This action cannot be undone. This will permanently delete the job posting
                        and remove all associated data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleDeleteJob}
                  disabled={deleteLoading[jobToDelete._id]}
                  className="inline-flex w-full justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleteLoading[jobToDelete._id] ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Delete Job'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fadeIn">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover thousands of opportunities from top companies worldwide
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <div className="flex items-center bg-white rounded-2xl shadow-2xl p-2">
                <MagnifyingGlassIcon className="h-6 w-6 text-slate-400 ml-3" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-4 text-slate-800 placeholder-slate-400 focus:outline-none text-lg"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="mr-2 p-3 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <FunnelIcon className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-blue-100">Total Jobs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.fullTime}</div>
                <div className="text-blue-100">Full Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.remote}</div>
                <div className="text-blue-100">Remote</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.urgent}</div>
                <div className="text-blue-100">Urgent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-slideDown">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Filter Jobs</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Type
                </label>
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Mode Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Work Mode
                </label>
                <select
                  value={selectedWorkMode}
                  onChange={(e) => setSelectedWorkMode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  {workModes.map(mode => (
                    <option key={mode} value={mode}>
                      {mode === 'all' ? 'All Modes' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  <option value="all">All Locations</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="pune">Pune</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
            <p className="text-slate-600">Based on your search criteria</p>
          </div>
          
          {/* Sort Options */}
          <select className="px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none">
            <option>Most Recent</option>
            <option>Salary: High to Low</option>
            <option>Salary: Low to High</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
              <BriefcaseIcon className="absolute inset-0 m-auto h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            <p className="mt-6 text-slate-600 text-lg">Finding the best jobs for you...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XMarkIcon className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Jobs Found */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200">
            <BriefcaseIcon className="h-20 w-20 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">No jobs found</h2>
            <p className="text-slate-600 mb-6">Try adjusting your search filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => {
              const canDelete = canDeleteJob(job);
              const isDeleting = deleteLoading[job._id];
              
              return (
                <div
                  key={job._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden animate-fadeIn relative"
                >
                  {/* Card Header with Company Info */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Company Logo Placeholder */}
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {job.company?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg line-clamp-1">
                            {job.title}
                          </h3>
                          <p className="text-slate-600 text-sm flex items-center gap-1">
                            <BuildingOfficeIcon className="h-4 w-4" />
                            {job.company?.name || 'Company Name'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        {/* Save Button */}
                        <button
                          onClick={() => toggleSaveJob(job._id)}
                          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                          disabled={isDeleting}
                        >
                          {savedJobs.includes(job._id) ? (
                            <HeartSolid className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartOutline className="h-5 w-5 text-slate-400 hover:text-red-500" />
                          )}
                        </button>

                        {/* Delete Button - Only for authorized users */}
                        {canDelete && (
                          <button
                            onClick={(e) => openDeleteModal(job, e)}
                            disabled={isDeleting}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors group/delete"
                            title="Delete job"
                          >
                            {isDeleting ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
                            ) : (
                              <TrashIcon className="h-5 w-5 text-slate-400 group-hover/delete:text-red-500 transition-colors" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Posted By Info (for admins/owners) */}
                    {canDelete && role === 'admin' && (
                      <div className="mb-3 text-xs text-slate-500 flex items-center gap-1">
                        <span className="bg-slate-100 px-2 py-1 rounded-full">
                          Posted by: {job.userId || 'Unknown'}
                        </span>
                      </div>
                    )}

                    {canDelete && role === 'recruiter' && (
                      <div className="mb-3 text-xs text-slate-500 flex items-center gap-1">
                        <span className="bg-slate-100 px-2 py-1 rounded-full">
                          Your Job Posting
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getJobTypeColor(job.jobType)}`}>
                        {job.jobType?.replace('-', ' ')}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                        {getWorkModeIcon(job.workMode)} {job.workMode}
                      </span>
                      {job.urgent && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200 animate-pulse">
                          🔥 Urgent
                        </span>
                      )}
                    </div>

                    {/* Key Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-slate-600 text-sm">
                        <MapPinIcon className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{job.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center text-slate-600 text-sm">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="font-medium text-emerald-600">{job.salary || 'Not disclosed'}</span>
                      </div>
                      <div className="flex items-center text-slate-600 text-sm">
                        <UserGroupIcon className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{job.openings || 1} {job.openings === 1 ? 'opening' : 'openings'}</span>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs text-slate-500">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center text-xs text-slate-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    
                    <Link
                      to={`/seejobs/${job._id}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {!loading && !error && filteredJobs.length > 12 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold">
              Load More Jobs
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FindJob;