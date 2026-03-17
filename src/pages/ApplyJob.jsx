// src/pages/ApplyJob.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import config from '../config';
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLogin } = useContext(AuthContext);
  
  const [job, setJob] = useState(location.state?.job || null);
  const [loading, setLoading] = useState(!job);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    coverLetter: '',
    resume: null,
    portfolio: '',
    linkedIn: '',
    github: '',
    expectedSalary: '',
    noticePeriod: '',
    skills: ''
  });

  const [resumeName, setResumeName] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const token = localStorage.getItem("token");

  // Fetch job details if not passed from state
  useEffect(() => {
    if (!job && id) {
      fetchJobDetails();
    }
  }, [id, job]);

  // Check if already applied
  useEffect(() => {
    if (user && job) {
      checkIfApplied();
    }
  }, [user, job]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_BASE_URL}/jobs/getjobbyid/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setJob(response.data.jobs);
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

  const checkIfApplied = async () => {
    try {
      // You might want to create an API endpoint to check application status
      // For now, we'll just check locally
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      setAlreadyApplied(appliedJobs.includes(id));
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          resume: 'Please upload PDF or Word document only'
        }));
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          resume: 'File size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resume: file
      }));
      setResumeName(file.name);
      setFormErrors(prev => ({
        ...prev,
        resume: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!formData.coverLetter.trim()) {
      errors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.length < 100) {
      errors.coverLetter = 'Cover letter should be at least 100 characters';
    }
    if (!formData.resume) {
      errors.resume = 'Resume is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!token) {
      alert('Please login to apply for jobs');
      navigate('/login', { state: { from: `/apply/${id}` } });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Create FormData object for file upload
      const applicationData = new FormData();
      applicationData.append('jobId', id);
      applicationData.append('fullName', formData.fullName);
      applicationData.append('email', formData.email);
      applicationData.append('phone', formData.phone);
      applicationData.append('coverLetter', formData.coverLetter);
      applicationData.append('resume', formData.resume);
      applicationData.append('portfolio', formData.portfolio);
      applicationData.append('linkedIn', formData.linkedIn);
      applicationData.append('github', formData.github);
      applicationData.append('expectedSalary', formData.expectedSalary);
      applicationData.append('noticePeriod', formData.noticePeriod);
      applicationData.append('skills', formData.skills);

      const response = await axios.post(
        `${config.API_BASE_URL}/api/applications/apply/${id}`,
        applicationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        
        // Store in localStorage for tracking
        const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        localStorage.setItem('appliedJobs', JSON.stringify([...appliedJobs, id]));
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate(`/seejobs/${id}`);
        }, 3000);
      } else {
        if (response.data.message === "You have already applied to this job") {
          setAlreadyApplied(true);
        } else {
          setError(response.data.message || 'Failed to submit application');
        }
      }
    } catch (err) {
      console.error('Application error:', err);
      if (err.response?.data?.message === "You have already applied to this job") {
        setAlreadyApplied(true);
      } else {
        setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <BriefcaseIcon className="absolute inset-0 m-auto h-10 w-10 text-blue-600 animate-pulse" />
          </div>
          <p className="mt-6 text-slate-600 text-lg">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockIcon className="h-12 w-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-600 mb-4">Already Applied!</h2>
          <p className="text-slate-600 mb-8">
            You have already submitted an application for this position.
            You can track your application status in your dashboard.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/seejobs/${id}`)}
              className="w-full px-8 py-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
            >
              Back to Job Details
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-600 mb-4">Application Submitted!</h2>
          <p className="text-slate-600 mb-8">
            Thank you for applying to {job?.title} at {job?.company?.name}. 
            The employer will review your application and contact you soon.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Redirecting to job details in 3 seconds...
          </p>
          <button
            onClick={() => navigate(`/seejobs/${id}`)}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
          >
            Back to Job Details
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XMarkIcon className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Job Not Found</h2>
          <p className="text-slate-600 mb-8">The job you're trying to apply for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back
          </button>
          
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {job.company?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Apply for {job.title}</h1>
                <p className="text-slate-600 flex items-center gap-2">
                  <BuildingOfficeIcon className="h-4 w-4" />
                  {job.company?.name} • {job.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-blue-600" />
              Personal Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    formErrors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                  placeholder="Enter your full name"
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                  placeholder="you@example.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    formErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                  placeholder="+1 234 567 8900"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expected Salary (Optional)
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="e.g., $60,000 - $80,000"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BriefcaseIcon className="h-5 w-5 text-purple-600" />
              Professional Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows="6"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    formErrors.coverLetter ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                  placeholder="Explain why you're the perfect candidate for this position..."
                />
                {formErrors.coverLetter && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.coverLetter}</p>
                )}
                <p className="mt-1 text-xs text-slate-500 text-right">
                  {formData.coverLetter.length} / 100 minimum characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resume/CV *
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 ${
                  formErrors.resume ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}>
                  <input
                    type="file"
                    id="resume"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="resume"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <CloudArrowUpIcon className="h-10 w-10 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Click to upload
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      PDF, DOC, DOCX (Max 5MB)
                    </span>
                  </label>
                  {resumeName && (
                    <p className="mt-2 text-sm text-emerald-600 text-center">
                      ✓ {resumeName}
                    </p>
                  )}
                </div>
                {formErrors.resume && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.resume}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notice Period (Optional)
                </label>
                <input
                  type="text"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="e.g., 30 days, Immediately"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Skills (Optional)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="e.g., React, Node.js, Python (comma separated)"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-indigo-600" />
              Professional Links (Optional)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;