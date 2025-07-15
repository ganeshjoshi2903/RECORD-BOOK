import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 overflow-hidden">
        
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.05
      }}></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full blur-3xl opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {}
          <div className="max-w-xl">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Digital</span>
              <br />
              <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                Record Book
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Manage your business records digitally. Track customers, 
              transactions, and grow your business efficiently.
            </p>
            
            <button className="group inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard 
              icon="📊"
              title="Digital Records"
              description="Keep all your business records organized digitally"
              gradient="from-teal-500 to-teal-600"
            />
            <FeatureCard 
              icon="👥"
              title="Customer Management"
              description="Track customers and their payment history"
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard 
              icon="📈"
              title="Business Reports"
              description="Get insights with detailed analytics"
              gradient="from-indigo-500 to-indigo-600"
            />
            <FeatureCard 
              icon="🔒"
              title="Secure & Safe"
              description="Your data is protected and backed up"
              gradient="from-emerald-500 to-emerald-600"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, gradient }: {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}) => (
  <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default Hero;