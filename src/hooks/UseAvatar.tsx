/**
 * @file useAvatar.ts
 * @description Custom hook for managing user avatars with localStorage persistence
 */

import { useState, useEffect } from 'react';
import { Profile } from '../types/user'; 

/**
 * Custom hook to manage user avatar with localStorage persistence
 * 
 * @param {Profile | null} user - The authenticated user object
 * @param {string} [prefix=''] - Optional prefix for the storage key
 * @returns {string | undefined} - The current avatar URL
 */
export const useAvatar = (user: Profile | null, prefix: string = '') => {
  const storageKey = user ? `holidaze_avatar_url_${user.name}${prefix ? `_${prefix}` : ''}` : 'holidaze_avatar_url_default';
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar?.url);
  
  useEffect(() => {
    const checkForAvatar = () => {
      const savedAvatarUrl = localStorage.getItem(storageKey);
      if (savedAvatarUrl) {
        setAvatarUrl(savedAvatarUrl);
      } else if (user?.avatar?.url) {
        setAvatarUrl(user.avatar.url);
      } else {
        setAvatarUrl(undefined);
      }
    };
    
    checkForAvatar();
    
    // Setup an event listener for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        checkForAvatar();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, storageKey]);
  
  return avatarUrl;
};

export default useAvatar;