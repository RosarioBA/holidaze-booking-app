/**
 * @file VenueRatingSection.tsx
 * @description Component for venue ratings section including display and form
 */

import React from 'react';
import RatingForm from './RatingForm';
import RatingsList from './RatingsList';
import { Rating } from '../../types/rating';

interface VenueRatingSectionProps {
  /** Average rating score */
  averageRating: number;
  /** Array of ratings */
  ratings: Rating[];
  /** Whether ratings are currently loading */
  isLoading: boolean;
  /** Whether to show the rating form */
  showRatingForm: boolean;
  /** Whether the current user can rate */
  canRateVenue: boolean;
  /** ID of the venue */
  venueId: string;
  /** Handler for rating submission */
  onRatingSubmitted: () => void;
  /** Reason why user cannot rate (for better UX) */
  cannotRateReason?: 'not_stayed' | 'already_rated' | 'not_logged_in' | 'own_venue' | null;
}

/**
 * Component for displaying venue ratings and review form
 */
const VenueRatingSection: React.FC<VenueRatingSectionProps> = ({
  averageRating,
  ratings,
  isLoading,
  showRatingForm,
  canRateVenue,
  venueId,
  onRatingSubmitted,
  cannotRateReason
}) => {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-averia">
          Reviews
          {ratings.length > 0 && ` (${ratings.length})`}
        </h2>
        {averageRating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-xl">
                  {star <= Math.round(averageRating) ? (
                    <span className="text-yellow-500">★</span>
                  ) : (
                    <span className="text-gray-300">☆</span>
                  )}
                </span>
              ))}
            </div>
            <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      {/* Always show the rating form component - it will handle its own display logic */}
      <RatingForm 
        venueId={venueId} 
        onRatingSubmitted={onRatingSubmitted}
        canRate={canRateVenue}
        cannotRateReason={cannotRateReason || undefined}
      />
      
      {/* Display ratings list */}
      <div className="mt-6">
        <RatingsList 
          ratings={ratings} 
          isLoading={isLoading} 
        />
      </div>
    </section>
  );
};

export default VenueRatingSection;