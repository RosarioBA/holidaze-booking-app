/**
 * @file Header.tsx
 * @description Main navigation header component with responsive design
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from '../common/UserAvatar';
import useMobileMenu from '../../hooks/useMobileMenu';
import useAvatar from '../../hooks/UseAvatar';

/**
 * Main header component with responsive navigation
 * Adapts display based on authentication status and user role
 * 
 * @returns {JSX.Element} Rendered header component
 */
const Header: React.FC = () => {
  const { user, isAuthenticated, isVenueManager, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, toggleMobileMenu, closeMobileMenu] = useMobileMenu('header-mobile-menu');
  const avatarUrl = useAvatar(user);
  
  /**
   * Determines if a navigation link is active based on current path
   * 
   * @param {string} path - Path to check against current location
   * @returns {string} CSS class for active state or empty string
   */
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary font-medium' : '';
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold font-averia">HOLIDAZE</Link>
          
          {/* Mobile Menu Button */}
          <button 
            id="header-mobile-menu"
            type="button"
            className="md:hidden text-gray-600"
            onClick={() => toggleMobileMenu()}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              <li>
                <Link 
                  to="/" 
                  className={`hover:text-primary transition-colors ${isActive('/')}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/venues" 
                  className={`hover:text-primary transition-colors ${isActive('/venues')}`}
                >
                  Venues
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  {isVenueManager && (
                    <li>
                      <Link 
                        to="/venue-manager/dashboard" 
                        className={`hover:text-primary transition-colors ${isActive('/venue-manager/dashboard')}`}
                      >
                        Manage Venues
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link 
                      to={isVenueManager ? "/venue-manager/bookings" : "/customer/trips"}
                      className={`hover:text-primary transition-colors ${
                        isActive(isVenueManager ? "/venue-manager/bookings" : "/customer/trips")
                      }`}
                    >
                      {isVenueManager ? "Bookings" : "My Trips"}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile" 
                      className="hover:text-primary transition-colors flex items-center"
                    >
                      {user?.name && (
                        <div className="mr-2">
                          <UserAvatar
                            avatarUrl={avatarUrl}
                            userName={user.name}
                            size={32}
                            useUiAvatars={true}
                          />
                        </div>
                      )}
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className={`hover:text-primary transition-colors ${isActive('/login')}`}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        
       {/* Mobile Navigation - Logged Out Version Only */}
       {isMobileMenuOpen && (
          <nav className="md:hidden mt-6 bg-gray-50 -mx-4 px-4 py-6 rounded-lg shadow-inner">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`flex items-center px-4 py-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 ${
                    isActive('/') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/venues" 
                  className={`flex items-center px-4 py-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 ${
                    isActive('/venues') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Venues
                </Link>
              </li>
              
              {/* Divider for auth links */}
              <li className="border-t border-gray-200 pt-3 mt-4"></li>
              
              <li>
                <Link 
                  to="/login" 
                  className={`flex items-center px-4 py-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 ${
                    isActive('/login') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="flex items-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-sm"
                  onClick={closeMobileMenu}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;