/**
 * @file VenueRatingInput.tsx
 * @description Component for selecting a star rating
 */

import React, { useState } from 'react';

interface VenueRatingInputProps {
  /** Current rating value */
  rating: number | null;
  /** Function to update the rating */
  onRatingChange: (rating: number | null) => void;
}

/**
 * Interactive star rating input component
 * 
 * @param {VenueRatingInputProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const VenueRatingInput: React.FC<VenueRatingInputProps> = ({ 
  rating, 
  onRatingChange 
}) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  /**
   * Updates the hovered star state for the UI
   * 
   * @param {number} starValue - Value of the star being hovered
   */
  const handleStarHover = (starValue: number) => {
    setHoveredStar(starValue);
  };

  /**
   * Resets the hovered star state when mouse leaves
   */
  const handleStarLeave = () => {
    setHoveredStar(null);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Initial Rating (Optional)
      </label>
      <p className="text-xs text-gray-500 mb-2">
        Set a rating for your venue. This will be averaged with customer ratings as they come in.
      </p>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <button
            key={starValue}
            type="button"
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            onMouseLeave={handleStarLeave}
            className="text-2xl focus:outline-none mr-1"
          >
            {starValue <= (hoveredStar || rating || 0) ? (
              <span className="text-yellow-500">★</span>
            ) : (
              <span className="text-gray-300">☆</span>
            )}
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating ? `${rating} out of 5 stars` : 'No rating'}
        </span>
        {rating && (
          <button
            type="button"
            onClick={() => onRatingChange(null)}
            className="ml-3 text-sm text-red-600 hover:text-red-800"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default VenueRatingInput;