/**
 * @file SettingsPage.tsx
 * @description User settings page for managing preferences and account actions
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Import your existing ConfirmationModal
import ConfirmationModal from '../../components/common/ConfirmationModal';

// New components (we'll still create these)
import SettingsCard from '../../components/settings/SettingsCard';
import ToggleOption from '../../components/settings/ToggleOption';

/**
 * Settings page for managing user preferences and account actions
 * 
 * @returns {JSX.Element} Rendered component
 */
const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Local storage keys
  const AVATAR_STORAGE_KEY = user ? `holidaze_avatar_url_${user.name}_${user.venueManager ? 'manager' : 'customer'}` : '';
  const BANNER_STORAGE_KEY = user ? `holidaze_banner_url_${user.name}_${user.venueManager ? 'manager' : 'customer'}` : '';
  
  // User preferences
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('emailNotifications') !== 'false'; // Default to true
  });
  
  // Modal states
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showConfirmClearData, setShowConfirmClearData] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Feedback message
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  /**
   * Toggles dark mode and updates localStorage
   */
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Apply dark mode classes to the document
    if (newDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    
    showMessage('success', `Dark mode ${newDarkMode ? 'enabled' : 'disabled'}`);
  };
  
  /**
   * Toggles email notifications and updates localStorage
   */
  const handleEmailNotificationsToggle = () => {
    const newEmailNotifications = !emailNotifications;
    setEmailNotifications(newEmailNotifications);
    localStorage.setItem('emailNotifications', newEmailNotifications.toString());
    
    showMessage('success', `Email notifications ${newEmailNotifications ? 'enabled' : 'disabled'}`);
  };
  
  /**
   * Handles user logout
   */
  const handleLogout = () => {
    setIsProcessing(true);
    
    // Clear user-specific localStorage data
    localStorage.removeItem(AVATAR_STORAGE_KEY);
    localStorage.removeItem(BANNER_STORAGE_KEY);
    
    // Call the logout function from auth context
    logout();
    
    // Navigate to home page
    navigate('/');
  };
  
  /**
   * Clears all localStorage data
   */
  const handleClearData = () => {
    setIsProcessing(true);
    localStorage.clear();
    
    showMessage('success', 'All local data has been cleared');
    
    // Refresh the page after a delay
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  
  /**
   * Shows a temporary message to the user
   * 
   * @param {('success'|'error')} type - Message type
   * @param {string} text - Message text
   */
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 font-averia">Settings</h1>
      
      {/* Feedback message */}
      {message && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Appearance Settings */}
      <SettingsCard title="Appearance">
        <ToggleOption
          id="darkModeToggle"
          title="Dark Mode"
          description="Switch to dark theme for comfortable night viewing"
          isEnabled={darkMode}
          onToggle={handleDarkModeToggle}
        />
      </SettingsCard>
      
      {/* Notification Settings */}
      <SettingsCard title="Notifications">
        <ToggleOption
          id="emailNotificationsToggle"
          title="Email Notifications"
          description="Receive booking confirmations and updates via email"
          isEnabled={emailNotifications}
          onToggle={handleEmailNotificationsToggle}
        />
      </SettingsCard>
      
      {/* Account Actions */}
      <SettingsCard title="Account">
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
      </SettingsCard>
      
      {/* Confirmation Modals - Using your existing component */}
      {showConfirmLogout && (
        <ConfirmationModal
          title="Log Out"
          message="Are you sure you want to log out of your account?"
          confirmText="Log Out"
          cancelText="Cancel"
          isLoading={isProcessing}
          onConfirm={handleLogout}
          onCancel={() => setShowConfirmLogout(false)}
        />
      )}
      
      {showConfirmClearData && (
        <ConfirmationModal
          title="Clear Local Data"
          message="This will clear all locally stored preferences and data. Your account information will remain intact. Are you sure you want to proceed?"
          confirmText="Clear Data"
          cancelText="Cancel"
          isLoading={isProcessing}
          onConfirm={handleClearData}
          onCancel={() => setShowConfirmClearData(false)}
        />
      )}
    </div>
  );
};

export default SettingsPage;