/**
 * @file CustomerLayout.tsx
 * @description Layout component specifically for customer users with responsive navigation
 */

import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CustomerSidebar from './CustomerSidebar';
import UserAvatar from '../common/UserAvatar';
import useAvatar from '../../hooks/UseAvatar';
import useMobileMenu from '../../hooks/useMobileMenu';

/**
 * Props for the CustomerLayout component
 */
interface CustomerLayoutProps {
  /** Child components to be rendered in the main content area */
  children: ReactNode;
}

/**
 * Layout component for customer users with responsive navigation
 * Provides both mobile and desktop layouts with appropriate navigation
 * 
 * @param {CustomerLayoutProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const avatarUrl = useAvatar(user);
  const [isMobileMenuOpen, toggleMobileMenu, closeMobileMenu] = useMobileMenu();
  
  /**
   * Handles user logout and redirects to homepage
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  /**
   * Handles mobile menu toggle with click propagation stopped
   */
  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMobileMenu();
  };
  
  // Show loading state if user data is not available yet
  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-md p-4 flex justify-between items-center">
        <Link to="/customer/dashboard" className="font-bold text-lg font-averia">HOLIDAZE</Link>
        <div className="flex items-center">
          <Link to="/profile" className="mr-4 flex items-center">
            <UserAvatar 
              avatarUrl={avatarUrl} 
              userName={user.name} 
              size={32}
              useUiAvatars={true}
            />
          </Link>
          <button
            id="mobile-menu-button"
            onClick={handleMobileMenuToggle}
            className="text-gray-600 focus:outline-none"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#13262F] text-white h-screen fixed left-0 top-0">
        <CustomerSidebar 
          user={user}
          avatarUrl={avatarUrl}
          onLogout={handleLogout}
        />
      </aside>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 overflow-hidden">
          <aside 
            id="mobile-sidebar"
            className="fixed top-0 left-0 w-64 h-full bg-[#13262F] text-white shadow-lg z-50 overflow-y-auto"
          >
            <CustomerSidebar 
              user={user}
              avatarUrl={avatarUrl}
              onLogout={handleLogout}
              isMobile={true}
              onCloseMobileMenu={closeMobileMenu}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 bg-gray-100 min-h-screen p-4 md:p-8 mt-14 md:mt-0 md:ml-64">
        {/* Desktop user info */}
        <div className="hidden md:flex justify-end mb-6">
          <div className="flex items-center">
            <Link to="/profile" className="flex items-center hover:text-[#0081A7] group">
              <div className="mr-2 text-gray-700 group-hover:text-[#0081A7]">{user.name}</div>
              <UserAvatar 
                avatarUrl={avatarUrl} 
                userName={user.name} 
                size={32}
                useUiAvatars={true}
              />
            </Link>
          </div>
        </div>
        
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;