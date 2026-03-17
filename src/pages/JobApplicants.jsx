// src/pages/JobApplicants.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, role, isLogin } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check if user is recruiter or admin
    if (!isLogin) {
      navigate('/login', { state: { from: `/job-applicants/${jobId}` } });
      return;
    }

    if (role !== 'recruiter' && role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchJobApplications();
  }, [jobId, isLogin, role]);

  const fetchJobApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      // First fetch job details
      const jobResponse = await axios.get(`${config.API_BASE_URL}/jobs/getjobbyid/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (jobResponse.data.success) {
        setJob(jobResponse.data.jobs);
      }

      // Then fetch applications for this job
      const response = await axios.get(
        `${config.API_BASE_URL}/applications/job/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Applications response:", response);

      if (response.data.success) {
        const applicationsData = response.data.applications || [];
        setApplications(applicationsData);
        
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
      accepted: apps.filter(app => app.status === 'accepted').length,
      rejected: apps.filter(app => app.status === 'rejected').length
    };
    setStats(stats);
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);

      const response = await axios.put(
        `${config.API_BASE_URL}/applications/update-status/${applicationId}`,
        { status: newStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Update response:", response);

      if (response.data.success) {
        // Update local state
        setApplications(prevApps => 
          prevApps.map(app => 
            app._id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );

        // Recalculate stats
        const updatedApps = applications.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        );
        calculateStats(updatedApps);

        alert(`Application ${newStatus} successfully!`);
      } else {
        alert(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = (applicationId, currentStatus) => {
    if (currentStatus === 'pending') {
      // Show options for pending applications
      if (window.confirm('Accept this application?')) {
        updateApplicationStatus(applicationId, 'accepted');
      }
    } else if (currentStatus === 'accepted') {
      if (window.confirm('Reject this application?')) {
        updateApplicationStatus(applicationId, 'rejected');
      }
    } else if (currentStatus === 'rejected') {
      if (window.confirm('Move this application back to pending?')) {
        updateApplicationStatus(applicationId, 'pending');
      }
    }
  };

  const toggleExpand = (applicationId) => {
    setExpandedId(expandedId === applicationId ? null : applicationId);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'accepted': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <BriefcaseIcon className="absolute inset-0 m-auto h-10 w-10 text-blue-600 animate-pulse" />
          </div>
          <p className="mt-6 text-slate-600 text-lg">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XMarkIcon className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-600 mb-8">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Go Back
          </button>
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
            
            <h1 className="text-xl font-bold text-slate-900">Job Applicants</h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Info Card */}
        {job && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {job.company?.name?.charAt(0) || 'J'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                    {job.company?.name}
                  </span>
                  <span className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {job.location || 'Location not specified'}
                  </span>
                  <span className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    {job.salary || 'Not disclosed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-600">Total Applications</p>
          </div>
          <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-200 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            <p className="text-xs text-yellow-600">Pending</p>
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

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200">
            <UserGroupIcon className="h-20 w-20 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">No applications yet</h2>
            <p className="text-slate-600">No one has applied for this job yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const applicant = application.application;
              const isExpanded = expandedId === application._id;
              const isUpdating = updatingId === application._id;

              return (
                <div
                  key={application._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-100 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Main Row */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Applicant Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <UserIcon className="h-7 w-7 text-indigo-600" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                              {applicant?.fullName || 'Anonymous'}
                            </h3>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-2">
                              <span className="flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                {applicant?.email || 'No email'}
                              </span>
                              <span className="flex items-center">
                                <PhoneIcon className="h-4 w-4 mr-1" />
                                {applicant?.phone || 'No phone'}
                              </span>
                            </div>

                            {/* Skills Preview */}
                            {applicant?.skills && applicant.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {applicant.skills.slice(0, 3).map((skill, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
                                    {skill}
                                  </span>
                                ))}
                                {applicant.skills.length > 3 && (
                                  <span className="px-2 py-1 text-xs text-slate-500">
                                    +{applicant.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Status Badge */}
                        <div className={`px-4 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleExpand(application._id)}
                            className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5" />
                            )}
                          </button>

                          {/* Status Update Buttons */}
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateApplicationStatus(application._id, 'accepted')}
                                disabled={isUpdating}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updateApplicationStatus(application._id, 'rejected')}
                                disabled={isUpdating}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {application.status === 'accepted' && (
                            <button
                              onClick={() => updateApplicationStatus(application._id, 'rejected')}
                              disabled={isUpdating}
                              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          )}

                          {application.status === 'rejected' && (
                            <button
                              onClick={() => updateApplicationStatus(application._id, 'pending')}
                              disabled={isUpdating}
                              className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors disabled:opacity-50"
                            >
                              Move to Pending
                            </button>
                          )}
                        </div>

                        {/* Applied Date */}
                        <span className="text-xs text-slate-500">
                          Applied: {formatDate(application.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Skills */}
                          {applicant?.skills && applicant.skills.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                                <AcademicCapIcon className="h-4 w-4" />
                                Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {applicant.skills.map((skill, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Experience & Education - Add if available in your schema */}
                          {/* Add more fields as per your User schema */}
                        </div>

                        {/* Contact Info */}
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">Contact Information</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-slate-500">Email</p>
                              <p className="text-sm font-medium">{applicant?.email || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Phone</p>
                              <p className="text-sm font-medium">{applicant?.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Applied On</p>
                              <p className="text-sm font-medium">{formatDate(application.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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

export default JobApplicants;