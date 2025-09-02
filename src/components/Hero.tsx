import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 overflow-hidden">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
          backgroundSize: '25px 25px',
        }}
      ></div>

      {/* Decorative Blobs */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 120, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-300 to-blue-400 rounded-full blur-[200px] opacity-30 z-0"
      ></motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full blur-[200px] opacity-30 z-0"
      ></motion.div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-xl space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
            >
              Digital <br />
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                Record Book
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Keep your business organized with smart digital records. Manage
              customers, track transactions, and grow your business effortlessly.
            </motion.p>
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              onClick={handleGetStarted}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
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
              description="Track customers and their payment history efficiently."
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon="⏰"
              title="Due Tracker"
              description="Never miss payments with smart due reminders."
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

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
  gradient: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  gradient,
}) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className="group bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl"
  >
    <div
      className={`w-14 h-14 bg-gradient-to-br ${gradient} text-white text-2xl rounded-xl flex items-center justify-center mb-4 shadow-md`}
    >
      <span>{icon}</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

export default Hero;
