/**
 * @file RatingPrompt.tsx
 * @description Component that guides users through the rating process with contextual prompts
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Props for the RatingPrompt component
 */
interface RatingPromptProps {
  /** ID of the venue for which to show rating prompts */
  venueId: string;
  /** Whether the user has completed a booking at this venue */
  hasUserBooked: boolean;
  /** Whether the user has already rated this venue */
  hasUserRated: boolean;
  /** Function to open the rating form/modal when user decides to rate */
  onOpenRatingForm: () => void;
}

/**
 * A component that displays contextual prompts for venue ratings
 * Shows different messages based on user authentication status and booking history
 * Provides appropriate call-to-action buttons for each scenario
 * 
 * @param {RatingPromptProps} props - Component props
 * @returns {JSX.Element} Contextual rating prompt appropriate to user's status
 */
const RatingPrompt: React.FC<RatingPromptProps> = ({
  venueId,
  hasUserBooked,
  hasUserRated,
  onOpenRatingForm
}) => {
  const { isAuthenticated } = useAuth();
  
  // Case 1: User is not logged in
  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mt-6 mb-6" role="region" aria-label="Rating information">
        <h3 className="font-bold text-lg mb-2 font-averia">Rate this venue</h3>
        <p className="mb-3">
          Please <Link to="/login" className="text-blue-600 hover:underline" aria-label="Log in to rate venue">log in</Link> to rate this venue.
        </p>
      </div>
    );
  }
  
  // Case 2: User has not completed a booking at this venue
  if (!hasUserBooked) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mt-6 mb-6" role="region" aria-label="Rating eligibility information">
        <h3 className="font-bold text-lg mb-2 font-averia">Rate this venue</h3>
        <p className="mb-3">You need to book and complete a stay at this venue before you can rate it.</p>
        <Link 
          to={`/venues/${venueId}`} 
          className="bg-blue-600 text-white px-4 py-2 rounded inline-block hover:bg-blue-700"
          aria-label="Book this venue"
        >
          Book Now
        </Link>
      </div>
    );
  }
  
  // Case 3: User has already rated this venue
  if (hasUserRated) {
    return (
      <div className="bg-green-50 p-4 rounded-lg mt-6 mb-6" role="region" aria-label="Rating confirmation">
        <h3 className="font-bold text-lg mb-2 font-averia">Thanks for your rating!</h3>
        <p>You've already rated this venue. Your feedback helps other travelers make better decisions.</p>
      </div>
    );
  }
  
  // Case 4: User is eligible to rate (has completed booking and not yet rated)
  return (
    <div className="bg-yellow-50 p-4 rounded-lg mt-6 mb-6" role="region" aria-label="Rating invitation">
      <h3 className="font-bold text-lg mb-2 font-averia">Share your experience!</h3>
      <p className="mb-3">You've stayed at this venue. Help other travelers by sharing your experience.</p>
      <button
        onClick={onOpenRatingForm}
        className="bg-yellow-500 text-white px-4 py-2 rounded inline-block hover:bg-yellow-600"
        type="button"
        aria-label="Open rating form"
      >
        Rate This Venue
      </button>
    </div>
  );
};

export default RatingPrompt;