// src/components/profile/ProfileInfo.tsx

/**
 * @file ProfileInfo.tsx
 * @description Profile information display component
 */

import React from 'react';
import { Profile } from '../../types/profile';

interface ProfileInfoProps {
  /** User profile data */
  profile: Profile;
  /** Number of bookings */
  bookingsCount: number;
  /** Whether bookings are currently loading */
  bookingsLoading: boolean;
  /** Handler for edit button click */
  onEditClick: () => void;
}

/**
 * Component displaying the user's profile information and stats
 */
const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  profile, 
  bookingsCount, 
  bookingsLoading, 
  onEditClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold font-averia">{profile.name}</h1>
          <p className="text-gray-600 font-light">{profile.email}</p>
          <p className="text-gray-700 mt-2 tracking-wide">
            {profile.bio || 'No bio provided'}
          </p>
        </div>
        
        <button
          onClick={onEditClick}
          className="bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
        >
          Edit Profile
        </button>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <h2 className="font-semibold mb-2 font-averia">Account Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600 block text-sm">Account Type</span>
            <span className="font-medium">
              {profile.venueManager ? 'Venue Manager' : 'Customer'}
            </span>
          </div>
          <div>
            <span className="text-gray-600 block text-sm">Bookings</span>
            <span className="font-medium">
              {bookingsLoading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                bookingsCount
              )}
            </span>
          </div>
          {profile.venueManager && (
            <div>
              <span className="text-gray-600 block text-sm">Venues Listed</span>
              <span className="font-medium">
                {profile._count?.venues || 0}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;