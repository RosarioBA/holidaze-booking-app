/**
 * @file VenueMediaInput.tsx
 * @description Component for managing venue media URLs
 */

import React from 'react';

interface MediaItem {
  url: string;
  alt?: string;
}

interface VenueMediaInputProps {
  /** Current media items */
  mediaUrls: MediaItem[];
  /** Function to update the media items array */
  setMediaUrls: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

/**
 * Component for managing venue media URLs with add/remove functionality
 * 
 * @param {VenueMediaInputProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const VenueMediaInput: React.FC<VenueMediaInputProps> = ({ 
  mediaUrls, 
  setMediaUrls 
}) => {
  /**
   * Adds a new empty media URL input field
   */
  const handleAddMediaUrl = () => {
    setMediaUrls([...mediaUrls, { url: '', alt: '' }]);
  };

  /**
   * Removes a media URL input field at the specified index
   * 
   * @param {number} index - Index of the media URL to remove
   */
  const handleRemoveMediaUrl = (index: number) => {
    const updatedUrls = mediaUrls.filter((_, i) => i !== index);
    setMediaUrls(updatedUrls.length ? updatedUrls : [{ url: '', alt: '' }]);
  };

  /**
   * Updates a media URL at the specified index
   * 
   * @param {number} index - Index of the media URL to update
   * @param {'url' | 'alt'} field - Field to update
   * @param {string} value - New value for the field
   */
  const handleMediaUrlChange = (index: number, field: 'url' | 'alt', value: string) => {
    const updatedUrls = [...mediaUrls];
    updatedUrls[index] = { ...updatedUrls[index], [field]: value };
    setMediaUrls(updatedUrls);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Media
      </label>
      
      {mediaUrls.map((media, index) => (
        <div key={index} className="flex mb-2">
          <input
            type="url"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
            placeholder="Image URL"
            value={media.url}
            onChange={(e) => handleMediaUrlChange(index, 'url', e.target.value)}
          />
          
          <button
            type="button"
            onClick={() => handleRemoveMediaUrl(index)}
            className="ml-2 bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200"
          >
            Remove
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={handleAddMediaUrl}
        className="mt-2 text-[#0081A7] hover:text-[#13262F]"
      >
        + Add another image
      </button>
    </div>
  );
};

export default VenueMediaInput;
