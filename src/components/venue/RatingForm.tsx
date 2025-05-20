/**
 * @file RatingForm.tsx
 * @description Form component for submitting ratings and reviews for venues
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { submitRating } from '../../api/ratingService';

/**
 * Props for the RatingForm component
 */
interface RatingFormProps {
  /** ID of the venue being rated */
  venueId: string;
  /** Callback function triggered after successful rating submission */
  onRatingSubmitted: () => void;
  /** Whether the user is eligible to rate this venue */
  canRate: boolean;
}

/**
 * Component that allows users to submit ratings and reviews for venues
 * Includes star rating selection and optional text review
 * 
 * @param {RatingFormProps} props - Component props
 * @returns {JSX.Element | null} Rendered rating form or null if user cannot rate
 */
const RatingForm: React.FC<RatingFormProps> = ({ venueId, onRatingSubmitted, canRate }) => {
  const { token, isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Handles click on a star to set the rating
   * 
   * @param {number} selectedRating - The rating value (1-5) that was selected
   */
  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  /**
   * Handles mouse hover over stars for visual feedback
   * 
   * @param {number} starValue - The star value being hovered over
   */
  const handleStarHover = (starValue: number) => {
    setHoveredStar(starValue);
  };

  /**
   * Handles mouse leaving the star rating area
   */
  const handleStarLeave = () => {
    setHoveredStar(null);
  };

  /**
   * Handles form submission to submit the rating
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      setError('You must be logged in to submit a rating');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating before submitting');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await submitRating(
        venueId,
        {
          rating,
          comment: comment.trim() || undefined
        },
        token
      );
      
      setSuccess(true);
      setRating(0);
      setComment('');
      
      // Notify parent component that rating was submitted
      onRatingSubmitted();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit your rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render anything if the user can't rate this venue
  if (!canRate) {
    return null;
  }

  // Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-center text-gray-700">
          Please <a href="/login" className="text-[#0081A7] hover:underline">login</a> to rate this venue
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4 font-averia">Rate this venue</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md" role="status">
          Thank you for your rating!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                key={starValue}
                type="button"
                onClick={() => handleStarClick(starValue)}
                onMouseEnter={() => handleStarHover(starValue)}
                onMouseLeave={handleStarLeave}
                className="text-2xl focus:outline-none mr-1"
                disabled={rating === starValue}
                >
                {starValue <= (hoveredStar || rating) ? (
                  <span className="text-yellow-500">★</span>
                ) : (
                  <span className="text-gray-300">☆</span>
                )}
                </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review (Optional)
          </label>
          <textarea
            id="comment"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this venue..."
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#0081A7] text-white px-4 py-2 rounded-md hover:bg-[#13262F] disabled:opacity-50"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingForm;