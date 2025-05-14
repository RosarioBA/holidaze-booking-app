// src/utils/avatarUtils.ts
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