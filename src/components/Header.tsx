// src/components/Header.tsx
import React from 'react';
import { BookOpen, LogIn, UserPlus, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  if (isDashboardRoute) return null;

  const handleScrollLink = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToHome = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Record Book</span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={goToHome}
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => handleScrollLink('features')}
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium"
              >
                Features
              </button>
              <button
                onClick={() => handleScrollLink('about')}
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium"
              >
                About
              </button>
            </nav>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>

            <Link
              to="/signup"
              className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
