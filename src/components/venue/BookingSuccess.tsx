/**
 * @file BookingSuccess.tsx
 * @description Component that displays a success confirmation after a booking is made
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { parseISO, format, differenceInDays } from 'date-fns';

/**
 * Props for the BookingSuccess component
 */
interface BookingSuccessProps {
  /** The booking data with dates and guest information */
  booking: {
    /** Unique identifier for the booking */
    id: string;
    /** Check-in date as ISO string */
    dateFrom: string;
    /** Check-out date as ISO string */
    dateTo: string;
    /** Number of guests for the booking */
    guests: number;
  };
  /** Price per night in USD */
  price: number;
  /** Function to reset the booking form */
  onReset: () => void;
}

/**
 * Component that displays a confirmation screen after a successful booking
 * Shows booking details and provides navigation options
 * 
 * @param {BookingSuccessProps} props - Component props
 * @returns {JSX.Element} Rendered success confirmation
 */
const BookingSuccess: React.FC<BookingSuccessProps> = ({ booking, price, onReset }) => {
  // Parse dates and calculate stay duration and total price
  const startDate = parseISO(booking.dateFrom);
  const endDate = parseISO(booking.dateTo);
  const nights = differenceInDays(endDate, startDate);
  const totalPrice = nights * price;
  
  return (
    <div className="bg-white rounded-lg border border-green-200 p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1 font-averia">Booking Confirmed!</h3>
        <p className="text-gray-600">Your reservation has been successfully booked.</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h4 className="font-semibold mb-3 font-averia">Booking Details</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="block text-gray-600">Confirmation #</span>
            <span className="font-medium">{booking.id.substring(0, 8)}...</span>
          </div>
          <div>
            <span className="block text-gray-600">Guests</span>
            <span className="font-medium">{booking.guests}</span>
          </div>
          <div>
            <span className="block text-gray-600">Check-in</span>
            <span className="font-medium">{format(startDate, 'MMMM d, yyyy')}</span>
          </div>
          <div>
            <span className="block text-gray-600">Check-out</span>
            <span className="font-medium">{format(endDate, 'MMMM d, yyyy')}</span>
          </div>
          <div>
            <span className="block text-gray-600">Duration</span>
            <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
          </div>
          <div>
            <span className="block text-gray-600">Total</span>
            <span className="font-medium">${totalPrice}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to={`/bookings/${booking.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 text-center"
          aria-label="View booking details"
        >
          View Booking Details
        </Link>
        <Link
          to="/my-trips"
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 text-center"
          aria-label="Go to my trips"
        >
          Go to My Trips
        </Link>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white border border-gray-300 rounded font-medium hover:bg-gray-50 text-center"
          type="button"
          aria-label="Book another stay"
        >
          Book Another Stay
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;