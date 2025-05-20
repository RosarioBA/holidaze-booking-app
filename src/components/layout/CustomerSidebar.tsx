/**
 * @file CustomerSidebar.tsx
 * @description Simplified sidebar navigation component for customer users
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserAvatar from '../common/UserAvatar';
import { Profile } from '../../types/user';

/**
 * Props for the CustomerSidebar component
 */
interface CustomerSidebarProps {
  user: Profile | null;
  avatarUrl?: string;
  onLogout: () => void;
  isMobile?: boolean;
  onCloseMobileMenu?: () => void;
}

/**
 * Sidebar navigation component for customer users
 */
const CustomerSidebar: React.FC<CustomerSidebarProps> = (props) => {
  const { user, avatarUrl, onLogout, isMobile = false, onCloseMobileMenu } = props;
  const location = useLocation();
  
  // Determines if a navigation link is active based on current path
  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-[#13262F]' : '';
  };
  
  // Return the appropriate sidebar based on mobile/desktop view
  return (
    <div className={`flex flex-col ${!isMobile ? 'h-full' : ''}`}>
      {/* Header */}
      {isMobile ? (
        <>
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-bold tracking-widest uppercase font-averia">HOLIDAZE</h2>
            <button 
              onClick={onCloseMobileMenu}
              className="text-white hover:text-gray-300"
              aria-label="Close menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* User info in mobile */}
          <div className="px-6 py-4 border-b border-gray-800 flex items-center">
            <UserAvatar 
              avatarUrl={avatarUrl} 
              userName={user?.name} 
              size={40} 
              className="mr-3"
              useUiAvatars={true}
            />
            <div>
              <div className="font-medium text-white">{user?.name}</div>
              <div className="text-xs text-gray-400">Customer</div>
            </div>
          </div>
        </>
      ) : (
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-bold tracking-widest uppercase font-averia">HOLIDAZE</h2>
        </div>
      )}
      
      {/* Navigation */}
      {isMobile ? (
        <nav className="py-4">
          <div className="px-6 py-2 mb-2">
            <Link 
              to="/venues" 
              className="block w-full bg-[#0081A7] text-white py-2 px-4 rounded text-center font-medium hover:bg-[#0081A7]/90 transition duration-200"
              onClick={onCloseMobileMenu}
            >
              EXPLORE VENUES
            </Link>
          </div>
          
          <Link 
            to="/customer/dashboard" 
            className={`flex items-center py-3 px-6 ${isActive('/customer/dashboard')} hover:bg-[#0081A7] transition duration-200`}
            onClick={onCloseMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link 
            to="/customer/trips" 
            className={`flex items-center py-3 px-6 ${isActive('/customer/trips')} hover:bg-[#0081A7] transition duration-200`}
            onClick={onCloseMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            My Trips
          </Link>
          <Link 
            to="/customer/saved" 
            className={`flex items-center py-3 px-6 ${isActive('/customer/saved')} hover:bg-[#0081A7] transition duration-200`}
            onClick={onCloseMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Saved Venues
          </Link>
          
          <div className="my-2 border-t border-gray-700"></div>
          
          <Link 
            to="/profile" 
            className={`flex items-center py-3 px-6 ${isActive('/profile')} hover:bg-[#0081A7] transition duration-200`}
            onClick={onCloseMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>
          <Link 
            to="/settings" 
            className={`flex items-center py-3 px-6 ${isActive('/settings')} hover:bg-[#0081A7] transition duration-200`}
            onClick={onCloseMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
          
          {/* Logout button (mobile) */}
          <div className="px-6 py-3 mt-1">
            <button 
              onClick={onLogout}
              className="w-full bg-[#8F754F] text-white py-2 px-4 rounded font-medium hover:bg-[#8F754F]/80 transition duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              LOGOUT
            </button>
          </div>
        </nav>
      ) : (
        // Desktop navigation
        <nav className="py-4">
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
      )}
      
      {/* Logout button (desktop) */}
      {!isMobile && (
        <div className="mt-auto p-6">
          <button 
            onClick={onLogout}
            className="w-full bg-[#8F754F] text-white py-2 px-4 rounded font-medium hover:bg-[#8F754F]/80 transition duration-200"
          >
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerSidebar;