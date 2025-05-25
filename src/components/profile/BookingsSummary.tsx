// src/components/profile/BookingsSummary.tsx

/**
 * @file BookingsSummary.tsx
 * @description Summary of user's bookings
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface BookingsSummaryProps {
  /** Whether the user is a venue manager */
  isVenueManager: boolean;
  /** Number of bookings */
  bookingsCount: number;
  /** Whether bookings are currently loading */
  isLoading: boolean;
}

/**
 * Component displaying booking summary information
 */
const BookingsSummary: React.FC<BookingsSummaryProps> = ({ 
  isVenueManager, 
  bookingsCount, 
  isLoading 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-averia">
          {isVenueManager ? 'Venue Bookings' : 'My Bookings'}
        </h2>
        <Link 
          to={isVenueManager ? "/venue-manager/bookings" : "/my-trips"}
          className="text-[#0081A7] hover:underline"
        >
          View All
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center p-3">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0081A7]"></div>
          <span className="ml-2 text-gray-600">Loading bookings...</span>
        </div>
      ) : !bookingsCount || bookingsCount === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-3">
            {isVenueManager 
              ? "You don't have any bookings for your venues yet."
              : "You don't have any bookings yet."}
          </p>
          <Link 
            to="/venues" 
            className="inline-block bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
          >
            Explore Venues
          </Link>
        </div>
      ) : (
        <p className="text-gray-600">
          You have {bookingsCount} {bookingsCount === 1 ? 'booking' : 'bookings'}.
          <br />
          Visit the {isVenueManager ? 'Bookings Management' : 'My Trips'} page to view {isVenueManager ? 'all' : 'your'} bookings.
        </p>
      )}
    </div>
  );
};

export default BookingsSummary;