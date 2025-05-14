// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserAvatar } from '../../utils/avatarUtils';

const Header = () => {
  const { user, isAuthenticated, isVenueManager, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary font-medium' : '';
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">Holidaze</Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
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
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-200 flex items-center justify-center">
                          {user.name && getUserAvatar(user.name) ? (
                            <img 
                              src={getUserAvatar(user.name)} 
                              alt={user.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/200x200?text=' + (user.name.charAt(0).toUpperCase());
                              }}
                            />
                          ) : user.avatar ? (
                            <img 
                              src={user.avatar.url} 
                              alt={user.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/200x200?text=' + (user.name.charAt(0).toUpperCase());
                              }}
                            />
                          ) : (
                            <span className="text-[#505E64] font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/venues" 
                  className={`block hover:text-primary transition-colors ${isActive('/venues')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
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
                        onClick={() => setIsMobileMenuOpen(false)}
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
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {isVenueManager ? "Bookings" : "My Trips"}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile" 
                      className="block hover:text-primary transition-colors flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {user?.name && (
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-200 flex items-center justify-center">
                          {user.name && getUserAvatar(user.name) ? (
                            <img 
                              src={getUserAvatar(user.name)} 
                              alt={user.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/200x200?text=' + (user.name.charAt(0).toUpperCase());
                              }}
                            />
                          ) : user.avatar ? (
                            <img 
                              src={user.avatar.url} 
                              alt={user.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/200x200?text=' + (user.name.charAt(0).toUpperCase());
                              }}
                            />
                          ) : (
                            <span className="text-[#505E64] font-medium text-xs">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
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
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="block w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
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