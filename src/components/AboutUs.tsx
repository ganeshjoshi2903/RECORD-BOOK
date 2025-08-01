import React from 'react';

const AboutUs = () => {
  return (
    <section
      id="about" // 🔥 This enables scrollIntoView to work
      className="bg-gradient-to-br from-white to-sky-50 py-24 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-teal-600">Record Book</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering small businesses to go digital with a simple, secure, and powerful record management platform.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We aim to eliminate the hassle of traditional paper-based bookkeeping by offering an easy-to-use digital
              solution. Record Book helps business owners keep track of income, expenses, customers, and due payments — all from a secure, centralized platform.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Who Is It For?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Small and medium business owners</li>
              <li>Freelancers and service providers</li>
              <li>Retail shops and wholesalers</li>
              <li>Anyone who needs to track payments and records efficiently</li>
            </ul>
          </div>

          {/* Right Side */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-8 space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-teal-600 mb-2">Why Choose Record Book?</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>📒 Clean and organized digital record keeping</li>
                <li>⏰ Smart due tracking with payment reminders</li>
                <li>📊 Real-time business insights and summaries</li>
                <li>🔒 Fully secure and backed-up data</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-indigo-600 mb-2">Built with Modern Tech</h4>
              <p className="text-gray-700">
                React, Tailwind CSS, Node.js, MongoDB, and secure JWT-based authentication ensure smooth and safe performance.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-20 text-center">
          <blockquote className="text-xl italic text-gray-700 max-w-2xl mx-auto">
            “We believe that every business — big or small — deserves tools that are simple, powerful, and secure.”
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
