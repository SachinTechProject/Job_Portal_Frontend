// src/pages/NotFound.jsx  (or src/components/NotFound.jsx)
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full text-center">
        {/* 404 Big Number */}
        <h1 className="text-9xl font-extrabold text-gray-200 sm:text-[12rem] md:text-[14rem] tracking-tight">
          404
        </h1>

        {/* Main Message */}
        <div className="mt-[-4rem] sm:mt-[-6rem] relative">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Page Not Found
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Helpful text */}
        <p className="mt-6 text-gray-500">
          You might have mistyped the URL or the page may have been removed.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
          >
            Go to Home
          </Link>

          <Link
            to="/jobs"
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Optional fun element / illustration */}
        <div className="mt-12 opacity-70">
          <svg
            className="w-48 h-48 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;