// src/components/venue/VenueHeader.tsx

/**
 * @file VenueHeader.tsx
 * @description Header component for venue details page showing name, location and ratings
 */

import React from 'react';

interface VenueHeaderProps {
  /** Name of the venue */
  name: string;
  /** Location information */
  location: {
    city?: string;
    country?: string;
    address?: string;
    zip?: string;
  };
  /** Average rating score */
  averageRating: number;
  /** Number of ratings/reviews */
  ratingsCount: number;
}

/**
 * Component displaying the venue header with name, location and rating information
 */
const VenueHeader: React.FC<VenueHeaderProps> = ({
  name,
  location,
  averageRating,
  ratingsCount
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 font-averia">{name}</h1>
      <div className="flex flex-wrap items-center text-gray-600 gap-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>
            {[location.city, location.country].filter(Boolean).join(', ') || 'Location not specified'}
          </span>
        </div>
        {averageRating > 0 && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{averageRating.toFixed(1)} ({ratingsCount} {ratingsCount === 1 ? 'review' : 'reviews'})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueHeader;