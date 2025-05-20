/**
 * @file UserAvatar.tsx
 * @description Reusable component for displaying user avatars with fallback
 */

import React from 'react';

/**
 * Props for the UserAvatar component
 */
interface UserAvatarProps {
  /** URL of the avatar image */
  avatarUrl?: string;
  /** User's name, used for alt text and fallback initials */
  userName?: string;
  /** Size of avatar in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to use UI Avatars API for fallback (instead of placeholder) */
  useUiAvatars?: boolean;
}

/**
 * A reusable component that displays a user's avatar with appropriate fallbacks
 * 
 * @param {UserAvatarProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  userName = 'User',
  size = 32,
  className = '',
  useUiAvatars = false,
}) => {
  const initial = userName?.charAt(0).toUpperCase() || 'U';
  
  // Determine fallback URL based on settings
  const fallbackUrl = useUiAvatars
    ? `https://ui-avatars.com/api/?name=${initial}&background=random`
    : `https://placehold.co/${size}x${size}?text=${initial}`;
  
  return (
    <div 
      className={`w-${size / 4} h-${size / 4} bg-gray-300 rounded-full flex items-center justify-center text-gray-700 overflow-hidden ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={`${userName}'s avatar`}
          className="w-full h-full rounded-full object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackUrl;
          }}
          aria-hidden="true"
        />
      ) : (
        initial
      )}
    </div>
  );
};

export default UserAvatar;