// src/pages/dashboard/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const AVATAR_STORAGE_KEY = `holidaze_avatar_url_${user?.name}`;
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || '');
  const [venueManager, setVenueManager] = useState(user?.venueManager || false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVenueManagerLoading, setIsVenueManagerLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [venueManagerMessage, setVenueManagerMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatar?.url || '');
      setVenueManager(user.venueManager || false);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !token) {
      setMessage({
        type: 'error',
        text: 'Not authenticated. Please log in again.'
      });
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Build the update data
      const updateData: any = {};
      
      if (bio !== (user.bio || '')) {
        updateData.bio = bio;
      }
      
      if (avatarUrl !== (user.avatar?.url || '')) {
        updateData.avatar = {
          url: avatarUrl,
          alt: `${user.name}'s profile picture`
        };
      }
      
      // Only make the API call if there are changes
      if (Object.keys(updateData).length > 0) {
        console.log('Updating profile with data:', updateData);
        
        try {
          const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${user.name}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
          });
          
          const data = await response.json();
          console.log('Profile update response:', data);
          
          if (!response.ok) {
            // API call failed, but we'll still update locally
            console.warn('API call failed but updating locally');
            
            // Update the user in context anyway (local update)
            const updatedUser = {
              ...user,
              ...updateData
            };
            
            updateUser(updatedUser);
            
            // If avatar was updated, also store it in localStorage
            if (updateData.avatar) {
              localStorage.setItem(AVATAR_STORAGE_KEY, avatarUrl);
            }
            
            setMessage({
              type: 'success',
              text: 'Profile updated locally (API update failed)'
            });
          } else {
            // API call succeeded
            // Update the user in context
            updateUser({
              ...user,
              ...data.data
            });
            
            // If avatar was updated, also store it in localStorage
            if (updateData.avatar) {
              localStorage.setItem(AVATAR_STORAGE_KEY, avatarUrl);
            }
            
            setMessage({
              type: 'success',
              text: 'Profile updated successfully'
            });
          }
        } catch (error) {
          console.error('API error:', error);
          
          // Update locally despite API error
          const updatedUser = {
            ...user,
            ...updateData
          };
          
          updateUser(updatedUser);
          
          // If avatar was updated, also store it in localStorage
          if (updateData.avatar) {
            localStorage.setItem(AVATAR_STORAGE_KEY, avatarUrl);
          }
          
          setMessage({
            type: 'success',
            text: 'Profile updated locally (API call failed)'
          });
        }
      } else {
        setMessage({
          type: 'success',
          text: 'No changes to save'
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      });
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    // Note: the Noroff API doesn't have a password update endpoint
    try {
      // Simulate API call since the API doesn't support password changes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'Password update functionality is not implemented in the API'
      });
      
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle venue manager toggle - now updates locally only
  const handleVenueManagerToggle = async () => {
    if (!user) {
      setVenueManagerMessage({
        type: 'error',
        text: 'Not authenticated. Please log in again.'
      });
      return;
    }
    
    const newStatus = !venueManager;
    setIsVenueManagerLoading(true);
    setVenueManagerMessage(null);
    
    try {
      console.log(`Updating venue manager status from ${venueManager} to ${newStatus}`);
      
      // Skip the API call and update locally instead
      const updatedUser = {
        ...user,
        venueManager: newStatus
      };
      
      // Update local state
      setVenueManager(newStatus);
      
      // Update the user in context
      updateUser(updatedUser);
      
      setVenueManagerMessage({
        type: 'success',
        text: `You are ${newStatus ? 'now' : 'no longer'} a venue manager. (Updated locally)`
      });
      
      console.log('Venue manager status updated locally:', newStatus);
    } catch (error: any) {
      console.error('Error updating venue manager status:', error);
      setVenueManagerMessage({
        type: 'error',
        text: error.message || 'Failed to update venue manager status'
      });
      // Revert the local state if there's an error
      setVenueManager(user.venueManager);
    } finally {
      setIsVenueManagerLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Venue Manager Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="border-b border-gray-200 px-6 py-4 font-semibold">Account Type</h2>
        <div className="p-6">
          {venueManagerMessage && (
            <div className={`mb-4 p-3 rounded ${
              venueManagerMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            } text-sm`}>
              {venueManagerMessage.text}
            </div>
          )}
          
          <div className="flex items-center justify-between p-4 border rounded">
            <div>
              <h3 className="font-medium">Venue Manager Status</h3>
              <p className="text-sm text-gray-600">
                {venueManager 
                  ? 'You can create and manage venues' 
                  : 'Become a venue manager to list your properties'}
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={venueManager}
                onChange={handleVenueManagerToggle}
                className="sr-only peer"
                disabled={isVenueManagerLoading}
                title="Toggle venue manager status"
              />
              <div className={`relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${isVenueManagerLoading ? 'opacity-50' : ''}`}></div>
            </label>
          </div>
          
          {venueManager && (
            <div className="mt-4">
              <Link 
                to="/venue-manager/dashboard" 
                className="inline-block bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
              >
                Go to Venue Manager Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="border-b border-gray-200 px-6 py-4 font-semibold">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              disabled // Name cannot be changed in the API
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">Name cannot be changed</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a URL to an image. The API will verify the URL is accessible.
            </p>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="border-b border-gray-200 px-6 py-4 font-semibold">Change Password</h2>
        <div className="p-6">
          <p className="italic text-gray-500 mb-2">
            Note: Password changes are not supported by the Noroff API. This section is for demonstration purposes only.
          </p>
          <form onSubmit={handlePasswordUpdate}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
              />
              <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;