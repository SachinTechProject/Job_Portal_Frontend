import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ===================== HERO SECTION ===================== */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Discover Your Next <span className="text-blue-600">Career Opportunity</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto font-light">
            Connect with top companies, explore thousands of handpicked opportunities,
            and take the next step toward the career you deserve.
          </p>

          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-base font-medium">
            ⚡ Fast applications • AI-powered matching • 100% verified employers
          </p>

          <div className="mt-12 flex flex-col items-center gap-6">
            <button className="flex items-center justify-center gap-3 bg-white px-10 py-4 rounded-xl shadow hover:shadow-xl transition-all duration-300 border border-gray-200 w-full max-w-xs md:max-w-sm font-medium text-gray-700 hover:scale-[1.02]">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-6 h-6"
              />
              Continue with Google
            </button>

            <div className="flex items-center w-full max-w-xs md:max-w-sm">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs md:max-w-sm">
              <Link
                to="/login"
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold text-center hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="flex-1 border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-semibold text-center hover:bg-blue-50 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY JOBPORTAL STANDS OUT ===================== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Why JobPortal Stands Out
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            Built for job seekers who want faster, smarter, and more reliable opportunities.
          </p>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                num: "01",
                title: "Smart Job Matching",
                desc: "Our AI understands your skills, experience, and goals to suggest the best-fit roles — no endless scrolling.",
              },
              {
                num: "02",
                title: "Trusted Employers Only",
                desc: "Every company is verified. Say goodbye to ghost jobs and spam — focus on real opportunities.",
              },
              {
                num: "03",
                title: "One-Click Apply & Track",
                desc: "Apply instantly using your profile. Real-time status updates keep you in control.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-400 overflow-hidden hover:-translate-y-2"
              >
                <div className="absolute -top-10 -right-10 text-9xl font-black text-blue-100/40 group-hover:text-blue-100/70 transition-colors">
                  {item.num}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-5 relative z-10 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg relative z-10">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POPULAR CATEGORIES ===================== */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
            Explore Popular Categories
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { cat: "IT & Software", jobs: "180+" },
              { cat: "Marketing & Sales", jobs: "140+" },
              { cat: "Finance & Accounting", jobs: "110+" },
              { cat: "Healthcare & Wellness", jobs: "95+" },
            ].map((item) => (
              <div
                key={item.cat}
                className="group bg-white rounded-2xl p-8 text-center shadow hover:shadow-xl hover:-translate-y-3 transition-all duration-300 border border-gray-100 cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {item.cat.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {item.cat}
                </h3>
                <p className="text-gray-600 mt-3 font-medium group-hover:text-gray-800">
                  {item.jobs} Jobs Available
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED OPPORTUNITIES ===================== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
            Featured Opportunities
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16">
            Handpicked high-quality roles from leading companies — updated weekly
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Senior Frontend Developer (React + Next.js)", company: "TechNova", location: "Remote", salary: "$95k – $135k", tag: "Hot" },
              { title: "Growth Marketing Manager", company: "ScaleFast", location: "Bangalore Hybrid", salary: "$80k – $115k", tag: "New" },
              { title: "Lead Data Scientist – AI/ML", company: "InsightCore", location: "Hyderabad", salary: "$110k – $160k", tag: "Featured" },
            ].map((job, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 border border-gray-200 hover:border-blue-300 flex flex-col"
              >
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {job.tag}
                </div>
                <div className="p-7 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-3">
                    {job.title}
                  </h3>
                  <div className="text-gray-700 font-medium mb-2">{job.company}</div>
                  <div className="flex items-center gap-4 text-gray-600 mb-6">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="font-bold text-blue-700">{job.salary}</span>
                  </div>
                  <div className="mt-auto">
                    <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== GET STARTED IN 3 SIMPLE STEPS ===================== */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-16">
            Get Hired in 3 Simple Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-16 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full z-0"></div>

            {[
              {
                step: 1,
                title: "Create Your Profile",
                desc: "Sign up free and build your professional profile in minutes — add skills, experience & preferences.",
              },
              {
                step: 2,
                title: "Get Smart Matches",
                desc: "Browse personalized recommendations or search by role, salary, remote/hybrid, and more.",
              },
              {
                step: 3,
                title: "Apply & Stay Updated",
                desc: "One-click apply to dream jobs. Track status, get alerts, and land interviews faster.",
              },
            ].map((item) => (
              <div key={item.step} className="relative z-10">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-extrabold mb-8 shadow-xl ring-8 ring-blue-100">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-5">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed text-lg px-4 md:px-0">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CALL TO ACTION ===================== */}
      <section className="py-24 px-6 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
            Join thousands of professionals who found their next role through JobPortal — start today, it's free.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-12 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg">© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <div className="mt-6 flex justify-center gap-8 text-sm flex-wrap">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact Us</a>
            <a href="#" className="hover:text-white transition">About Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;