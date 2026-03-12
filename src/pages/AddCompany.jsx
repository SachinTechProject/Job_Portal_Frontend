// src/pages/AddCompany.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddCompany = () => {
  const { isLogin, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    location: '',
    address: '',
    description: '',
    industry: '',
    companySize: '',
    foundedYear: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
      return;
    }
    if (role !== 'recruiter' && role !== 'admin') {
      setError('Only recruiters and admins can register companies.');
    }
  }, [isLogin, role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Required fields (matching your backend required: true)
    if (!formData.name.trim()) {
      setError('Company name is required');
      setLoading(false);
      return;
    }
    if (!formData.website.trim()) {
      setError('Website is required');
      setLoading(false);
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        website: formData.website.trim(),
        location: formData.location.trim(),
      };

      // Optional fields — only include if filled
      if (formData.description?.trim()) payload.description = formData.description.trim();
      if (formData.industry?.trim()) payload.industry = formData.industry.trim();
      if (formData.companySize?.trim()) payload.companySize = formData.companySize.trim();
      if (formData.foundedYear) payload.foundedYear = Number(formData.foundedYear);
      // address is not in schema → backend ignores it (you can remove the field if you want)

      const res = await axios.post(
        'http://localhost:5000/api/company/register-company',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data?.success || res.status === 201) {
        setSuccess('Company successfully registered!');
        setTimeout(() => {
          navigate('/companies');
        }, 1400);
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to register company. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isLogin || (role !== 'recruiter' && role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white border border-gray-300 max-w-md w-full p-10 text-center">
          <h2 className="text-3xl font-bold text-red-700 mb-5">Access Restricted</h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            This area is available only for recruiter and admin accounts.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-10 py-4 font-medium hover:bg-gray-800 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left column - Info */}
          <div className="lg:col-span-4">
            <div className="sticky top-12">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-6">
                Register<br />Company
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Complete the form to add your organization to the platform. 
                Verified companies can post jobs and manage applications.
              </p>

              <div className="space-y-6 text-sm text-gray-500">
                <div>
                  <div className="font-medium text-gray-700">Required fields</div>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1">
                    <li>Company name</li>
                    <li>Website</li>
                    <li>Location</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-gray-700">After submission</div>
                  <p className="mt-1.5">
                    Profile will be reviewed (usually 24–48 hours).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form (no logo section anymore) */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-200 p-10 lg:p-14">
              {error && (
                <div className="mb-10 p-5 bg-red-50 border border-red-200 text-red-800">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-10 p-5 bg-green-50 border border-green-200 text-green-800">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 border border-gray-300 focus:border-black focus:ring-0 outline-none transition"
                      placeholder="Legal name or brand name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website *
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 border border-gray-300 focus:border-black focus:ring-0 outline-none transition"
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City / Region *
                    </label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 border border-gray-300 focus:border-black focus:ring-0 outline-none transition"
                      placeholder="e.g. Hyderabad, Telangana"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 border border-gray-300 focus:border-black focus:ring-0 outline-none transition"
                      placeholder="YYYY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-5 py-3.5 border border-gray-300 focus:border-black focus:ring-0 outline-none transition resize-y"
                    placeholder="What does your company do? (2–4 sentences)"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 border border-gray-300 focus:border-black focus:ring-0 outline-none bg-white transition"
                    >
                      <option value="">— Select —</option>
                      <option value="IT Services">IT Services & Consulting</option>
                      <option value="Software Product">Software Product</option>
                      <option value="Finance">Financial Services</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail / E-commerce</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 border border-gray-300 focus:border-black focus:ring-0 outline-none bg-white transition"
                    >
                      <option value="">— Select —</option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="201-500">201–500</option>
                      <option value="501+">501+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registered / Head Office Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-5 py-3.5 border border-gray-300 focus:border-black focus:ring-0 outline-none transition resize-y"
                    placeholder="Full postal address"
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full md:w-auto px-12 py-4 font-medium text-white transition ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Submit Company Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;