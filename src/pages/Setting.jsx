// src/pages/Settings.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldExclamationIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext'; // adjust path to your context

const Settings = () => {
  const { user, isLogin, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, [isLogin, navigate]);

  // ────────────────────────────────────────────────
  //  Profile Section
  // ────────────────────────────────────────────────
  const ProfileSection = () => {
    const [form, setForm] = useState({
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
    });

    const handleSave = async (e) => {
      e.preventDefault();
      // Add your API call here later
      setMessage({ type: 'success', text: 'Profile updated (demo)' });
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <UserCircleIcon className="h-10 w-10 text-indigo-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            <p className="text-sm text-gray-500 mt-1">Update your basic details</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            Save Changes
          </button>
        </form>
      </div>
    );
  };

  // ────────────────────────────────────────────────
  //  Password Section
  // ────────────────────────────────────────────────
  const PasswordSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <KeyIcon className="h-10 w-10 text-indigo-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
          <p className="text-sm text-gray-500 mt-1">Keep your account secure</p>
        </div>
      </div>

      <div className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>

        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
          Update Password
        </button>
      </div>
    </div>
  );

  // ────────────────────────────────────────────────
  //  Notifications Section
  // ────────────────────────────────────────────────
  const NotificationSection = () => {
    const [settings, setSettings] = useState({
      emailApplications: true,
      emailRecommendations: true,
      inAppMessages: true,
      pushEnabled: true,
    });

    const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <BellIcon className="h-10 w-10 text-indigo-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">Control what you want to be notified about</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-base font-medium text-gray-800">Email Notifications</h4>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={settings.emailApplications}
                onChange={() => toggle('emailApplications')}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="font-medium text-gray-800">New job applications</p>
                <p className="text-sm text-gray-500">When someone applies to your postings</p>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={settings.emailRecommendations}
                onChange={() => toggle('emailRecommendations')}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="font-medium text-gray-800">Job recommendations</p>
                <p className="text-sm text-gray-500">Weekly job suggestions</p>
              </div>
            </label>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-base font-medium text-gray-800">In-app & Push</h4>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={settings.inAppMessages}
                onChange={() => toggle('inAppMessages')}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="font-medium text-gray-800">New messages & updates</p>
                <p className="text-sm text-gray-500">In-app alerts</p>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={settings.pushEnabled}
                onChange={() => toggle('pushEnabled')}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="font-medium text-gray-800">Push notifications</p>
                <p className="text-sm text-gray-500">On mobile / browser</p>
              </div>
            </label>
          </div>

          <div className="pt-6">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────────
  //  Account Section
  // ────────────────────────────────────────────────
  const AccountSection = () => {
    const handleLogoutAll = () => {
      setMessage({ type: 'success', text: 'Logged out from all devices (demo)' });
    };

    const handleDelete = () => {
      if (window.confirm('Are you sure? This action cannot be undone.')) {
        setMessage({ type: 'success', text: 'Account deletion requested (demo)' });
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <ShieldExclamationIcon className="h-10 w-10 text-indigo-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Account Management</h3>
            <p className="text-sm text-gray-500 mt-1">Control your account security & status</p>
          </div>
        </div>

        <div className="space-y-6 divide-y divide-gray-100">
          <div className="pt-4">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-gray-800">Active Sessions</p>
                <p className="text-sm text-gray-500">Log out from all other devices</p>
              </div>
              <button
                onClick={handleLogoutAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Log out everywhere
              </button>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-red-700">Delete Account</p>
                <p className="text-sm text-gray-500">Permanently remove your account</p>
              </div>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────────
  //  Company Section (recruiter/admin only)
  // ────────────────────────────────────────────────
  const CompanySection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <BuildingOfficeIcon className="h-10 w-10 text-indigo-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Company Settings</h3>
          <p className="text-sm text-gray-500 mt-1">Manage company profile & preferences</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          You can update company name, logo, website, description, location, etc. here.
        </p>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
          Edit Company Profile
        </button>
      </div>
    </div>
  );

  // ────────────────────────────────────────────────
  //  Tabs Configuration
  // ────────────────────────────────────────────────
  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'password', label: 'Password', icon: KeyIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'account', label: 'Account', icon: ShieldExclamationIcon },
  ];

  if (role === 'recruiter' || role === 'admin') {
    tabs.splice(3, 0, { id: 'company', label: 'Company', icon: BuildingOfficeIcon });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-lg text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <nav className="flex flex-wrap border-b border-gray-200 px-4 md:px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Messages */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? '✓' : '!'} {message.text}
          </div>
        )}

        {/* Tab Content - all sections properly defined and rendered */}
        {activeTab === 'profile' && <ProfileSection />}
        {activeTab === 'password' && <PasswordSection />}
        {activeTab === 'notifications' && <NotificationSection />}
        {activeTab === 'account' && <AccountSection />}
        {(role === 'recruiter' || role === 'admin') && activeTab === 'company' && <CompanySection />}
      </div>
    </div>
  );
};

export default Settings;