import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ import this

const Hero = () => {
  const navigate = useNavigate(); // ✅ initialize

  const handleGetStarted = () => {
    navigate('/login'); // ✅ go to login page
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 overflow-hidden">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      {/* Decorative Blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-teal-300 to-blue-400 rounded-full blur-[150px] opacity-30 z-0 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full blur-[150px] opacity-30 z-0 animate-pulse"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-gray-900">
              Digital
              <br />
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                Record Book
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Keep your business organized with smart digital records.
              Manage customers, track transactions, and grow with ease.
            </p>
            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Right Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              icon="📊"
              title="Digital Records"
              description="Keep all your business records organized digitally."
              gradient="from-teal-500 to-teal-600"
            />
            <FeatureCard
              icon="👥"
              title="Customer Management"
              description="Track customers and their payment history."
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon="📈"
              title="Business Reports"
              description="Get insights with detailed analytics."
              gradient="from-indigo-500 to-indigo-600"
            />
            <FeatureCard
              icon="🔒"
              title="Secure & Safe"
              description="Your data is protected and backed up securely."
              gradient="from-emerald-500 to-emerald-600"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  gradient,
}) => (
  <div className="group bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white">
    <div
      className={`w-12 h-12 bg-gradient-to-br ${gradient} text-white text-xl rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-md`}
    >
      <span>{icon}</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Hero;
