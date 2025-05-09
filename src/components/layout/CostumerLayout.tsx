// src/components/layout/CustomerLayout.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface CustomerLayoutProps {
  children: ReactNode;
}

const AVATAR_STORAGE_KEY = 'holidaze_avatar_url';

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { user, logout, isVenueManager } = useAuth();
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
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-[#13262F]' : '';
  };

  // Switch to venue manager dashboard
  const switchToVenueManager = () => {
    navigate('/venue-manager/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-md p-4 flex justify-between items-center">
        <Link to="/customer/dashboard" className="font-bold text-lg">HOLIDAZE</Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600 focus:outline-none"
          title={isMobileMenuOpen ? "Close menu" : "Open menu"}
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

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#13262F] text-white">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-bold tracking-widest uppercase">HOLIDAZE</h2>
        </div>
        <nav className="flex-1 py-4">
          <Link 
            to="/venues" 
            className={`block py-3 px-6 mb-1 ${isActive('/venues')} hover:bg-[#13262F] transition duration-200`}
          >
            <div className="w-full bg-[#0081A7] text-white py-2 text-center font-medium rounded">
              EXPLORE VENUES
            </div>
          </Link>
          <Link 
            to="/customer/dashboard" 
            className={`block py-3 px-6 ${isActive('/customer/dashboard')} hover:bg-[#13262F] transition duration-200`}
          >
            Dashboard
          </Link>
          <Link 
            to="/customer/trips" 
            className={`block py-3 px-6 ${isActive('/customer/trips')} hover:bg-[#13262F] transition duration-200`}
          >
            My Trips
          </Link>
          <Link 
            to="/customer/saved" 
            className={`block py-3 px-6 ${isActive('/customer/saved')} hover:bg-[#13262F] transition duration-200`}
          >
            Saved Venues
          </Link>
          
          <div className="my-4 border-t border-gray-700"></div>
          
          <Link 
            to="/profile" 
            className={`block py-3 px-6 ${isActive('/profile')} hover:bg-[#13262F] transition duration-200`}
          >
            Profile
          </Link>
          <Link 
            to="/settings" 
            className={`block py-3 px-6 ${isActive('/settings')} hover:bg-[#13262F] transition duration-200`}
          >
            Settings
          </Link>
          
        </nav>
        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="w-full bg-[#8F754F] text-white py-2 px-4 rounded font-medium hover:bg-[#8F754F]/80 transition duration-200"
          >
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="w-64 h-full bg-[#13262F] text-white transform transition-transform duration-300 overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-sm font-bold tracking-widest uppercase">HOLIDAZE</h2>
            </div>
            <nav className="flex-1 py-4">
              <Link 
                to="/venues" 
                className={`block py-3 px-6 mb-1 ${isActive('/venues')} hover:bg-[#13262F] transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-full bg-[#0081A7] text-white py-2 text-center font-medium rounded">
                  EXPLORE VENUES
                </div>
              </Link>
              <Link 
                to="/customer/dashboard" 
                className={`block py-3 px-6 ${isActive('/customer/dashboard')} hover:bg-[#13262F] transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/customer/trips" 
                className={`block py-3 px-6 ${isActive('/customer/trips')} hover:bg-[#13262F] transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link 
                to="/customer/saved" 
                className={`block py-3 px-6 ${isActive('/customer/saved')} hover:bg-[#13262F] transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Saved Venues
              </Link>
              
              <div className="my-4 border-t border-gray-700"></div>
              
              <Link 
                to="/profile" 
                className={`block py-3 px-6 ${isActive('/profile')} hover:bg-[#13262F] transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                to="/settings" 
                className={`block py-3 px-6 ${isActive('/settings')} hover:bg-[#13262F] transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
              
              {/* Only show the switch button if user is a venue manager */}
            </nav>
            <div className="p-6">
              <button 
                onClick={handleLogout}
                className="w-full bg-[#8F754F] text-white py-2 px-4 rounded font-medium hover:bg-[#8F754F]/80 transition duration-200"
              >
                LOGOUT
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0">
        <div className="flex justify-end mb-4">
          <div className="flex items-center">
            <Link to="/profile" className="flex items-center hover:text-[#0081A7]">
              <span className="mr-2">{user?.name}</span>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
                {currentAvatarUrl ? (
                  <img 
                    src={currentAvatarUrl} 
                    alt={user?.name || "User avatar"}
                    className="w-8 h-8 rounded-full object-cover" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/200x200?text=' + (user?.name?.charAt(0).toUpperCase() || 'U');
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

export default CustomerLayout;