// src/components/booking/BookingCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../../types/venue';
import { formatDate } from '../../utils/dateUtils';
import StarRating from '../../components/common/StarRating';

interface BookingCardProps {
  booking: Booking;
  hasRated: boolean;
  onRateClick: () => void;
}

/**
 * Card component for a booking in the user's booking history
 */
const BookingCard: React.FC<BookingCardProps> = ({ booking, hasRated, onRateClick }) => {
  const { id, dateFrom, dateTo, venue, guests } = booking;
  
  if (!venue) {
    return null; // Skip if venue data is missing
  }
  
  // Calculate if the booking is in the past (completed stay)
  const isPastBooking = new Date(dateTo) < new Date();
  
  // Get the first image or use a placeholder
  const imageUrl = venue.media && venue.media.length > 0
    ? venue.media[0].url
    : 'https://placehold.co/600x400?text=No+Image';
  
  // Format date range
  const dateRange = `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;
  
  // Calculate number of nights
  const nights = Math.ceil(
    (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img 
            src={imageUrl} 
            alt={venue.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/600x400?text=No+Image';
            }}
          />
          {venue.rating && venue.rating > 0 && (
            <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center">
              <StarRating rating={venue.rating} size="sm" />
              <span className="ml-1 text-sm font-medium">{venue.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6 md:w-2/3">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold mb-2 font-averia">{venue.name}</h3>
            
            {/* Booking status badge */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isPastBooking ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {isPastBooking ? 'Completed' : 'Upcoming'}
            </span>
          </div>
          
          <p className="text-gray-600 mb-2">
            {venue.location?.city && venue.location?.country
              ? `${venue.location.city}, ${venue.location.country}`
              : 'Location not specified'}
          </p>
          
          <div className="grid md:grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-sm text-gray-500">Dates</p>
              <p className="font-medium">{dateRange}</p>
              <p className="text-sm text-gray-600">{nights} night{nights !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Guests</p>
              <p className="font-medium">{guests} {guests === 1 ? 'guest' : 'guests'}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Link 
              to={`/venues/${venue.id}`} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
            >
              View Venue
            </Link>
            
            <Link 
              to={`/bookings/${id}`} 
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 inline-block"
            >
              Booking Details
            </Link>
            
            {/* Rate button for past bookings */}
            {isPastBooking && !hasRated && (
              <button
                onClick={onRateClick}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 inline-block"
              >
                Rate Venue
              </button>
            )}
            
            {/* If already rated */}
            {isPastBooking && hasRated && (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-md inline-block">
                Rated ✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;