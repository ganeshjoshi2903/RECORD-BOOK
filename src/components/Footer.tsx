import React from 'react';
import { BookOpen, Mail, Phone, MapPin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Record Book</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Simplifying business record management for entrepreneurs worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Features</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200">Status</a></li>
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-teal-400" />
                <span className="text-gray-400">hello@recordbook.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-teal-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span className="text-gray-400">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Record Book. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;