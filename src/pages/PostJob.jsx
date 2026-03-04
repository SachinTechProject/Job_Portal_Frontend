// src/pages/PostJob.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // adjust path

const PostJob = () => {
  const { isLogin, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    location: '',
    jobType: 'full-time',
    position: '',
    requirements: '',
    companyId: '',
  });

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        const res = await axios.get('http://localhost:5000/api/company/get-companys', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (res.data.success) {
          const comps = res.data.allcompany || [];
          setCompanies(comps);

          if (comps.length === 1) {
            setFormData((prev) => ({ ...prev, companyId: comps[0]._id }));
          }
        }
      } catch (err) {
        setError('Could not load your companies. Please try again.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchMyCompanies();
  }, [isLogin, role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.companyId) {
      setError('Please select a company');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        salary: formData.salary.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        position: formData.position.trim(),
        requirements: formData.requirements
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
        companyId: formData.companyId,
      };

      const res = await axios.post(
        'http://localhost:5000/api/jobs/createjob',
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (res.data.success) {
        setSuccess('Job posted successfully!');
        setTimeout(() => navigate('/jobs'), 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!isLogin || (role !== 'recruiter' && role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">
            This section is only available to recruiters and administrators.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">Post a New Job</h1>
            <p className="mt-3 text-blue-100">
              Create an attractive job opening for talented candidates
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-10">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center">
                <span className="text-xl mr-3">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg flex items-center">
                <span className="text-xl mr-3">✓</span>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  Company <span className="text-red-500 ml-1">*</span>
                </label>
                {companies.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    No companies found. Please create a company profile first.
                  </div>
                ) : (
                  <select
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                  >
                    <option value="">— Select Company —</option>
                    {companies.map((comp) => (
                      <option key={comp._id} value={comp._id}>
                        {comp.name} • {comp.location || 'No location'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Software Engineer, UI/UX Designer"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Describe responsibilities, qualifications, what the role offers..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 6 - 12 LPA"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Bengaluru, Remote, Hybrid"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requirements (comma separated) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  required
                  placeholder="React, TypeScript, Tailwind CSS, 3+ years experience, ..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Separate each skill/requirement with a comma
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || companies.length === 0}
                  className={`
                    w-full py-4 px-8 rounded-xl text-white font-semibold text-lg
                    transition-all duration-200 shadow-md
                    ${loading || companies.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg'
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                      </svg>
                      Posting...
                    </span>
                  ) : (
                    'Post Job'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;