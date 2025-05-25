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
  /** Reason why user cannot rate (for better UX) */
  cannotRateReason?: 'not_stayed' | 'already_rated' | 'not_logged_in' | 'own_venue';
}

/**
 * Component that allows users to submit ratings and reviews for venues
 * Includes star rating selection and optional text review
 * 
 * @param {RatingFormProps} props - Component props
 * @returns {JSX.Element | null} Rendered rating form or appropriate message
 */
const RatingForm: React.FC<RatingFormProps> = ({ 
  venueId, 
  onRatingSubmitted, 
  canRate, 
  cannotRateReason 
}) => {
  const { token, isAuthenticated, user } = useAuth();
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
    
    if (!isAuthenticated || !token || !user) {
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
        token,
        user.name
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

  // Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-blue-800">
            Please <a href="/login" className="text-[#0081A7] hover:underline font-medium">login</a> to leave a review
          </p>
        </div>
      </div>
    );
  }

  // Show appropriate message if user cannot rate
  if (!canRate) {
    const getMessage = () => {
      switch (cannotRateReason) {
        case 'not_stayed':
          return {
            title: "You can only review venues you've stayed at",
            message: "Book and complete a stay at this venue to leave a review.",
            icon: "🏨",
            color: "amber"
          };
        case 'already_rated':
          return {
            title: "You've already reviewed this venue",
            message: "You can only leave one review per venue.",
            icon: "⭐",
            color: "green"
          };
        case 'own_venue':
          return {
            title: "You cannot review your own venue",
            message: "Venue owners cannot leave reviews for their own properties.",
            icon: "🏠",
            color: "gray"
          };
        default:
          return {
            title: "Unable to leave a review",
            message: "You are not eligible to review this venue at this time.",
            icon: "ℹ️",
            color: "blue"
          };
      }
    };

    const { title, message, icon, color } = getMessage();
    const colorClasses = {
      amber: "bg-amber-50 border-amber-200 text-amber-800",
      green: "bg-green-50 border-green-200 text-green-800",
      gray: "bg-gray-50 border-gray-200 text-gray-800",
      blue: "bg-blue-50 border-blue-200 text-blue-800"
    };

    return (
      <div className={`mt-6 p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className="flex items-start">
          <span className="text-2xl mr-3">{icon}</span>
          <div>
            <h4 className="font-medium mb-1">{title}</h4>
            <p className="text-sm">{message}</p>
          </div>
        </div>
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