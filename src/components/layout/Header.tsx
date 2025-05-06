// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AVATAR_STORAGE_KEY = 'holidaze_avatar_url';

const Header = () => {
  const { user, isAuthenticated, isVenueManager, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar?.url);
  
  // Check for updated avatar in localStorage
  useEffect(() => {
    const savedAvatarUrl = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (savedAvatarUrl) {
      setAvatarUrl(savedAvatarUrl);
    } else if (user?.avatar?.url) {
      setAvatarUrl(user.avatar.url);
    }
  }, [user]);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Holidaze</Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/venues" className="hover:text-blue-600">Venues</Link></li>
            
            {isAuthenticated ? (
              <>
                {isVenueManager && (
                  <li>
                    <Link to="/manage-venues" className="hover:text-blue-600">
                      Manage Venues
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/bookings" className="hover:text-blue-600">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-blue-600 flex items-center">
                    <span className="mr-2">Profile</span>
                    {/* Display avatar if available */}
                    {avatarUrl && (
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={avatarUrl} 
                          alt={user?.name || "Profile"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/200x200?text=' + (user?.name?.charAt(0).toUpperCase() || 'U');
                          }}
                        />
                      </div>
                    )}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="hover:text-blue-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
                <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;