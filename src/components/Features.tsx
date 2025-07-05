import React from 'react';
import { BookOpen, Users, TrendingUp, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Digital Record Keeping",
      description: "Transform your paper records into organized digital formats. Easy to search, update, and maintain.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Maintain detailed customer profiles with contact information, transaction history, and preferences.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Business Analytics",
      description: "Get detailed insights into your business performance with comprehensive reports and analytics.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security with encrypted storage and regular backups to keep your data safe.",
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your business records efficiently and grow your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;