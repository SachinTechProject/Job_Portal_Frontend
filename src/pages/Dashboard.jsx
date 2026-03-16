// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Static user data
  const user = {
    name: 'Sarah Johnson',
    role: 'Senior Developer',
    location: 'San Francisco, CA',
    avatar: null,
    memberSince: '2024',
    profileCompletion: 75
  };

  // Static statistics
  const stats = [
    { icon: BriefcaseIcon, label: 'Applied Jobs', value: '24', trend: '+3', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: BookmarkIcon, label: 'Saved Jobs', value: '12', trend: '+2', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: EyeIcon, label: 'Profile Views', value: '347', trend: '+48', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
    { icon: UserGroupIcon, label: 'Connections', value: '156', trend: '+12', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
  ];

  // Static recommended jobs
  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      companyLogo: null,
      location: 'San Francisco, CA (Hybrid)',
      salary: '$120k - $150k',
      type: 'Full-time',
      posted: '2 hours ago',
      skills: ['React', 'TypeScript', 'Next.js'],
      matchScore: 95,
      featured: true,
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateLabs',
      companyLogo: null,
      location: 'Remote (Worldwide)',
      salary: '$130k - $160k',
      type: 'Full-time',
      posted: '5 hours ago',
      skills: ['Product Strategy', 'Agile', 'User Research'],
      matchScore: 88,
      featured: false,
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'CreativeStudio',
      companyLogo: null,
      location: 'New York, NY (On-site)',
      salary: '$90k - $120k',
      type: 'Contract',
      posted: '1 day ago',
      skills: ['Figma', 'User Testing', 'Wireframing'],
      matchScore: 82,
      featured: false,
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      companyLogo: null,
      location: 'Austin, TX (Remote)',
      salary: '$115k - $145k',
      type: 'Full-time',
      posted: '3 hours ago',
      skills: ['AWS', 'Kubernetes', 'Terraform'],
      matchScore: 79,
      featured: false,
    },
  ];

  // Static trending companies
  const trendingCompanies = [
    { name: 'Google', openPositions: 45, growth: '+12%', logo: null, industry: 'Technology' },
    { name: 'Microsoft', openPositions: 38, growth: '+8%', logo: null, industry: 'Technology' },
    { name: 'Amazon', openPositions: 52, growth: '+15%', logo: null, industry: 'E-commerce' },
    { name: 'Meta', openPositions: 27, growth: '+5%', logo: null, industry: 'Social Media' },
    { name: 'Apple', openPositions: 31, growth: '+10%', logo: null, industry: 'Consumer Electronics' },
  ];

  // Static recent activities
  const recentActivities = [
    { id: 1, type: 'application', company: 'TechCorp Inc.', position: 'Frontend Developer', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'save', company: 'InnovateLabs', position: 'Product Manager', time: '5 hours ago', status: 'saved' },
    { id: 3, type: 'view', company: 'CreativeStudio', position: 'UX Designer', time: '1 day ago', status: 'viewed' },
    { id: 4, type: 'interview', company: 'CloudTech', position: 'DevOps Engineer', time: '2 days ago', status: 'scheduled' },
  ];

  // Static job categories
  const categories = [
    { id: 'all', name: 'All Jobs', count: 1243 },
    { id: 'development', name: 'Development', count: 456 },
    { id: 'design', name: 'Design', count: 234 },
    { id: 'product', name: 'Product', count: 167 },
    { id: 'marketing', name: 'Marketing', count: 198 },
    { id: 'sales', name: 'Sales', count: 188 },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'application': return <PaperAirplaneIcon className="h-4 w-4 text-blue-600" />;
      case 'save': return <BookmarkIcon className="h-4 w-4 text-purple-600" />;
      case 'view': return <EyeIcon className="h-4 w-4 text-green-600" />;
      case 'interview': return <CalendarIcon className="h-4 w-4 text-orange-600" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBg = (type) => {
    switch(type) {
      case 'application': return 'bg-blue-100';
      case 'save': return 'bg-purple-100';
      case 'view': return 'bg-green-100';
      case 'interview': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar - Enhanced */}
      {/* <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                JobPortal
              </h1>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/jobs" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Find Jobs</Link>
                <Link to="/companies" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Companies</Link>
                <Link to="/resources" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Resources</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 mb-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
          <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-white rounded-full opacity-10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-indigo-100 text-lg mb-4 max-w-2xl">
                Your career journey continues here. We've found some amazing opportunities matching your profile.
              </p>
              
              {/* Profile Completion Bar */}
              <div className="max-w-md">
                <div className="flex items-center justify-between text-sm text-white mb-2">
                  <span>Profile Completion</span>
                  <span>{user.profileCompletion}%</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${user.profileCompletion}%` }}
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
          {stats.map((stat, index) => (
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
              
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="block p-4 border border-gray-100 rounded-xl hover:shadow-md transition group relative overflow-hidden"
                  >
                    {job.featured && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-lg text-yellow-900">
                        Featured
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                        <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-1">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                          </div>
                          
                          {/* Match Score */}
                          <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                            <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-semibold text-green-700">{job.matchScore}% match</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                            {job.salary}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {job.posted}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{user.role}</p>
                <p className="text-xs text-gray-500 mb-4 flex items-center justify-center">
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  {user.location}
                </p>
                
                <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">24</p>
                    <p className="text-xs text-gray-500">Applied</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-500">Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">8</p>
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
                        <BuildingOfficeIcon className="h-5 w-5 text-indigo-600" />
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
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-xl">
                    <div className={`${getActivityBg(activity.type)} p-2 rounded-lg mr-3`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">
                          {activity.type === 'application' && 'Applied to'}
                          {activity.type === 'save' && 'Saved'}
                          {activity.type === 'view' && 'Viewed'}
                          {activity.type === 'interview' && 'Interview scheduled at'}
                        </span>{' '}
                        {activity.position} at {activity.company}
                      </p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    {activity.status === 'pending' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
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

