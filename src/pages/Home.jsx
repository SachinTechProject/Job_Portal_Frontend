import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ===================== HERO SECTION ===================== */}
      {/* ──────────────────────────────────────────────────────── */}
      {/* EXACTLY AS YOU PROVIDED – NO CHANGES AT ALL */}
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
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-gray-900 mb-4 text-center tracking-tight">
            Why JobPortal Stands Out
          </h2>
          <p className="text-xl text-gray-600 text-center mb-20 max-w-3xl mx-auto">
            Built differently — for people who actually want to get hired faster.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { num: "01", title: "Smart Job Matching", desc: "AI that actually understands your profile — not just keywords." },
              { num: "02", title: "Trusted Employers Only", desc: "Every company manually verified. Zero ghost jobs." },
              { num: "03", title: "One-Click Apply & Track", desc: "Apply in seconds. See exactly where you stand." },
            ].map((item) => (
              <div
                key={item.num}
                className="relative bg-gradient-to-br from-gray-50 to-white p-10 rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-400 group overflow-hidden hover:-translate-y-2"
              >
                <div className="absolute -top-12 -right-8 text-9xl font-black text-blue-50 group-hover:text-blue-100/80 transition-colors duration-500">
                  {item.num}
                </div>
                <h3 className="text-3xl font-extrabold text-gray-800 mb-5 relative z-10 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed relative z-10">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-black text-gray-900 mb-5">
            Get Hired in 3 Steps
          </h2>
          <p className="text-xl text-gray-700 mb-20">
            Simple, fast, effective — designed for real results
          </p>

          <div className="grid md:grid-cols-3 gap-16 lg:gap-24 relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-1/3 left-[16%] right-[16%] h-1.5 bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-300 rounded-full z-0"></div>

            {[
              { step: 1, title: "Create Profile", desc: "Add skills, experience & goals in under 5 minutes." },
              { step: 2, title: "Get Smart Matches", desc: "See roles that actually fit — no endless scrolling." },
              { step: 3, title: "Apply & Track", desc: "One-click apply. Real-time status & interview alerts." },
            ].map((item) => (
              <div key={item.step} className="relative z-10">
                <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-6xl font-black mb-10 shadow-2xl ring-8 ring-white/40 transform group-hover:rotate-6 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-6">{item.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed px-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POPULAR CATEGORIES ===================== */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-gray-900 mb-5 text-center">
            Popular Categories
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Find roles that match your skills — updated daily
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { cat: "IT & Software", jobs: "180+" },
              { cat: "Marketing & Sales", jobs: "140+" },
              { cat: "Finance & Accounting", jobs: "110+" },
              { cat: "Healthcare & Wellness", jobs: "95+" },
            ].map((item) => (
              <div
                key={item.cat}
                className="group bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-400 hover:-translate-y-3"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl font-bold flex items-center justify-center group-hover:scale-110 transition-transform duration-400 shadow-md">
                  {item.cat.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {item.cat}
                </h3>
                <p className="text-gray-600 mt-4 font-semibold text-lg">
                  {item.jobs} Jobs
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED OPPORTUNITIES ===================== */}
      
      

      {/* ===================== CALL TO ACTION ===================== */}
      <section className="py-28 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight drop-shadow-md">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-2xl mb-12 max-w-3xl mx-auto opacity-95">
            Join thousands of professionals who found better opportunities — start free today.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-700 px-16 py-7 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-gray-900 text-gray-400 py-14 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg">© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <div className="mt-8 flex justify-center gap-10 text-base flex-wrap">
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