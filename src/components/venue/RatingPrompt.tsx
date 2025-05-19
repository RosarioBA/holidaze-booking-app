// Updated RatingPrompt.tsx - Additional check for past bookings
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RatingPromptProps {
  venueId: string;
  hasUserBooked: boolean; // This should now reflect completed bookings only
  hasUserRated: boolean;
  onOpenRatingForm: () => void;
}

/**
 * A component that prompts users to rate a venue they've booked and stayed at
 */
const RatingPrompt: React.FC<RatingPromptProps> = ({ 
  venueId,
  hasUserBooked,
  hasUserRated,
  onOpenRatingForm
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mt-6 mb-6">
        <h3 className="font-bold text-lg mb-2 font-averia">Rate this venue</h3>
        <p className="mb-3">Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link> to rate this venue.</p>
      </div>
    );
  }

  // Must have completed a booking to rate
  if (!hasUserBooked) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mt-6 mb-6">
        <h3 className="font-bold text-lg mb-2 font-averia">Rate this venue</h3>
        <p className="mb-3">You need to book and complete a stay at this venue before you can rate it.</p>
        <Link to={`/venues/${venueId}`} className="bg-blue-600 text-white px-4 py-2 rounded inline-block hover:bg-blue-700">
          Book Now
        </Link>
      </div>
    );
  }

  // Already rated
  if (hasUserRated) {
    return (
      <div className="bg-green-50 p-4 rounded-lg mt-6 mb-6">
        <h3 className="font-bold text-lg mb-2 font-averia">Thanks for your rating!</h3>
        <p>You've already rated this venue. Your feedback helps other travelers make better decisions.</p>
      </div>
    );
  }

  // Eligible to rate (completed booking + not yet rated)
  return (
    <div className="bg-yellow-50 p-4 rounded-lg mt-6 mb-6">
      <h3 className="font-bold text-lg mb-2 font-averia">Share your experience!</h3>
      <p className="mb-3">You've stayed at this venue. Help other travelers by sharing your experience.</p>
      <button 
        onClick={onOpenRatingForm}
        className="bg-yellow-500 text-white px-4 py-2 rounded inline-block hover:bg-yellow-600"
      >
        Rate This Venue
      </button>
    </div>
  );
};

export default RatingPrompt;