// src/pages/UserActivity.jsx
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
  BookmarkIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

const UserActivity = () => {
  const navigate = useNavigate();
  const { user, isLogin } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchHistory] = useState([
    { term: 'React Developer', time: '2 hours ago', results: 45 },
    { term: 'Frontend Engineer', time: '1 day ago', results: 32 },
    { term: 'Remote Jobs', time: '3 days ago', results: 128 },
    { term: 'Product Manager', time: '5 days ago', results: 23 },
  ]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isLogin) {
      navigate('/login', { state: { from: '/activity' } });
      return;
    }
    fetchUserActivity();
  }, [isLogin]);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      
      // Fetch applications
      const appsResponse = await axios.get(
        `${config.API_BASE_URL}/applications/my-applications`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (appsResponse.data.success) {
        setApplications(appsResponse.data.applications || []);
      }

      // Get saved jobs from localStorage
      const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setSavedJobs(saved);

    } catch (err) {
      console.error('Error fetching activity:', err);
      setError('Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'all', name: 'All Activity', icon: ClockIcon },
    { id: 'applications', name: 'Applications', icon: PaperAirplaneIcon },
    { id: 'saved', name: 'Saved Jobs', icon: BookmarkIcon },
    { id: 'searches', name: 'Recent Searches', icon: MagnifyingGlassIcon },
  ];

  const filteredActivities = () => {
    const activities = [];

    // Add applications
    if (activeTab === 'all' || activeTab === 'applications') {
      applications.forEach(app => {
        activities.push({
          id: app._id,
          type: 'application',
          title: `Applied to ${app.job?.title}`,
          company: app.job?.company?.name,
          location: app.job?.location,
          date: app.createdAt,
          status: app.status,
          jobId: app.job?._id,
          icon: PaperAirplaneIcon,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        });
      });
    }

    // Add saved jobs
    if (activeTab === 'all' || activeTab === 'saved') {
      savedJobs.forEach((jobId, index) => {
        activities.push({
          id: `saved-${index}`,
          type: 'save',
          title: 'Saved a job',
          description: `Job ID: ${jobId}`,
          date: new Date().toISOString(), // You might want to store save dates
          icon: BookmarkIcon,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          jobId: jobId
        });
      });
    }

    // Add search history
    if (activeTab === 'all' || activeTab === 'searches') {
      searchHistory.forEach((search, index) => {
        activities.push({
          id: `search-${index}`,
          type: 'search',
          title: `Searched for "${search.term}"`,
          description: `${search.results} jobs found`,
          date: search.time,
          icon: MagnifyingGlassIcon,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        });
      });
    }

    // Sort by date (newest first)
    return activities.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date();
      const dateB = b.date ? new Date(b.date) : new Date();
      return dateB - dateA;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <ClockIcon className="absolute inset-0 m-auto h-10 w-10 text-blue-600 animate-pulse" />
          </div>
          <p className="mt-6 text-slate-600 text-lg">Loading your activity...</p>
        </div>
      </div>
    );
  }

  const activities = filteredActivities();

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
            
            <h1 className="text-xl font-bold text-slate-900">Your Activity</h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <PaperAirplaneIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
                <p className="text-sm text-slate-600">Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BookmarkIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{savedJobs.length}</p>
                <p className="text-sm text-slate-600">Saved Jobs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <MagnifyingGlassIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{searchHistory.length}</p>
                <p className="text-sm text-slate-600">Recent Searches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Activity List */}
        {activities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200">
            <ClockIcon className="h-20 w-20 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">No activity yet</h2>
            <p className="text-slate-600 mb-6">
              {activeTab === 'all' 
                ? 'Your activity will appear here' 
                : `No ${activeTab} found`}
            </p>
            <Link
              to="/jobs"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-100 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 ${activity.iconBg} rounded-xl`}>
                      <activity.icon className={`h-6 w-6 ${activity.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {activity.title}
                          </h3>
                          
                          {activity.company && (
                            <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                              <BuildingOfficeIcon className="h-4 w-4" />
                              {activity.company}
                              {activity.location && (
                                <>
                                  <span>•</span>
                                  <MapPinIcon className="h-4 w-4" />
                                  {activity.location}
                                </>
                              )}
                            </p>
                          )}

                          {activity.description && (
                            <p className="text-sm text-slate-600">{activity.description}</p>
                          )}

                          {/* Time */}
                          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {getTimeAgo(activity.date)}
                          </p>
                        </div>

                        {/* Status Badge or Action */}
                        <div className="flex items-center gap-3">
                          {activity.status && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          )}

                          {activity.jobId && (
                            <Link
                              to={`/seejobs/${activity.jobId}`}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors"
                            >
                              View Job
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivity;