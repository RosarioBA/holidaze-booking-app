// src/components/booking/BookingCard.tsx

/**
 * @file BookingCard.tsx
 * @description Card component for individual booking display
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { hasUserRatedVenue } from '../../api/ratingService';
import { formatDate, calculateNights, getBookingStatus, getImageUrl } from '../../utils/bookingUtils';

interface BookingCardProps {
  booking: any;
  user: any;
  onEdit: (booking: any) => void;
  onCancel: (booking: any) => void;
  onRate: (venueId: string, venueName: string) => void;
}

/**
 * Card component for displaying booking information
 */
const BookingCard: React.FC<BookingCardProps> = ({ booking, user, onEdit, onCancel, onRate }) => {
  const nights = calculateNights(booking.dateFrom, booking.dateTo);
  const status = getBookingStatus(booking.dateFrom, booking.dateTo);
  
  // Only allow rating for COMPLETED bookings (past bookings)
  const isPastBooking = new Date(booking.dateTo) < new Date();
  const venueId = booking.venue?.id;
  
  // Only check for ratings if it's a past booking
  const hasRated = isPastBooking && venueId ? hasUserRatedVenue(venueId, user?.name || '') : false;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"> 
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img 
            src={getImageUrl(booking.venue)} 
            alt={booking.venue?.name || 'Venue'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/600x400?text=Venue';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>
        
        <div className="p-6 md:w-2/3">
          <div className="sm:flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold font-averia">{booking.venue?.name || 'Unknown Venue'}</h2>
              <p className="text-gray-600 mb-2 font-light">
                {booking.venue?.location?.city || 'Unknown'}, {booking.venue?.location?.country || ''}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 text-right">
              <div className="text-gray-700">
                <span className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</span>
                {booking.venue?.price && (
                  <span className="block text-sm text-gray-500 mt-1">
                    {(booking.venue.price * nights).toLocaleString()} kr total
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-medium">{formatDate(booking.dateFrom)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-out</p>
              <p className="font-medium">{formatDate(booking.dateTo)}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-500">Booking ID:</span>
                <span className="ml-1 font-mono">{booking.id.substring(0, 8)}...</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Link 
                  to={`/venues/${booking.venue?.id}?source=my-trips`}
                  className="text-[#0081A7] hover:underline text-sm"
                >
                  View Venue
                </Link>
                
                {isPastBooking && booking.venue && (
                  <>
                    {hasRated ? (
                      <span className="text-green-600 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Rated
                      </span>
                    ) : (
                      <button
                        onClick={() => onRate(booking.venue.id, booking.venue.name)}
                        className="text-yellow-600 hover:underline text-sm"
                      >
                        Rate Venue
                      </button>
                    )}
                  </>
                )}
                
                {/* Only show edit/cancel for upcoming bookings */}
                {new Date(booking.dateFrom) > new Date() && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onEdit(booking);
                      }}
                      className="text-gray-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onCancel(booking);
                      }}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;