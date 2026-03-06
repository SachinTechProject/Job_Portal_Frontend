// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import {
  CameraIcon,
  DocumentArrowUpIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: [],                // we will join to string before sending
    profilePicture: '',        // URL
    resumeOriginalName: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [newSkill, setNewSkill] = useState('');

  // Load profile data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await axios.get(`${config.API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const user = data.user || data; // handle both {user: {...}} and direct {...}

      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills || [],
        profilePicture: user.profile?.profilePicture || '',
        resumeOriginalName: user.profile?.resumeOriginalName || '',
      });

      setPreviewImage(user.profile?.profilePicture || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedProfilePic(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setSelectedResume(file);
    setFormData((prev) => ({ ...prev, resumeOriginalName: file.name }));
    setError('');
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const trimmed = newSkill.trim();
    if (!formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
    setNewSkill('');
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const formDataToSend = new FormData();

      // Text fields (backend expects these)
      formDataToSend.append('fullName', formData.fullName || '');
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('phoneNumber', formData.phoneNumber || '');
      formDataToSend.append('bio', formData.bio || '');

      // Skills → send as comma-separated string (matches your backend .split(","))
      if (formData.skills.length > 0) {
        formDataToSend.append('skills', formData.skills.join(','));
      }

      // Files
      if (selectedProfilePic) {
        formDataToSend.append('profilePicture', selectedProfilePic);
      }
      if (selectedResume) {
        formDataToSend.append('resume', selectedResume);
      }

      console.log('Sending to:', `${config.API_BASE_URL}/users/profile/update`);
      console.log('FormData entries:', [...formDataToSend.entries()]);

      const res = await axios.post(
        `${config.API_BASE_URL}/users/profile/update`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Let axios set Content-Type multipart/form-data automatically
          },
        }
      );

      console.log('Update success:', res.data);

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setSelectedProfilePic(null);
      setSelectedResume(null);

      // Refresh data from server
      await fetchProfile();

    } catch (err) {
      console.error('Profile update failed:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to update profile';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-8 py-12 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={previewImage || 'https://via.placeholder.com/128?text=Profile'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 p-2.5 rounded-full cursor-pointer hover:bg-indigo-700 shadow-md">
                  <CameraIcon className="h-6 w-6 text-white" />
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{formData.fullName || 'Your Name'}</h1>
              <p className="text-indigo-100 mt-1">{formData.email}</p>
              <p className="text-indigo-200 mt-2 text-sm">
                {formData.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Edit / Save controls */}
            <div className="flex items-center justify-between border-b pb-5">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <PencilIcon className="h-7 w-7 text-indigo-600" />
                Edit Profile
              </h2>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <PencilIcon className="h-5 w-5" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedProfilePic(null);
                      setSelectedResume(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-7 py-2.5 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-60 transition ${
                      loading ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Saving...' : <>Save <CheckIcon className="h-5 w-5" /></>}
                  </button>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 disabled:bg-gray-100 disabled:text-gray-600 transition"
                />
                <label htmlFor="fullName" className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 disabled:bg-gray-100 disabled:text-gray-600 transition"
                />
                <label htmlFor="email" className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                  Email Address
                </label>
              </div>

              <div className="relative">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 disabled:bg-gray-100 disabled:text-gray-600 transition"
                />
                <label htmlFor="phoneNumber" className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs pointer-events-none">
                  Phone Number
                </label>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 disabled:bg-gray-100 transition"
                placeholder="Tell something about yourself..."
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add skill (press Enter)"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume</label>
              {formData.resumeOriginalName && !selectedResume && (
                <p className="text-sm text-gray-600 mb-2">
                  Current file: <strong>{formData.resumeOriginalName}</strong>
                </p>
              )}

              {isEditing && (
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition">
                  <DocumentArrowUpIcon className="h-6 w-6 text-gray-500" />
                  <span className="text-gray-700">
                    {selectedResume ? selectedResume.name : 'Upload Resume (PDF, max 5MB)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Save button */}
            {isEditing && (
              <div className="pt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-10 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow hover:bg-indigo-700 transition disabled:opacity-60 ${
                    loading ? 'cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
                >
                  {loading ? 'Updating Profile...' : 'Save Profile'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;