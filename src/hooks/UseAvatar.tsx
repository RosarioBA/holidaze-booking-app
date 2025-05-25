/**
 * @file useAvatar.ts
 * @description Custom hook for managing user avatars with API and localStorage persistence
 */

import { useState, useEffect } from 'react';
import { Profile } from '../types/profile';
import { getUserAvatar, fetchProfileFromApi } from '../utils/avatarUtils';

/**
 * Custom hook to manage user avatar with both API and localStorage persistence
 * 
 * @param {Profile | null} user - The authenticated user object
 * @param {string} [prefix=''] - Optional prefix for the storage key (e.g., 'header', 'manager')
 * @returns {string | undefined} - The current avatar URL
 */
const useAvatar = (user: Profile | null): string | undefined => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar?.url);
  const [token] = useState<string | null>(localStorage.getItem('token'));
  
  useEffect(() => {
    if (!user || !user.name) {
      setAvatarUrl(undefined);
      return;
    }
    
    // Create an async function to handle all avatar retrieval logic
    const getAvatar = async () => {
      // First priority: Check user object directly (from context)
      if (user.avatar?.url) {
        setAvatarUrl(user.avatar.url);
        return;
      }
      
      // Second priority: Check all localStorage locations using our utility
      const savedAvatarUrl = getUserAvatar(user.name);
      if (savedAvatarUrl) {
        setAvatarUrl(savedAvatarUrl);
        return;
      }
      
      // Last resort: Try to fetch from API if we have a token
      if (token) {
        try {
          const profileData = await fetchProfileFromApi(user.name, token);
          if (profileData.avatar?.url) {
            setAvatarUrl(profileData.avatar.url);
          }
        } catch (error) {
          console.error('Error fetching avatar from API:', error);
        }
      }
    };
    
    // Run the avatar retrieval
    getAvatar();
    
    // Listen for avatar updates from other components
    const handleAvatarUpdate = (event: CustomEvent) => {
      const { name, url } = event.detail;
      if (name === user.name) {
        setAvatarUrl(url);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('avatarUpdate', handleAvatarUpdate as EventListener);
      
      return () => {
        window.removeEventListener('avatarUpdate', handleAvatarUpdate as EventListener);
      };
    }
  }, [user, token]);
  
  return avatarUrl;
};

export default useAvatar;