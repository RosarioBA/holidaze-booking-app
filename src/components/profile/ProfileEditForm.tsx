// src/components/profile/ProfileEditForm.tsx

/**
 * @file ProfileEditForm.tsx
 * @description Form for editing user profile details
 */

import React, { forwardRef } from 'react';

interface ProfileEditFormProps {
  /** Current bio text */
  bio: string;
  /** Current avatar URL */
  avatarUrl: string;
  /** Current banner URL */
  bannerUrl: string;
  /** Loading state indicator */
  isLoading: boolean;
  /** Handler for bio text change */
  onBioChange: (value: string) => void;
  /** Handler for avatar URL change */
  onAvatarUrlChange: (value: string) => void;
  /** Handler for banner URL change */
  onBannerUrlChange: (value: string) => void;
  /** Handler for form submission */
  onSubmit: (e: React.FormEvent) => void;
  /** Handler for cancel button click */
  onCancel: () => void;
}

/**
 * Component for editing profile information
 */
const ProfileEditForm = forwardRef<HTMLDivElement, ProfileEditFormProps>(({
  bio,
  avatarUrl,
  bannerUrl,
  isLoading,
  onBioChange,
  onAvatarUrlChange,
  onBannerUrlChange,
  onSubmit,
  onCancel
}, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-[#0081A7]"
    >
      <h2 className="text-xl font-bold mb-4 font-averia">Edit Profile</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Tell us about yourself"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL
          </label>
          <input
            type="url"
            id="avatarUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
            value={avatarUrl}
            onChange={(e) => onAvatarUrlChange(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Please provide a valid URL to a publicly accessible image
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Banner URL
          </label>
          <input
            type="url"
            id="bannerUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
            value={bannerUrl}
            onChange={(e) => onBannerUrlChange(e.target.value)}
            placeholder="https://example.com/banner.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Please provide a valid URL to a publicly accessible image
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0081A7] text-white rounded-md hover:bg-[#13262F]"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
});

export default ProfileEditForm;