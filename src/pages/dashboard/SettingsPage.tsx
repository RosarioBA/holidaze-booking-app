// src/pages/dashboard/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const AVATAR_STORAGE_KEY = user ? `holidaze_avatar_url_${user.name}_${user.venueManager ? 'manager' : 'customer'}` : '';
  const BANNER_STORAGE_KEY = user ? `holidaze_banner_url_${user.name}_${user.venueManager ? 'manager' : 'customer'}` : '';
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('emailNotifications') !== 'false'; // Default to true
  });
  
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showConfirmClearData, setShowConfirmClearData] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Toggle dark mode
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Actual implementation would apply dark mode classes to the document
    if (newDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    
    setMessage({
      type: 'success',
      text: `Dark mode ${newDarkMode ? 'enabled' : 'disabled'}`
    });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };
  
  // Toggle email notifications
  const handleEmailNotificationsToggle = () => {
    const newEmailNotifications = !emailNotifications;
    setEmailNotifications(newEmailNotifications);
    localStorage.setItem('emailNotifications', newEmailNotifications.toString());
    
    setMessage({
      type: 'success',
      text: `Email notifications ${newEmailNotifications ? 'enabled' : 'disabled'}`
    });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };
  
  // Handle logout
  const handleLogout = () => {
    // Hide confirm dialog
    setShowConfirmLogout(false);
    
    // Clear any localStorage data
    localStorage.removeItem(AVATAR_STORAGE_KEY);
    localStorage.removeItem(BANNER_STORAGE_KEY);
    
    // Call the logout function from auth context
    logout();
    
    // Navigate to home page
    navigate('/');
  };
  
  // Handle clearing all data
  const handleClearData = () => {
    setShowConfirmClearData(false);
    
    // Clear localStorage data
    localStorage.clear();
    
    setMessage({
      type: 'success',
      text: 'All local data has been cleared'
    });
    
    // Clear message after 3 seconds and refresh the page
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 font-averia">Settings</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Appearance Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="border-b border-gray-200 px-6 py-4 font-semibold font-averia">Appearance</h2>
        <div className="p-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded mb-4">
            <label htmlFor="darkModeToggle" className="flex-grow cursor-pointer">
              <h3 className="font-medium font-averia">Dark Mode</h3>
              <p className="text-sm text-gray-600 font-light tracking-wide">
                Switch to dark theme for comfortable night viewing
              </p>
            </label>
            
            <label htmlFor="darkModeToggle" className="relative inline-flex items-center cursor-pointer">
              <input
                id="darkModeToggle"
                type="checkbox"
                checked={darkMode}
                onChange={handleDarkModeToggle}
                className="sr-only peer"
                aria-label="Toggle dark mode"
              />
              <span className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0081A7]"></span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="border-b border-gray-200 px-6 py-4 font-semibold font-averia">Notifications</h2>
        <div className="p-6">
          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between p-4 border rounded">
            <label htmlFor="emailNotificationsToggle" className="flex-grow cursor-pointer">
              <h3 className="font-medium font-averia">Email Notifications</h3>
              <p className="text-sm text-gray-600 font-light tracking-wide">
                Receive booking confirmations and updates via email
              </p>
            </label>
            
            <label htmlFor="emailNotificationsToggle" className="relative inline-flex items-center cursor-pointer">
              <input
                id="emailNotificationsToggle"
                type="checkbox"
                checked={emailNotifications}
                onChange={handleEmailNotificationsToggle}
                className="sr-only peer"
                aria-label="Toggle email notifications"
              />
              <span className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0081A7]"></span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="border-b border-gray-200 px-6 py-4 font-semibold font-averia">Account</h2>
        <div className="p-6">
          <Link to="/profile" className="flex items-center justify-between p-4 border rounded mb-4 hover:bg-gray-50">
            <div>
              <h3 className="font-medium font-averia">Edit Profile</h3>
              <p className="text-sm text-gray-600 font-light tracking-wide">
                Update your profile information and picture
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <button 
            onClick={() => setShowConfirmClearData(true)}
            className="w-full flex items-center justify-between p-4 border rounded mb-4 hover:bg-gray-50 text-left"
            aria-label="Clear local data"
          >
            <div>
              <h3 className="font-medium text-amber-600 font-averia">Clear Local Data</h3>
              <p className="text-sm text-gray-600 font-light tracking-wide">
                Clear all locally stored preferences and data
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={() => setShowConfirmLogout(true)}
            className="w-full flex items-center justify-between p-4 border rounded hover:bg-gray-50 text-left"
            aria-label="Log out"
          >
            <div>
              <h3 className="font-medium text-red-600 font-averia">Log Out</h3>
              <p className="text-sm text-gray-600 font-light tracking-wide">
                Sign out of your account
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm3.707 7.707a1 1 0 10-1.414-1.414l-2 2a1 1 0 000 1.414l2 2a1 1 0 001.414-1.414L5.414 11H12a1 1 0 100-2H5.414l1.293-1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Confirmation Modals */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-labelledby="logoutModalTitle">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 id="logoutModalTitle" className="text-xl font-semibold mb-4 font-averia">Log Out</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showConfirmClearData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-labelledby="clearDataModalTitle">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 id="clearDataModalTitle" className="text-xl font-semibold mb-4 font-averia">Clear Local Data</h3>
            <p className="mb-6 text-gray-600">
              This will clear all locally stored preferences and data. Your account information will remain intact.
              <br /><br />
              Are you sure you want to proceed?
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmClearData(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleClearData}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;