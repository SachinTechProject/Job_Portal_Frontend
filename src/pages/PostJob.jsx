// src/pages/PostJob.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  BuildingOfficeIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import config from '../config';

const PostJob = () => {
  const { isLogin, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    skills: '',
    salary: '',
    experience: '',
    education: '',
    location: '',
    jobType: 'full-time',
    workMode: 'onsite',
    position: '',
    openings: '1',
    benefits: '',
    applicationDeadline: '',
    companyId: '',
  });

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(1);

  // Live tag previews
  const [reqTags, setReqTags] = useState([]);
  const [skillTags, setSkillTags] = useState([]);
  const [benefitTags, setBenefitTags] = useState([]);

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
      return;
    }
    if (role !== 'recruiter' && role !== 'admin') {
      setError('Only recruiters and admins can post jobs.');
      setPageLoading(false);
      return;
    }

    const fetchMyCompanies = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/company/getadmincompany`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const comps = res.data.allcompany || [];
        setCompanies(comps);
        if (comps.length === 1) {
          setFormData(prev => ({ ...prev, companyId: comps[0]._id }));
        }
      } catch (err) {
        setError('Could not load your companies. Please create one first.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchMyCompanies();
  }, [isLogin, role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');

    // Live tags
    if (name === 'requirements') setReqTags(value.split(',').map(t => t.trim()).filter(Boolean));
    if (name === 'skills') setSkillTags(value.split(',').map(t => t.trim()).filter(Boolean));
    if (name === 'benefits') setBenefitTags(value.split(',').map(t => t.trim()).filter(Boolean));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.companyId) {
      setError('Please select a company first');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requirements: reqTags,
        skills: skillTags,
        salary: formData.salary.trim(),
        experience: formData.experience.trim() || undefined,
        education: formData.education.trim() || undefined,
        location: formData.location.trim(),
        jobType: formData.jobType,
        workMode: formData.workMode,
        position: formData.position.trim(),
        openings: Number(formData.openings) || 1,
        benefits: benefitTags,
        applicationDeadline: formData.applicationDeadline || undefined,
        companyId: formData.companyId,
      };

      const res = await axios.post(
        `${config.API_BASE_URL}/jobs/createjob`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (res.data.success) {
        setSuccess('Job posted successfully!');
        setTimeout(() => navigate('/jobs'), 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step) => {
    if (step === 1) {
      return formData.title && formData.position && formData.description;
    }
    if (step === 2) {
      return formData.requirements && formData.skills;
    }
    if (step === 3) {
      return formData.salary && formData.location;
    }
    return true;
  };

  const goToStep = (step) => {
    if (step < activeStep || validateStep(activeStep)) {
      setActiveStep(step);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-teal-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BriefcaseIcon className="h-8 w-8 text-teal-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!isLogin || (role !== 'recruiter' && role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-slate-200 transform hover:scale-105 transition-all duration-300">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationCircleIcon className="h-12 w-12 text-rose-600" />
          </div>
          <h2 className="text-3xl font-bold text-rose-600 mb-4">Access Denied</h2>
          <p className="text-slate-600 mb-8 text-lg">This area is restricted to recruiters and administrators only.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-10 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-slate-600 hover:text-teal-600 transition-colors group"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-6 py-2 rounded-full text-sm font-medium mb-6">
            <BuildingOfficeIcon className="h-4 w-4" />
            Recruiter Dashboard
          </div>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Create New Job Opening
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Attract top talent with a clear and compelling job post
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 flex justify-center">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <button
                  onClick={() => goToStep(step)}
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-semibold transition-all ${
                    activeStep === step
                      ? 'bg-teal-600 text-white shadow-lg scale-110'
                      : step < activeStep
                      ? 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={step > activeStep && !validateStep(activeStep)}
                >
                  {step < activeStep ? '✓' : step}
                </button>
                {step < 3 && (
                  <div className={`w-16 h-1 rounded ${
                    step < activeStep ? 'bg-teal-600' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden backdrop-blur-sm backdrop-filter">
          <div className="p-10 lg:p-14">
            {/* Alerts */}
            {error && (
              <div className="mb-8 p-5 bg-rose-50 border-l-4 border-rose-500 text-rose-800 rounded-2xl flex items-center gap-4 animate-shake">
                <ExclamationCircleIcon className="h-6 w-6 flex-shrink-0" />
                <span className="flex-1">{error}</span>
                <button onClick={() => setError('')} className="text-rose-600 hover:text-rose-800">×</button>
              </div>
            )}

            {success && (
              <div className="mb-8 p-5 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 rounded-2xl flex items-center gap-4">
                <CheckCircleIcon className="h-6 w-6 flex-shrink-0" />
                <span className="flex-1">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Company Selection - Fixed Positioning */}
              <div className="bg-slate-50 p-8 rounded-2xl border-2 border-teal-100">
                <div className="flex items-center gap-3 mb-6">
                  <BuildingOfficeIcon className="h-6 w-6 text-teal-600" />
                  <h3 className="text-xl font-semibold text-slate-900">Select Company</h3>
                </div>
                
                <div className="relative">
                  <select
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all appearance-none text-slate-700 text-base"
                  >
                    <option value="" disabled>Choose a company for this job posting</option>
                    {companies.length === 0 ? (
                      <option value="" disabled>No companies available - Create one first</option>
                    ) : (
                      companies.map((comp) => (
                        <option key={comp._id} value={comp._id} className="py-2">
                          {comp.name} {comp.location ? `— ${comp.location}` : ''}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>

                {companies.length === 0 && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-amber-700">
                      You haven't created any companies yet. 
                      <Link to="/add-company" className="font-semibold underline hover:text-amber-800 ml-1">
                        Create your first company
                      </Link>
                    </p>
                  </div>
                )}
              </div>

              {/* Step 1: Job Basics */}
              {activeStep >= 1 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                      1
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Job Basics</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Job Title */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <BriefcaseIcon className="h-4 w-4" />
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Senior Frontend Developer"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <TagIcon className="h-4 w-4" />
                        Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Team Lead, Individual Contributor"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <BriefcaseIcon className="h-4 w-4" />
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                      className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-y"
                    />
                  </div>

                  {activeStep === 1 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        disabled={!validateStep(1)}
                        className={`px-8 py-3 rounded-xl text-white font-semibold transition-all ${
                          validateStep(1)
                            ? 'bg-teal-600 hover:bg-teal-700'
                            : 'bg-slate-300 cursor-not-allowed'
                        }`}
                      >
                        Next Step
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Requirements & Skills */}
              {activeStep >= 2 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                      2
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Requirements & Skills</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Requirements */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <WrenchScrewdriverIcon className="h-4 w-4" />
                        Requirements <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        required
                        placeholder="React, TypeScript, 4+ years experience (comma-separated)"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                      {reqTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl">
                          {reqTags.map((tag, i) => (
                            <span key={i} className="bg-teal-100 text-teal-800 px-3 py-1.5 rounded-lg text-sm font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <AcademicCapIcon className="h-4 w-4" />
                        Skills <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        required
                        onChange={handleChange}
                        placeholder="Next.js, Tailwind, Git (comma-separated)"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                      {skillTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl">
                          {skillTags.map((tag, i) => (
                            <span key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg text-sm font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <TagIcon className="h-4 w-4" />
                      Benefits
                    </label>
                    <input
                      type="text"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      placeholder="Health insurance, Remote work, 401k (comma-separated)"
                      className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    />
                    {benefitTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl">
                        {benefitTags.map((tag, i) => (
                          <span key={i} className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-sm font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {activeStep === 2 && (
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="px-8 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-all"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStep(3)}
                        disabled={!validateStep(2)}
                        className={`px-8 py-3 rounded-xl text-white font-semibold transition-all ${
                          validateStep(2)
                            ? 'bg-teal-600 hover:bg-teal-700'
                            : 'bg-slate-300 cursor-not-allowed'
                        }`}
                      >
                        Next Step
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Compensation & Details */}
              {activeStep >= 3 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                      3
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Compensation & Details</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Salary */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        Salary <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                        placeholder="₹80,000 - ₹120,000"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <MapPinIcon className="h-4 w-4" />
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="San Francisco, CA / Remote"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Job Type */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <BriefcaseIcon className="h-4 w-4" />
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white appearance-none"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>

                    {/* Work Mode */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <BuildingOfficeIcon className="h-4 w-4" />
                        Work Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="workMode"
                        value={formData.workMode}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white appearance-none"
                      >
                        <option value="onsite">On-site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    {/* Openings */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <TagIcon className="h-4 w-4" />
                        Openings
                      </label>
                      <input
                        type="number"
                        name="openings"
                        value={formData.openings}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Experience & Education */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Experience Required</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g., 3-5 years"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Education</label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="e.g., Bachelor's in Computer Science"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <CalendarIcon className="h-4 w-4" />
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    />
                  </div>

                  {activeStep === 3 && (
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="px-8 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-all"
                      >
                        Previous
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button - Always Visible at Bottom */}
              <div className="pt-8 border-t border-slate-200">
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading || companies.length === 0 || !validateStep(1) || !validateStep(2) || !validateStep(3)}
                    className={`
                      group relative px-16 py-5 rounded-2xl text-white font-bold text-xl transition-all transform hover:scale-105 active:scale-95
                      ${loading || companies.length === 0 || !validateStep(1) || !validateStep(2) || !validateStep(3)
                        ? 'bg-slate-400 cursor-not-allowed hover:scale-100'
                        : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl'}
                    `}
                  >
                    <span className="flex items-center gap-3">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <BriefcaseIcon className="h-6 w-6" />
                          Publish Job
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Card */}
        {formData.title && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Live Preview</h3>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-900">{formData.title}</h4>
                <p className="text-slate-600 mt-1">
                  {formData.position} • {formData.location || 'Location TBD'} • {formData.jobType}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {reqTags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                  {reqTags.length > 3 && (
                    <span className="text-slate-500 text-sm">+{reqTags.length - 3} more</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-600">{formData.salary || '₹'}</p>
                <p className="text-sm text-slate-500">{formData.workMode}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default PostJob;