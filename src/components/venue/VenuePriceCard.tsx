// src/components/venue/VenuePriceCard.tsx

/**
 * @file VenuePriceCard.tsx
 * @description Component for displaying venue price and basic details
 */

import React from 'react';

interface VenuePriceCardProps {
  /** Price per night */
  price: number;
  /** Maximum number of guests */
  maxGuests: number;
  /** Average rating */
  averageRating: number;
}

/**
 * Component displaying venue price and basic information
 */
const VenuePriceCard: React.FC<VenuePriceCardProps> = ({
  price,
  maxGuests,
  averageRating
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-2xl font-bold">${price}</span>
          <span className="text-gray-600"> / night</span>
        </div>
        {averageRating > 0 && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-600 mb-1">Max guests: {maxGuests}</p>
      </div>
    </div>
  );
};

export default VenuePriceCard;