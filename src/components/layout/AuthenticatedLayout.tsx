// src/components/layout/AuthenticatedLayout.tsx
import React, { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-800' : '';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-md p-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">HOLIDAZE</Link>
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
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-bold tracking-widest uppercase">HOLIDAZE</h2>
        </div>
        <nav className="flex-1 py-4">
          <Link 
            to="/venues" 
            className={`block py-3 px-6 mb-1 ${isActive('/venues')} hover:bg-blue-800 transition duration-200`}
          >
            <div className="w-full bg-blue-600 text-white py-2 text-center font-medium rounded">
              EXPLORE VENUES
            </div>
          </Link>
          <Link 
            to="/dashboard" 
            className={`block py-3 px-6 ${isActive('/dashboard')} hover:bg-blue-800 transition duration-200`}
          >
            Dashboard
          </Link>
          <Link 
            to="/my-trips" 
            className={`block py-3 px-6 ${isActive('/my-trips')} hover:bg-blue-800 transition duration-200`}
          >
            My Trips
          </Link>
          <Link 
            to="/saved" 
            className={`block py-3 px-6 ${isActive('/saved')} hover:bg-blue-800 transition duration-200`}
          >
            Saved
          </Link>
          <Link 
            to="/settings" 
            className={`block py-3 px-6 ${isActive('/settings')} hover:bg-blue-800 transition duration-200`}
          >
            Settings
          </Link>
        </nav>
        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded font-medium hover:bg-orange-600 transition duration-200"
          >
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="w-64 h-full bg-gray-900 text-white transform transition-transform duration-300">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-sm font-bold tracking-widest uppercase">HOLIDAZE</h2>
            </div>
            <nav className="flex-1 py-4">
              <Link 
                to="/venues" 
                className={`block py-3 px-6 mb-1 ${isActive('/venues')} hover:bg-blue-800 transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-full bg-blue-600 text-white py-2 text-center font-medium rounded">
                  EXPLORE VENUES
                </div>
              </Link>
              <Link 
                to="/dashboard" 
                className={`block py-3 px-6 ${isActive('/dashboard')} hover:bg-blue-800 transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/my-trips" 
                className={`block py-3 px-6 ${isActive('/my-trips')} hover:bg-blue-800 transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link 
                to="/saved" 
                className={`block py-3 px-6 ${isActive('/saved')} hover:bg-blue-800 transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Saved
              </Link>
              <Link 
                to="/settings" 
                className={`block py-3 px-6 ${isActive('/settings')} hover:bg-blue-800 transition duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
            </nav>
            <div className="p-6">
              <button 
                onClick={handleLogout}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded font-medium hover:bg-orange-600 transition duration-200"
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
            <span className="mr-2">{user?.name}</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
              {user?.avatar ? (
                <img 
                  src={user.avatar.url} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover" 
                />
              ) : (
                user?.name.charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;