/**
 * @file avatarUtils.ts
 * @description Utility functions for managing profile avatars and banners
 */

/**
 * Gets a user's avatar URL checking all possible storage locations
 * 
 * @param {string} username - The username of the user whose avatar is to be retrieved
 * @returns {string | undefined} Avatar URL or undefined if not found
 */
export const getUserAvatar = (username: string): string | undefined => {
  // Try manager avatar first
  const managerAvatar = localStorage.getItem(`holidaze_avatar_url_${username}_manager`);
  if (managerAvatar) return managerAvatar;
  
  // Try customer avatar next
  const customerAvatar = localStorage.getItem(`holidaze_avatar_url_${username}_customer`);
  if (customerAvatar) return customerAvatar;
  
  // Try legacy avatar format as fallback
  const legacyAvatar = localStorage.getItem(`holidaze_avatar_url_${username}`);
  if (legacyAvatar) return legacyAvatar;
  
  // No avatar found
  return undefined;
};

/**
 * Gets a user's banner URL checking all possible storage locations
 * 
 * @param {string} username - The username of the user whose banner is to be retrieved
 * @returns {string | undefined} Banner URL or undefined if not found
 */
export const getUserBanner = (username: string): string | undefined => {
  // Try manager banner first
  const managerBanner = localStorage.getItem(`holidaze_banner_url_${username}_manager`);
  if (managerBanner) return managerBanner;
  
  // Try customer banner next
  const customerBanner = localStorage.getItem(`holidaze_banner_url_${username}_customer`);
  if (customerBanner) return customerBanner;
  
  // Try legacy banner format as fallback
  const legacyBanner = localStorage.getItem(`holidaze_banner_url_${username}`);
  if (legacyBanner) return legacyBanner;
  
  // No banner found
  return undefined;
};

/**
 * Sets a user's avatar URL in localStorage for all contexts
 * 
 * @param {string} username - Username 
 * @param {string} url - Avatar URL to store
 * @param {boolean} isVenueManager - Whether the user is a venue manager
 */
export const setUserAvatar = (username: string, url: string, isVenueManager?: boolean): void => {
  if (!username || !url) return;
  
  // Store in both specific and legacy formats for maximum compatibility
  localStorage.setItem(`holidaze_avatar_url_${username}`, url);
  
  // If we know the user type, also store in the type-specific format
  if (isVenueManager !== undefined) {
    const typeKey = isVenueManager ? 'manager' : 'customer';
    localStorage.setItem(`holidaze_avatar_url_${username}_${typeKey}`, url);
  } else {
    // If user type unknown, store in both to ensure visibility everywhere
    localStorage.setItem(`holidaze_avatar_url_${username}_manager`, url);
    localStorage.setItem(`holidaze_avatar_url_${username}_customer`, url);
  }
  
  // Dispatch an event to notify components of avatar change
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('avatarUpdate', { 
      detail: { name: username, url } 
    });
    window.dispatchEvent(event);
  }
};

/**
 * Sets a user's banner URL in localStorage for all contexts
 * 
 * @param {string} username - Username
 * @param {string} url - Banner URL to store
 * @param {boolean} isVenueManager - Whether the user is a venue manager
 */
export const setUserBanner = (username: string, url: string, isVenueManager?: boolean): void => {
  if (!username || !url) return;
  
  // Store in both specific and legacy formats for maximum compatibility
  localStorage.setItem(`holidaze_banner_url_${username}`, url);
  
  // If we know the user type, also store in the type-specific format
  if (isVenueManager !== undefined) {
    const typeKey = isVenueManager ? 'manager' : 'customer';
    localStorage.setItem(`holidaze_banner_url_${username}_${typeKey}`, url);
  } else {
    // If user type unknown, store in both to ensure visibility everywhere
    localStorage.setItem(`holidaze_banner_url_${username}_manager`, url);
    localStorage.setItem(`holidaze_banner_url_${username}_customer`, url);
  }
};

/**
 * Fetches complete profile data from API
 * 
 * @param {string} username - Username to fetch
 * @param {string} token - Authentication token
 * @returns {Promise<any>} Profile data
 */
export const fetchProfileFromApi = async (username: string, token: string): Promise<any> => {
  if (!username || !token) {
    throw new Error('Username and token are required');
  }
  
  const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${username}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Noroff-API-Key': '54941b48-0ce5-4d6d-a8f2-9e3dcc28ddcf' // Add API key if needed
    }
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const result = await response.json();
  const profileData = result.data;
  
  // Store avatar and banner in localStorage for offline access
  if (profileData.avatar?.url) {
    setUserAvatar(username, profileData.avatar.url, profileData.venueManager);
  }
  
  if (profileData.banner?.url) {
    setUserBanner(username, profileData.banner.url, profileData.venueManager);
  }
  
  return profileData;
};

/**
 * Updates a user's profile with the API
 * 
 * @param {string} username - Username to update
 * @param {string} token - Authentication token
 * @param {any} profileData - Profile data to update
 * @returns {Promise<any>} Updated profile data
 */
export const updateProfileWithApi = async (
  username: string, 
  token: string, 
  profileData: any
): Promise<any> => {
  if (!username || !token) {
    throw new Error('Username and token are required');
  }
  
  const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Noroff-API-Key': '54941b48-0ce5-4d6d-a8f2-9e3dcc28ddcf' // Add API key if needed
    },
    body: JSON.stringify(profileData)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const result = await response.json();
  const updatedProfile = result.data;
  
  // Also update localStorage for all contexts
  if (updatedProfile.avatar?.url) {
    setUserAvatar(username, updatedProfile.avatar.url, updatedProfile.venueManager);
  }
  
  if (updatedProfile.banner?.url) {
    setUserBanner(username, updatedProfile.banner.url, updatedProfile.venueManager);
  }
  
  return updatedProfile;
};