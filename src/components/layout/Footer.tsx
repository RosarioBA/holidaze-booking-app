// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#1B2B34] text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div>
            <h2 className="text-2xl font-bold mb-4">HOLIDAZE</h2>
            <p className="text-gray-400 mb-4">
              Find your perfect stay in Norway. From cozy cabins to modern apartments.
            </p>
          </div>
          
          {/* Explore Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/venues" className="text-gray-400 hover:text-white transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/venues?featured=true" className="text-gray-400 hover:text-white transition-colors">
                  Featured Stays
                </Link>
              </li>
              <li>
                <Link to="/venues" className="text-gray-400 hover:text-white transition-colors">
                  Cities
                </Link>
              </li>
              <li>
                <Link to="/venues" className="text-gray-400 hover:text-white transition-colors">
                  Experiences
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Host Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Host</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-white transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Support Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <li>
              <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Holidaze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;