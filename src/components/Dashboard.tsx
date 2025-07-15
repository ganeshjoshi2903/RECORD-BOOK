import React from 'react';
import { BookOpen, Users, TrendingUp, Shield } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Digital Records',
    description: 'Keep all your business records organized digitally',
    color: 'bg-teal-100 text-teal-700'
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Track customers and their payment history',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    icon: TrendingUp,
    title: 'Business Reports',
    description: 'Get insights with detailed analytics',
    color: 'bg-indigo-100 text-indigo-700'
  },
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Your data is protected and backed up',
    color: 'bg-green-100 text-green-700'
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Welcome to Your Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl shadow-md flex items-start space-x-4 transition-transform hover:scale-[1.02]"
          >
            <div className={`p-3 rounded-lg ${feature.color}`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
