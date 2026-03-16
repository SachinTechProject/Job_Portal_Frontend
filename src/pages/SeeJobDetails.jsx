// src/pages/SeeJobDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon as BookmarkOutline,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import config from '../config';

const SeeJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);

  const token = localStorage.getItem("token");

//   console.log("this is the id", id)
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.API_BASE_URL}/jobs/getjobbyid/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // console.log("this option", response)

        if (response.data.success) {
            // console.log("this is the data",response.data.jobs)
          setJob(response.data.jobs);
          
          // Fetch similar jobs based on title or skills
          fetchSimilarJobs(response.data.job);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        setError('Failed to load job details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilarJobs = async (currentJob) => {
      try {
        // This would be an API endpoint for similar jobs
        // For now, we'll just set an empty array
        setSimilarJobs([]);
      } catch (err) {
        console.error('Error fetching similar jobs:', err);
      }
    };
console.log("this is my job")
    fetchJobDetails();

    // Check if job is saved
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSaved(savedJobs.includes(id));

    // Check if already applied (would come from user data)
    // setApplied(/* check if applied */);
  }, [id]);

  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    let updatedSaved;
    
    if (saved) {
      updatedSaved = savedJobs.filter(jobId => jobId !== id);
    } else {
      updatedSaved = [...savedJobs, id];
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(updatedSaved));
    setSaved(!saved);
  };

  const handleApply = () => {
    // Navigate to application form
    navigate(`/apply/${id}`, { state: { job } });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  console.log("this is the job", job)

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'part-time': 'bg-amber-100 text-amber-800 border-amber-200',
      'contract': 'bg-purple-100 text-purple-800 border-purple-200',
      'internship': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[type] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <BriefcaseIcon className="absolute inset-0 m-auto h-10 w-10 text-blue-600 animate-pulse" />
          </div>
          <p className="mt-6 text-slate-600 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XMarkIcon className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-slate-600 mb-8">{error || 'Job not found'}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Browse Other Jobs
          </button>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysLeft(job.applicationDeadline);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Jobs
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveJob}
                className={`p-3 rounded-xl transition-all ${
                  saved ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {saved ? <BookmarkSolid className="h-5 w-5" /> : <BookmarkOutline className="h-5 w-5" />}
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Company Logo */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {job.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                      <div className="flex items-center gap-2 text-slate-600">
                        <BuildingOfficeIcon className="h-5 w-5" />
                        <span className="text-lg">{job.company?.name || 'Company Name'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Urgent Badge */}
                  {job.urgent && (
                    <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold border border-red-200 animate-pulse">
                      🔥 Urgent Hiring
                    </span>
                  )}
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center text-slate-600 mb-1">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Salary</span>
                    </div>
                    <p className="font-semibold text-emerald-600">{job.salary || 'Not disclosed'}</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center text-slate-600 mb-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Location</span>
                    </div>
                    <p className="font-semibold">{job.location || 'Not specified'}</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center text-slate-600 mb-1">
                      <BriefcaseIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Experience</span>
                    </div>
                    <p className="font-semibold">{job.experience || 'Not specified'}</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center text-slate-600 mb-1">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Openings</span>
                    </div>
                    <p className="font-semibold">{job.openings || 1}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${getJobTypeColor(job.jobType)}`}>
                    {job.jobType?.replace('-', ' ')}
                  </span>
                  <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-200">
                    {job.workMode}
                  </span>
                  {job.education && (
                    <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium border border-purple-200">
                      <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                      {job.education}
                    </span>
                  )}
                </div>

                {/* Deadline Alert */}
                {job.applicationDeadline && (
                  <div className={`p-4 rounded-xl ${
                    daysLeft <= 3 ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClockIcon className={`h-5 w-5 ${daysLeft <= 3 ? 'text-amber-600' : 'text-slate-500'}`} />
                        <span className="font-medium">Application Deadline:</span>
                      </div>
                      <span className={`font-semibold ${daysLeft <= 3 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {formatDate(job.applicationDeadline)}
                        {daysLeft !== null && daysLeft > 0 && (
                          <span className="ml-2 text-sm">({daysLeft} days left)</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
                Requirements
              </h2>
              
              {job.requirements && job.requirements.length > 0 ? (
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{req}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No specific requirements listed</p>
              )}
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TagIcon className="h-6 w-6 text-indigo-600" />
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-200 hover:bg-indigo-100 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Benefits & Perks</h2>
                <div className="grid grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                      <span className="text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Apply Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Ready to apply?</h3>
                
                {applied ? (
                  <div className="p-4 bg-emerald-50 rounded-xl text-center">
                    <CheckCircleIcon className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                    <p className="font-semibold text-emerald-700">Application Submitted!</p>
                    <p className="text-sm text-emerald-600 mt-1">You'll hear from us soon</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleApply}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg mb-3"
                    >
                      Apply Now
                    </button>
                    
                    <p className="text-xs text-slate-500 text-center">
                      <PaperAirplaneIcon className="h-3 w-3 inline mr-1" />
                      Your application will be sent to the employer
                    </p>
                  </>
                )}
              </div>

              {/* Company Info Card */}
              {job.company && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">About the Company</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {job.company.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{job.company.name}</p>
                        {job.company.website && (
                          <a 
                            href={job.company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Visit website
                          </a>
                        )}
                      </div>
                    </div>

                    {job.company.description && (
                      <p className="text-sm text-slate-600">{job.company.description}</p>
                    )}

                    {job.company.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPinIcon className="h-4 w-4" />
                        {job.company.location}
                      </div>
                    )}

                    <Link  to={`/companies/${job.company._id}`} >
                    <button className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium"> 
                      View Company Profile</button>
                     
                    </Link>
                  </div>
                </div>
              )}

              {/* Job Overview Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Job Overview</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Posted:</span>
                    <span className="font-medium">{formatDate(job.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Category:</span>
                    <span className="font-medium capitalize">{job.jobType}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Work Mode:</span>
                    <span className="font-medium capitalize">{job.workMode}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Experience:</span>
                    <span className="font-medium">{job.experience || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600">Applications:</span>
                    <span className="font-medium">{job.applicationCount || 0} received</span>
                  </div>
                </div>
              </div>

              {/* Similar Jobs Preview */}
              {similarJobs.length > 0 && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Similar Jobs</h3>
                  <div className="space-y-3">
                    {similarJobs.map(similar => (
                      <Link
                        key={similar._id}
                        to={`/jobs/${similar._id}`}
                        className="block p-3 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <p className="font-semibold">{similar.title}</p>
                        <p className="text-sm text-slate-600">{similar.company?.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeJobDetails;