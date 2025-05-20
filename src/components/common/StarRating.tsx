/**
 * @file StarRating.tsx
 * @description Displays a visual star rating from 1-5 with optional text and review count
 */

import React from 'react';

/**
 * Props for the StarRating component
 */
interface StarRatingProps {
  /** The rating value (0-5), can include decimals for half stars */
  rating: number;
  /** Size of the stars */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to display the numeric rating next to stars */
  showText?: boolean;
  /** Optional number of reviews to display */
  reviewCount?: number;
}

/**
 * A reusable star rating component that displays 1-5 stars
 * Supports half-star increments and multiple size options
 * 
 * @param {StarRatingProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 'md',
  showText = false,
  reviewCount
}) => {
  // Determine the size of stars
  const starSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }[size];
  
  // Round rating to nearest half
  const roundedRating = Math.round(rating * 2) / 2;
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          // Full star
          if (star <= roundedRating) {
            return (
              <span key={star} className={`${starSize} text-yellow-500`}>
                ★
              </span>
            );
          }
          // Half star
          else if (star - 0.5 === roundedRating) {
            return (
              <span key={star} className={`${starSize} text-yellow-500`}>
                ★
              </span>
            );
          }
          // Empty star
          else {
            return (
              <span key={star} className={`${starSize} text-gray-300`}>
                ☆
              </span>
            );
          }
        })}
      </div>
      
      {showText && (
        <div className="ml-1 text-sm text-gray-600">
          <span className="font-medium">{rating.toFixed(1)}</span>
          {reviewCount !== undefined && (
            <span> ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;