// src/components/profile/ProfileHeader.tsx

/**
 * @file ProfileHeader.tsx
 * @description Profile header component with banner and avatar
 */

import React from 'react';
import { Profile } from '../../types/profile';

interface ProfileHeaderProps {
  /** User profile data */
  profile: Profile;
}

/**
 * Component displaying the profile banner and avatar
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="relative mb-16">
      <div className="h-48 bg-[#F5F7DC] rounded-lg overflow-hidden">
        {profile.banner ? (
          <img 
            src={profile.banner.url} 
            alt={profile.banner.alt || `${profile.name}'s banner`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/1200x400?text=No+Banner';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8F754F] font-medium">
            No Banner Available
          </div>
        )}
      </div>
      
      <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full border-4 border-white overflow-hidden">
        {profile.avatar ? (
          <img 
            src={profile.avatar.url} 
            alt={profile.avatar.alt || profile.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/200x200?text=No+Avatar';
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#0081A7] flex items-center justify-center text-white text-2xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;