// src/pages/Home.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import config from '../config';
import { 
  BriefcaseIcon, 
  BuildingOfficeIcon, 
  MapPinIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckBadgeIcon,
  SparklesIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  BookmarkIcon,
  PaperAirplaneIcon,
  EyeIcon,
  StarIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { user, role, isLogin } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    applied: 0,
    saved: 0,
    interviews: 0,
    views: 347,
    connections: 156
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");

  // User data from context with fallbacks
  const userData = {
    name: user?.fullName || user?.name || 'Guest User',
    role: role || user?.role || 'Job Seeker',
    location: user?.location || 'Location not set',
    avatar: user?.avatar || null,
    memberSince: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024',
    profileCompletion: user?.profileCompletion || 75
  };

  // Static trending companies (keeping as static)
  const trendingCompanies = [
    { name: 'Google', openPositions: 45, growth: '+12%', logo: null, industry: 'Technology' },
    { name: 'Microsoft', openPositions: 38, growth: '+8%', logo: null, industry: 'Technology' },
    { name: 'Amazon', openPositions: 52, growth: '+15%', logo: null, industry: 'E-commerce' },
    { name: 'Meta', openPositions: 27, growth: '+5%', logo: null, industry: 'Social Media' },
    { name: 'Apple', openPositions: 31, growth: '+10%', logo: null, industry: 'Consumer Electronics' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs
        const jobsResponse = await axios.get(`${config.API_BASE_URL}/jobs/getAllJobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (jobsResponse.data.success) {
          const jobsData = jobsResponse.data.jobs || [];
          setJobs(jobsData);
          setFilteredJobs(jobsData);
          
          // Generate categories from real job data
          const jobTypes = ['all', ...new Set(jobsData.map(job => job.jobType).filter(Boolean))];
          const categoryCounts = jobTypes.map(type => ({
            id: type === 'all' ? 'all' : type,
            name: type === 'all' ? 'All Jobs' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
            count: type === 'all' ? jobsData.length : jobsData.filter(job => job.jobType === type).length
          }));
          setCategories(categoryCounts);
        }

        // Fetch user's applications if logged in
        if (isLogin && token) {
          const appsResponse = await axios.get(
            `${config.API_BASE_URL}/applications/my-applications`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (appsResponse.data.success) {
            const applicationsData = appsResponse.data.applications || [];
            setApplications(applicationsData);
            
            // Calculate application stats
            const appliedCount = applicationsData.length;
            const interviewCount = applicationsData.filter(app => app.status === 'accepted').length;
            
            // Get saved jobs from localStorage
            const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
            
            setStats(prev => ({
              ...prev,
              applied: appliedCount,
              saved: savedJobs.length,
              interviews: interviewCount
            }));

            // Generate recent activities from applications
            const activities = applicationsData.slice(0, 4).map(app => ({
              id: app._id,
              type: app.status === 'accepted' ? 'interview' : 'application',
              company: app.job?.company?.name || 'Company',
              position: app.job?.title || 'Position',
              time: new Date(app.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              status: app.status
            }));
            setRecentActivities(activities);
          }
        } else {
          // If not logged in, just show saved jobs from localStorage
          const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
          setStats(prev => ({
            ...prev,
            saved: savedJobs.length
          }));
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user?.id, isLogin]);

  // Filter jobs based on category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.jobType === selectedCategory));
    }
  }, [selectedCategory, jobs]);

  // Format salary for display
  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    if (typeof salary === 'string') return salary;
    if (typeof salary === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(salary);
    }
    return 'Not disclosed';
  };

  // Get job match score (mock function - can be replaced with actual algorithm)
  const getMatchScore = (job) => {
    const baseScore = 70;
    const randomFactor = Math.floor(Math.random() * 20);
    return Math.min(95, baseScore + randomFactor);
  };

  // Format time posted
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type, status) => {
    if (status === 'accepted') {
      return <CalendarIcon className="h-4 w-4 text-orange-600" />;
    }
    switch(type) {
      case 'application': return <PaperAirplaneIcon className="h-4 w-4 text-blue-600" />;
      case 'save': return <BookmarkIcon className="h-4 w-4 text-purple-600" />;
      case 'view': return <EyeIcon className="h-4 w-4 text-green-600" />;
      case 'interview': return <CalendarIcon className="h-4 w-4 text-orange-600" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBg = (type, status) => {
    if (status === 'accepted') return 'bg-orange-100';
    switch(type) {
      case 'application': return 'bg-blue-100';
      case 'save': return 'bg-purple-100';
      case 'view': return 'bg-green-100';
      case 'interview': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  };

  const getActivityText = (activity) => {
    if (activity.status === 'accepted') {
      return `Interview scheduled for ${activity.position} at ${activity.company}`;
    }
    return `Applied to ${activity.position} at ${activity.company}`;
  };

  // Stats with real data
  const statsData = [
    { icon: BriefcaseIcon, label: 'Applied Jobs', value: stats.applied.toString(), trend: '+3', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: BookmarkIcon, label: 'Saved Jobs', value: stats.saved.toString(), trend: '+2', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: CalendarIcon, label: 'Interviews', value: stats.interviews.toString(), trend: '+1', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: EyeIcon, label: 'Profile Views', value: stats.views.toString(), trend: '+48', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 mb-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
          <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-white rounded-full opacity-10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {userData.name}! 👋
              </h1>
              <p className="text-indigo-100 text-lg mb-4 max-w-2xl">
                Your career journey continues here. We've found {jobs.length} amazing opportunities matching your profile.
              </p>
              
              {/* Profile Completion Bar */}
              <div className="max-w-md">
                <div className="flex items-center justify-between text-sm text-white mb-2">
                  <span>Profile Completion</span>
                  <span>{userData.profileCompletion}%</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${userData.profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex space-x-3">
              <Link
                to="/jobs"
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition flex items-center"
              >
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Browse Jobs
              </Link>
              <Link
                to="/profile"
                className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-400 transition flex items-center"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <span className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Jobs Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, skill, or company..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        selectedCategory === category.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Jobs Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                  <p className="text-sm text-gray-500 mt-1">Based on your profile and search history</p>
                </div>
                <Link to="/jobs" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  View All
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.slice(0, 4).map((job) => (
                    <Link
                      key={job._id}
                      to={`/seejobs/${job._id}`}
                      className="block p-4 border border-gray-100 rounded-xl hover:shadow-md transition group relative overflow-hidden"
                    >
                      {job.urgent && (
                        <div className="absolute top-0 right-0 bg-red-400 text-xs font-bold px-3 py-1 rounded-bl-lg text-white">
                          Urgent
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                          {job.company?.logo ? (
                            <img src={job.company.logo} alt={job.company.name} className="w-8 h-8 rounded-lg object-cover" />
                          ) : (
                            <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-1">
                                {job.title || 'Untitled Position'}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">{job.company?.name || 'Company Name'}</p>
                            </div>
                            
                            {/* Match Score */}
                            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                              <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm font-semibold text-green-700">{getMatchScore(job)}% match</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {job.location || 'Location not specified'}
                            </span>
                            <span className="flex items-center">
                              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                              {formatSalary(job.salary)}
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {getTimeAgo(job.createdAt)}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {job.skills?.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills?.length > 3 && (
                              <span className="px-3 py-1 text-xs text-gray-500">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {filteredJobs.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No jobs found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {userData.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{userData.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{userData.role}</p>
                <p className="text-xs text-gray-500 mb-4 flex items-center justify-center">
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  {userData.location}
                </p>
                
                <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{stats.applied}</p>
                    <p className="text-xs text-gray-500">Applied</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{stats.saved}</p>
                    <p className="text-xs text-gray-500">Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{stats.interviews}</p>
                    <p className="text-xs text-gray-500">Interviews</p>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View Full Profile
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Trending Companies */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
                  Trending Companies
                </h3>
                <Link to="/companies" className="text-indigo-600 hover:text-indigo-800 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {trendingCompanies.map((company, idx) => (
                  <Link
                    key={idx}
                    to={`/companies/${company.name.toLowerCase()}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition group"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mr-3">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-6 h-6 rounded-lg object-cover" />
                        ) : (
                          <BuildingOfficeIcon className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-indigo-600">
                          {company.name}
                        </h4>
                        <p className="text-xs text-gray-500">{company.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{company.openPositions}</p>
                      <p className="text-xs text-green-600">{company.growth}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-xl">
                      <div className={`${getActivityBg(activity.type, activity.status)} p-2 rounded-lg mr-3`}>
                        {getActivityIcon(activity.type, activity.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {getActivityText(activity)}
                        </p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      {activity.status === 'accepted' && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          Interview
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No recent activity</p>
                )}
              </div>
              
              <Link
                to="/activity"
                className="mt-4 block text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All Activity
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;