/**
 * 
 * @param username - The username of the user whose avatar is to be retrieved
 * @returns 
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
}

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
}