/**
 * @file RatingsList.tsx
 * @description Component for displaying a list of user ratings and reviews
 */

import React from 'react';
import { Rating } from '../../api/ratingService';
import { formatDate } from '../../utils/dateUtils';
import { getUserAvatar } from '../../utils/avatarUtils';
import { Link } from 'react-router-dom';

/**
 * Props for the RatingsList component
 */
interface RatingsListProps {
  /** Array of rating objects to display */
  ratings: Rating[];
  /** Whether the ratings are currently loading */
  isLoading: boolean;
}

/**
 * Formats a date string into a human-readable relative format
 * 
 * @param {string} dateString - ISO date string to format
 * @returns {string} Formatted date as relative time or full date
 */
const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return 'Today';
  if (diffDays <= 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  
  return formatDate(dateString);
};

/**
 * Component that displays a list of ratings and reviews for a venue
 * Shows user information, star rating, date, and optional comment
 * 
 * @param {RatingsListProps} props - Component props
 * @returns {JSX.Element} Rendered list of ratings or appropriate message
 */
const RatingsList: React.FC<RatingsListProps> = ({ ratings, isLoading }) => {
  // Show loading spinner when data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8" aria-live="polite" aria-busy="true">
        <div 
          className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#0081A7]"
          role="status"
        >
          <span className="sr-only">Loading ratings...</span>
        </div>
      </div>
    );
  }

  // Show message when no ratings exist
  if (!ratings || ratings.length === 0) {
    return (
      <div className="py-4 text-gray-600 text-center" aria-live="polite">
        No ratings yet. Be the first to rate this venue!
      </div>
    );
  }

  return (
    <div className="space-y-6" aria-label="Venue ratings and reviews">
      {ratings.map((rating) => {
        // Get username from either rating.user.name or rating.userName
        const userName = rating.user?.name || rating.userName || 'Anonymous';
        
        // Get date from either rating.created or rating.date
        const dateString = rating.created || rating.date || new Date().toISOString();
        const formattedDate = formatReviewDate(dateString);
        
        return (
          <div 
            key={rating.id} 
            className="border-b border-gray-200 pb-6 last:border-0"
            aria-label={`Review by ${userName}`}
          >
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                {userName && getUserAvatar(userName) ? (
                  <img 
                    src={getUserAvatar(userName)} 
                    alt=""
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${userName.charAt(0) || 'U'}`;
                    }}
                  />
                ) : rating.user?.avatar?.url ? (
                  <img 
                    src={rating.user.avatar.url} 
                    alt=""
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${userName.charAt(0) || 'U'}`;
                    }}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center bg-[#0081A7] text-white font-bold"
                    aria-hidden="true"
                  >
                    {userName.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {userName !== 'Anonymous' ? (
                        <Link to={`/profiles/${userName}`} className="text-[#0081A7] hover:underline">
                          {userName}
                        </Link>
                      ) : (
                        'Anonymous'
                      )}
                    </h4>
                    <div className="flex items-center mt-1">
                      <div 
                        className="flex mr-2"
                        aria-label={`Rating: ${rating.rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-lg" aria-hidden="true">
                            {star <= rating.rating ? (
                              <span className="text-yellow-500">★</span>
                            ) : (
                              <span className="text-gray-300">☆</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        <time dateTime={dateString}>{formattedDate}</time>
                      </span>
                    </div>
                  </div>
                </div>
                
                {rating.comment && (
                  <p className="mt-2 text-gray-700 whitespace-pre-line font-light tracking-wide">
                    {rating.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingsList;