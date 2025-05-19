// src/components/venue/RatingModal.tsx
import React, { useState } from 'react';
import { submitRating } from '../../api/ratingService';
import { useAuth } from '../../contexts/AuthContext';

interface RatingModalProps {
  venueId: string;
  venueName: string;
  onClose: () => void;
  onRatingSubmitted: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ 
  venueId, 
  venueName, 
  onClose, 
  onRatingSubmitted 
}) => {
  const { token, user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredStar(starValue);
  };

  const handleStarLeave = () => {
    setHoveredStar(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !user) {
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
      
      // Submit the rating (localStorage implementation doesn't need a token)
      await submitRating(
        venueId, 
        {
          rating,
          comment: comment.trim() || undefined
        }, 
        token,
        user.name // Pass the username
      );
      
      // Call handlers to update UI and close modal
      onRatingSubmitted();
      onClose();
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit your rating. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-averia">Rate Your Stay</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="mb-6 text-gray-600">
            Share your experience at <span className="font-medium">{venueName}</span>
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating*
              </label>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => handleStarClick(starValue)}
                    onMouseEnter={() => handleStarHover(starValue)}
                    onMouseLeave={handleStarLeave}
                    className="text-4xl focus:outline-none mx-1"
                  >
                    {starValue <= (hoveredStar || rating) ? (
                      <span className="text-yellow-500">★</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-600 mb-4">
                {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review (Optional)
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this venue..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;