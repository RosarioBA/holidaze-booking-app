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
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 border-t pt-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className={`block hover:text-primary transition-colors ${isActive('/')}`}
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/venues" 
                  className={`block hover:text-primary transition-colors ${isActive('/venues')}`}
                  onClick={closeMobileMenu}
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
                        className={`block hover:text-primary transition-colors ${isActive('/venue-manager/dashboard')}`}
                        onClick={closeMobileMenu}
                      >
                        Manage Venues
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link 
                      to={isVenueManager ? "/venue-manager/bookings" : "/customer/trips"}
                      className={`block hover:text-primary transition-colors ${
                        isActive(isVenueManager ? "/venue-manager/bookings" : "/customer/trips")
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {isVenueManager ? "Bookings" : "My Trips"}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile" 
                      className="block hover:text-primary transition-colors flex items-center"
                      onClick={closeMobileMenu}
                    >
                      {user?.name && (
                        <div className="mr-2">
                          <UserAvatar
                            avatarUrl={avatarUrl}
                            userName={user.name}
                            size={24}
                            useUiAvatars={true}
                          />
                        </div>
                      )}
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="w-full text-left block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
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
                      className={`block hover:text-primary transition-colors ${isActive('/login')}`}
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="block w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors text-center"
                      onClick={closeMobileMenu}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;