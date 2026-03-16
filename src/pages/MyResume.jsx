// src/pages/MyResume.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // adjust path if needed
import { toast } from "react-hot-toast";
import config from '../config';


const MyResume = () => {
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeSection, setActiveSection] = useState('personal');

  // Loading states for actions
  const [personalLoading, setPersonalLoading] = useState(false);
  const [educationLoading, setEducationLoading] = useState(false);
  const [experienceLoading, setExperienceLoading] = useState(false);

  // Personal form
  const [personalForm, setPersonalForm] = useState({
    phoneNumber: '',
    dateOfBirth: '',
    currentLocation: '',
    linkedinUrl: '',
    githubUrl: '',
    professionalSummary: '',
    skills: '',
    certifications: '',
    preferredJobType: 'full-time',
    preferredLocation: '',
    expectedSalary: '',
    availability: '',
    portfolioUrl: '',
  });

  // Education form
  const [educationForm, setEducationForm] = useState({
    degree: '',
    field: '',
    university: '',
    year: '',
    gap: '',
    educationId: null,
  });

  // Experience form
  const [experienceForm, setExperienceForm] = useState({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    experienceId: null,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isLogin || !token) {
      navigate('/login');
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch Resume (personal)
        const resResume = await axios.get(`${config.API_BASE_URL}/resume/getResum`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resResume.data.resume) {
          setResume(resResume.data.resume);
          setPersonalForm({
            phoneNumber: resResume.data.resume.phoneNumber || '',
            dateOfBirth: resResume.data.resume.dateOfBirth
              ? new Date(resResume.data.resume.dateOfBirth).toISOString().split('T')[0]
              : '',
            currentLocation: resResume.data.resume.currentLocation || '',
            linkedinUrl: resResume.data.resume.linkedinUrl || '',
            githubUrl: resResume.data.resume.githubUrl || '',
            professionalSummary: resResume.data.resume.professionalSummary || '',
            skills: resResume.data.resume.skills?.join(', ') || '',
            certifications: resResume.data.resume.certifications?.join(', ') || '',
            preferredJobType: resResume.data.resume.preferredJobType || 'full-time',
            preferredLocation: resResume.data.resume.preferredLocation?.join(', ') || '',
            expectedSalary: resResume.data.resume.expectedSalary || '',
            availability: resResume.data.resume.availability || '',
            portfolioUrl: resResume.data.resume.portfolioUrl || '',
          });
        }

        // Fetch Educations
        const resEdu = await axios.get(`${config.API_BASE_URL}/education/getEducation`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEducations(resEdu.data.education || resEdu.data.educations || []);

        // Fetch Experiences
        const resExp = await axios.get(`${config.API_BASE_URL}/experience/getExperience`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExperiences(resExp.data.experience || resExp.data.experiences || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data');
        toast.error('Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [isLogin, token, navigate]);

  // ──────────────────────────────────────────────
  // Personal Info Handlers
  // ──────────────────────────────────────────────
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalForm((prev) => ({ ...prev, [name]: value }));
  };

  const savePersonalInfo = async (e) => {
    e.preventDefault();
    setError('');
    setPersonalLoading(true);

    try {
      const payload = {
        ...personalForm,
        skills: personalForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: personalForm.certifications.split(',').map((c) => c.trim()).filter(Boolean),
        preferredLocation: personalForm.preferredLocation.split(',').map((l) => l.trim()).filter(Boolean),
      };

      const res = await axios.post(`${config.API_BASE_URL}/resume/addResume`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        toast.success('Personal information saved successfully!');
        setResume(res.data.resume || res.data.data || resume);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save personal information';
      toast.error(msg);
      setError(msg);
    } finally {
      setPersonalLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Education Handlers
  // ──────────────────────────────────────────────
  const handleEducationChange = (e) => {
    setEducationForm({ ...educationForm, [e.target.name]: e.target.value });
  };

  const saveEducation = async (e) => {
    e.preventDefault();
    setError('');

    if (!educationForm.degree.trim() || !educationForm.field.trim() || !educationForm.university.trim()) {
      toast.error('Please fill in all required education fields');
      return;
    }

    setEducationLoading(true);

    try {
      const payload = { ...educationForm };
      let res;

      if (educationForm.educationId) {
        // Update
        res = await axios.put(
          `${config.API_BASE_URL}/education/update-education/${educationForm.educationId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data) {
          toast.success('Education updated successfully!');
          setEducations((prev) =>
            prev.map((item) =>
              item._id === educationForm.educationId ? { ...item, ...payload } : item
            )
          );
        }
      } else {
        // Create
        res = await axios.post(`${config.API_BASE_URL}/education/addEducation`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          
          const newEdu = res.data.education || res.data.data || payload;
          setEducations((prev) => [...prev, { ...newEdu, _id: newEdu._id || `temp-${Date.now()}` }]);
         
          console.log("this is edu", newEdu)
        }
         toast.success('Education added successfully!');
      }

      // Reset form
      setEducationForm({
        degree: '',
        field: '',
        university: '',
        year: '',
        gap: '',
        educationId: null,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not save education';
      toast.error(msg);
      setError(msg);
    } finally {
      setEducationLoading(false);
    }
  };

  const editEducation = (edu) => {
    setEducationForm({
      degree: edu.degree || '',
      field: edu.field || '',
      university: edu.university || '',
      year: edu.year || '',
      gap: edu.gap || '',
      educationId: edu._id,
    });
    setActiveSection('education');
  };

  // ──────────────────────────────────────────────
  // Experience Handlers
  // ──────────────────────────────────────────────
  const handleExperienceChange = (e) => {
    setExperienceForm({ ...experienceForm, [e.target.name]: e.target.value });
  };

  const saveExperience = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !experienceForm.jobTitle.trim() ||
      !experienceForm.company.trim() ||
      !experienceForm.location.trim() ||
      !experienceForm.startDate
    ) {
      toast.error('Please fill in all required experience fields');
      return;
    }

    setExperienceLoading(true);

    try {
      const payload = { ...experienceForm };
      let res;

      if (experienceForm.experienceId) {
        res = await axios.put(
          `${config.API_BASE_URL}experience/update-experience/${experienceForm.experienceId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data) {
          toast.success('Experience updated successfully!');
          setExperiences((prev) =>
            prev.map((item) =>
              item._id === experienceForm.experienceId ? { ...item, ...payload } : item
            )
          );
        }
      } else {
        res = await axios.post(`${config.API_BASE_URL}/experience/addExperience`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          toast.success('Experience added successfully!');
          const newExp = res.data.experience || res.data.data || payload;
          setExperiences((prev) => [...prev, { ...newExp, _id: newExp._id || `temp-${Date.now()}` }]);
        }
      }

      // Reset form
      setExperienceForm({
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        experienceId: null,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not save experience';
      toast.error(msg);
      setError(msg);
    } finally {
      setExperienceLoading(false);
    }
  };

  const editExperience = (exp) => {
    setExperienceForm({
      jobTitle: exp.jobTitle || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      description: exp.description || '',
      experienceId: exp._id,
    });
    setActiveSection('experience');
  };

  if (loading) {
    return <div className="text-center py-20 text-xl font-medium text-gray-600">Loading your profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile & Resume</h1>
        <p className="text-gray-600 mb-10">Make your profile stand out to recruiters</p>

        {/* {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            {error}
          </div>
        )} */}

        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-10 gap-2">
          {['personal', 'education', 'experience'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 font-medium text-sm md:text-base rounded-t-lg transition-colors ${
                activeSection === section
                  ? 'bg-white border border-b-0 border-gray-200 text-indigo-700 font-semibold'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              {section === 'personal' ? 'Personal Info' : section === 'education' ? 'Education' : 'Experience'}
            </button>
          ))}
        </div>

        {/* PERSONAL INFO */}
        {activeSection === 'personal' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Personal & Professional Details</h2>
            <form onSubmit={savePersonalInfo} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={personalForm.phoneNumber}
                    onChange={handlePersonalChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={personalForm.dateOfBirth}
                    onChange={handlePersonalChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                  <input
                    type="text"
                    name="currentLocation"
                    value={personalForm.currentLocation}
                    onChange={handlePersonalChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={personalForm.linkedinUrl}
                    onChange={handlePersonalChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={personalForm.githubUrl}
                    onChange={handlePersonalChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={personalForm.portfolioUrl}
                    onChange={handlePersonalChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                <textarea
                  name="professionalSummary"
                  value={personalForm.professionalSummary}
                  onChange={handlePersonalChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell recruiters about your strengths, experience, and career goals..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={personalForm.skills}
                  onChange={handlePersonalChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="React, JavaScript, Node.js, MongoDB, UI/UX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications (comma separated)</label>
                <input
                  type="text"
                  name="certifications"
                  value={personalForm.certifications}
                  onChange={handlePersonalChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="AWS Certified Developer, Google UX Design, ..."
                />
              </div>

              <button
                type="submit"
                disabled={personalLoading}
                className={`mt-4 px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg shadow-md transition ${
                  personalLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-indigo-800'
                }`}
              >
                {personalLoading ? 'Saving...' : 'Save Personal Info'}
              </button>
            </form>
          </div>
        )}

        {/* EDUCATION SECTION */}
        {activeSection === 'education' && (
          <div className="space-y-10">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="text-3xl">🎓</span> Add / Update Education
              </h2>
              <form onSubmit={saveEducation} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree / Qualification *</label>
                    <input
                      type="text"
                      name="degree"
                      value={educationForm.degree}
                      onChange={handleEducationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Bachelor of Technology"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study *</label>
                    <input
                      type="text"
                      name="field"
                      value={educationForm.field}
                      onChange={handleEducationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Computer Science & Engineering"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">University / Institution *</label>
                    <input
                      type="text"
                      name="university"
                      value={educationForm.university}
                      onChange={handleEducationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Jawaharlal Nehru Technological University"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passing</label>
                      <input
                        type="number"
                        name="year"
                        value={educationForm.year}
                        onChange={handleEducationChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="2024"
                        min="1950"
                        max={new Date().getFullYear() + 2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gap (optional)</label>
                      <input
                        type="text"
                        name="gap"
                        value={educationForm.gap}
                        onChange={handleEducationChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g. 1 year for preparation"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={educationLoading}
                  className={`mt-6 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg shadow-md transition ${
                    educationLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-700 hover:to-green-800'
                  }`}
                >
                  {educationLoading
                    ? 'Saving...'
                    : educationForm.educationId
                    ? 'Update Education'
                    : 'Add Education'}
                </button>
              </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-2xl">📚</span> Education History
              </h3>
              {educations.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                  No education entries yet. Add your qualifications above!
                </div>
              ) : (
                <div className="space-y-10">
                  {educations.map((edu) => (
                    <div
                      key={edu._id}
                      className="relative pl-8 pb-10 border-l-2 border-indigo-100 last:pb-0 group hover:border-indigo-300 transition-colors"
                    >
                      <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 group-hover:bg-indigo-600 transition" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {edu.degree} {edu.field && <span className="text-gray-600">• {edu.field}</span>}
                          </h4>
                          <p className="text-gray-700 font-medium mt-1">{edu.university}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {edu.year || 'Year not specified'}
                            {edu.gap && <span className="ml-3 text-amber-700">• Gap: {edu.gap}</span>}
                          </p>
                        </div>
                        <button
                          onClick={() => editEducation(edu)}
                          className="text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded hover:bg-indigo-50 transition text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EXPERIENCE SECTION */}
        {activeSection === 'experience' && (
          <div className="space-y-10">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="text-3xl">💼</span> Add / Update Work Experience
              </h2>
              <form onSubmit={saveExperience} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={experienceForm.jobTitle}
                      onChange={handleExperienceChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Frontend Developer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                    <input
                      type="text"
                      name="company"
                      value={experienceForm.company}
                      onChange={handleExperienceChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="TechCorp Solutions"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={experienceForm.location}
                      onChange={handleExperienceChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Hyderabad, Telangana"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={experienceForm.startDate}
                        onChange={handleExperienceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={experienceForm.endDate}
                        onChange={handleExperienceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description / Responsibilities</label>
                  <textarea
                    name="description"
                    value={experienceForm.description}
                    onChange={handleExperienceChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="• Led frontend development using React...&#10;• Improved performance by 40%..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={experienceLoading}
                  className={`mt-6 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg shadow-md transition ${
                    experienceLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-700 hover:to-green-800'
                  }`}
                >
                  {experienceLoading
                    ? 'Saving...'
                    : experienceForm.experienceId
                    ? 'Update Experience'
                    : 'Add Experience'}
                </button>
              </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-2xl">🗓️</span> Work Experience
              </h3>
              {experiences.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                  No work experience added yet. Start building your career story!
                </div>
              ) : (
                <div className="space-y-10">
                  {experiences.map((exp) => (
                    <div
                      key={exp._id}
                      className="relative pl-8 pb-10 border-l-2 border-blue-100 last:pb-0 group hover:border-blue-300 transition-colors"
                    >
                      <div className="absolute left-[-9px] top-2 w-4 h-4 rounded-full bg-blue-500 group-hover:bg-blue-600 transition" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h4>
                          <p className="text-gray-700 font-medium mt-1">
                            {exp.company}
                            {exp.location && <span className="text-gray-500 ml-2">• {exp.location}</span>}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {exp.startDate
                              ? new Date(exp.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                              : 'N/A'}{' '}
                            —{' '}
                            {exp.endDate
                              ? new Date(exp.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                              : 'Present'}
                          </p>
                          {exp.description && (
                            <div className="mt-4 text-gray-700 text-sm leading-relaxed">
                              {exp.description.split('\n').map(
                                (line, i) =>
                                  line.trim() && (
                                    <p key={i} className="mb-1">
                                      • {line.trim()}
                                    </p>
                                  )
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => editExperience(exp)}
                          className="text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded hover:bg-indigo-50 transition text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResume;