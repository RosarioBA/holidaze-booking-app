// src/components/layout/VenueManagerLayout.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface VenueManagerLayoutProps {
  children: ReactNode;
}

const VenueManagerLayout: React.FC<VenueManagerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const AVATAR_STORAGE_KEY = user ? `holidaze_avatar_url_${user.name}_manager` : 'holidaze_avatar_url_default';
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | undefined>(user?.avatar?.url);

  // Check for saved avatar URL whenever the component renders
  useEffect(() => {
    const checkForAvatar = () => {
      const savedAvatarUrl = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (savedAvatarUrl) {
        setCurrentAvatarUrl(savedAvatarUrl);
      } else if (user?.avatar?.url) {
        setCurrentAvatarUrl(user.avatar.url);
      } else {
        setCurrentAvatarUrl(undefined);
      }
    };
    
    checkForAvatar();
    
    // Setup an event listener for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AVATAR_STORAGE_KEY) {
        checkForAvatar();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, AVATAR_STORAGE_KEY]);

  // Close mobile menu if clicking outside or navigating
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMobileMenuOpen && e.target instanceof HTMLElement) {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(e.target) && e.target.id !== 'mobile-menu-button') {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMobileMenuOpen]);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-[#13262F]' : '';
  };

  // Switch to customer dashboard
  const switchToCustomer = () => {
    navigate('/customer/dashboard');
  };

  return (
    <div className="flex">
      {/* Mobile menu toggle and header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-md p-4 flex justify-between items-center">
        <Link to="/venue-manager/dashboard" className="font-bold text-lg font-averia">
          HOLIDAZE <span className="text-sm text-gray-500">Manager</span>
        </Link>
        <div className="flex items-center">
          <Link to="/profile" className="mr-4 flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 overflow-hidden">
              {currentAvatarUrl ? (
                <img 
                  src={currentAvatarUrl} 
                  alt={user?.name || "User avatar"}
                  className="w-8 h-8 rounded-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${user?.name?.charAt(0) || 'U'}&background=random`;
                  }}
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
          </Link>
          <button
            id="mobile-menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="text-gray-600 focus:outline-none"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#13262F] text-white h-screen fixed left-0 top-0">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-bold tracking-widest uppercase font-averia">HOLIDAZE MANAGER</h2>
        </div>
        <div className="flex flex-col h-full">
          <nav className="py-4">
            <Link 
              to="/venue-manager/dashboard" 
              className={`block py-3 px-6 ${isActive('/venue-manager/dashboard')} hover:bg-[#0081A7] transition duration-200`}
            >
              Dashboard
            </Link>
            <Link 
              to="/venue-manager/venues" 
              className={`block py-3 px-6 ${isActive('/venue-manager/venues')} hover:bg-[#0081A7] transition duration-200`}
            >
              My Venues
            </Link>
            <Link 
              to="/venue-manager/bookings" 
              className={`block py-3 px-6 ${isActive('/venue-manager/bookings')} hover:bg-[#0081A7] transition duration-200`}
            >
              Bookings
            </Link>
            <Link 
              to="/venue-manager/create" 
              className={`block py-3 px-6 mb-4 ${isActive('/venue-manager/create')} hover:bg-[#0081A7] transition duration-200`}
            >
              Create New Venue
            </Link>
            
            <div className="my-4 border-t border-gray-700"></div>
            
            <Link 
              to="/venues" 
              className="block py-3 px-6"
            >
              <div className="w-full bg-[#0081A7] text-white py-2 text-center font-medium rounded hover:bg-[#0081A7]/90 transition duration-200">
                EXPLORE VENUES
              </div>
            </Link>
            
            <div className="my-4 border-t border-gray-700"></div>
            
            <Link 
              to="/profile" 
              className={`block py-3 px-6 ${isActive('/profile')} hover:bg-[#0081A7] transition duration-200`}
            >
              Profile
            </Link>
            <Link 
              to="/settings" 
              className={`block py-3 px-6 ${isActive('/settings')} hover:bg-[#0081A7] transition duration-200`}
            >
              Settings
            </Link>
          </nav>
          
          {/* Use mt-auto to push the logout button all the way to bottom */}
          <div className="mt-auto p-6">
            <button 
              onClick={handleLogout}
              className="w-full bg-[#8F754F] text-white py-2 px-4 rounded font-medium hover:bg-[#8F754F]/80 transition duration-200"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </aside>

      {/* Remove the spacer div - was causing layout issues */}

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 overflow-hidden">
          <aside 
            id="mobile-sidebar"
            className="fixed top-0 left-0 w-64 h-full bg-[#13262F] text-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
              <h2 className="text-sm font-bold tracking-widest uppercase font-averia">HOLIDAZE MANAGER</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-gray-300"
                aria-label="Close menu"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* User info in mobile menu */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 overflow-hidden mr-3">
                {currentAvatarUrl ? (
                  <img 
                    src={currentAvatarUrl} 
                    alt={user?.name || "User avatar"}
                    className="w-10 h-10 rounded-full object-cover" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${user?.name?.charAt(0) || 'U'}&background=random`;
                    }}
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div>
                <div className="font-medium text-white">{user?.name}</div>
                <div className="text-xs text-gray-400">Venue Manager</div>
              </div>
            </div>
            
            <nav className="py-4">
              <Link 
                to="/venue-manager/dashboard" 
                className={`flex items-center py-3 px-6 ${isActive('/venue-manager/dashboard')} hover:bg-[#0081A7] transition duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link 
                to="/venue-manager/venues" 
                className={`flex items-center py-3 px-6 ${isActive('/venue-manager/venues')} hover:bg-[#0081A7] transition duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                My Venues
              </Link>
              <Link 
                to="/venue-manager/bookings" 
                className={`flex items-center py-3 px-6 ${isActive('/venue-manager/bookings')} hover:bg-[#0081A7] transition duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Bookings
              </Link>
              <Link 
                to="/venue-manager/create" 
                className={`flex items-center py-3 px-6 mb-2 ${isActive('/venue-manager/create')} hover:bg-[#0081A7] transition duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Venue
              </Link>
              
              <div className="my-2 border-t border-gray-700"></div>
              
              <div className="px-6 py-2">
                <Link 
                  to="/venues" 
                  className="block w-full bg-[#0081A7] text-white py-2 px-4 rounded text-center font-medium hover:bg-[#0081A7]/90 transition duration-200"
                >
                  EXPLORE VENUES
                </Link>
              </div>
              
              <div className="my-2 border-t border-gray-700"></div>
              
              <Link 
                to="/profile" 
                className={`flex items-center py-3 px-6 ${isActive('/profile')} hover:bg-[#0081A7] transition duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              <Link 
                to="/settings" 
                className={`flex items-center py-3 px-6 ${isActive('/settings')} hover:bg-[#0081A7] transition duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
              
              {/* Logout button closer to settings in mobile view */}
              <div className="px-6 py-3 mt-1">
                <button 
                  onClick={handleLogout}
                  className="w-full bg-[#8F754F] text-white py-2 px-4 rounded font-medium hover:bg-[#8F754F]/80 transition duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  LOGOUT
                </button>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 bg-gray-100 min-h-screen p-4 md:p-8 mt-14 md:mt-0 md:ml-64">
        {/* Desktop user info */}
        <div className="hidden md:flex justify-end mb-6">
          <div className="flex items-center">
            <Link to="/profile" className="flex items-center hover:text-[#0081A7] group">
              <div className="mr-2 text-gray-700 group-hover:text-[#0081A7]">{user?.name}</div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 overflow-hidden">
                {currentAvatarUrl ? (
                  <img 
                    src={currentAvatarUrl} 
                    alt={user?.name || "User avatar"}
                    className="w-8 h-8 rounded-full object-cover" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${user?.name?.charAt(0) || 'U'}&background=random`;
                    }}
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
            </Link>
          </div>
        </div>
        
        {children}
      </main>
    </div>
  );
};

export default VenueManagerLayout;