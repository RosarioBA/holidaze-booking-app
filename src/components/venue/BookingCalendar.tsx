// src/components/venue/BookingCalendar.tsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInDays, addDays, isSameDay, isWithinInterval } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { Booking } from '../../types/venue';
import BookingSuccess from './BookingSuccess';
import { Link } from 'react-router-dom';

// Custom styles for the date picker to show booked dates


interface BookingCalendarProps {
  venueId: string;
  maxGuests: number;
  bookings?: Booking[];
  price: number;
  onBookingSubmit?: (from: Date, to: Date, guests: number) => Promise<void>;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  venueId,
  maxGuests,
  bookings = [],
  price,
  onBookingSubmit
}) => {
  const { isAuthenticated, token } = useAuth();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newBooking, setNewBooking] = useState<any>(null);
  
  // Update total price when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.max(1, differenceInDays(endDate, startDate));
      setTotalPrice(days * price);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, price]);
  
  // Create an array of dates that are already booked
  const getBookedDateRanges = () => {
    return bookings.map(booking => {
      return {
        start: new Date(booking.dateFrom),
        end: new Date(booking.dateTo)
      };
    });
  };
  
  // Check if a date is within any booked range
  const isDateBooked = (date: Date) => {
    const bookedRanges = getBookedDateRanges();
    return bookedRanges.some(range => 
      isWithinInterval(date, { start: range.start, end: range.end }) ||
      isSameDay(date, range.start) ||
      isSameDay(date, range.end)
    );
  };
  
  // Custom day class for displaying booked dates
  const dayClassName = (date: Date) => {
    if (isDateBooked(date)) {
      return "booked-day";
    }
    return "";
  };
  
  // Handle date changes
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    
    // If selecting start date and it's booked, don't allow it
    if (start && !end && isDateBooked(start)) {
      setError("This date is already booked. Please select another date.");
      return;
    }
    
    // If selecting an end date, check if any date in range is booked
    if (start && end) {
      let currentDate = new Date(start);
      while (currentDate <= end) {
        if (isDateBooked(currentDate)) {
          setError("Your selected range includes dates that are already booked. Please select another range.");
          return;
        }
        currentDate = addDays(currentDate, 1);
      }
    }
    
    setStartDate(start);
    setEndDate(end);
    setError(null);
  };
  
  // Handle booking submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    
    if (guestCount < 1 || guestCount > maxGuests) {
      setError(`Guest count must be between 1 and ${maxGuests}.`);
      return;
    }
    
    if (!isAuthenticated || !token) {
      setError("You must be logged in to book this venue.");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // If custom submission handler is provided, use it
      if (onBookingSubmit) {
        await onBookingSubmit(startDate, endDate, guestCount);
        return;
      }
      
      // Otherwise, perform the booking API call
      const response = await fetch('https://v2.api.noroff.dev/holidaze/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dateFrom: startDate.toISOString(),
          dateTo: endDate.toISOString(),
          guests: guestCount,
          venueId: venueId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }
      
      const data = await response.json();
      setNewBooking(data.data);
      setBookingSuccess(true);
      
      // Reset form
      setStartDate(null);
      setEndDate(null);
      setGuestCount(1);
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset booking form
  const handleReset = () => {
    setBookingSuccess(false);
    setNewBooking(null);
  };
  
  // If booking was successful, show success message
  if (bookingSuccess && newBooking) {
    return (
      <BookingSuccess
        booking={newBooking}
        price={price}
        onReset={handleReset}
      />
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-bold text-lg mb-4">Book Your Stay</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in / Check-out
          </label>
          <div className="border border-gray-200 rounded p-1">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              selectsRange
              inline
              monthsShown={1}
              className="w-full"
              dayClassName={dayClassName}
              excludeDates={[]}
              showDisabledMonthNavigation
            />
            
            <div className="flex items-center mt-2 text-xs text-gray-500 p-2 bg-gray-50 rounded">
              <div className="mr-2 flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-400 mr-1"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-100 border border-red-400 mr-1"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
          
          {startDate && endDate && (
            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100 text-sm">
              <span className="font-medium">Selected dates:</span>{' '}
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}{' '}
              ({differenceInDays(endDate, startDate)} nights)
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="guestCount" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Guests
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l"
              disabled={guestCount <= 1}
            >
              -
            </button>
            <input
              type="number"
              id="guestCount"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
              min={1}
              max={maxGuests}
              className="w-16 text-center py-2 border-t border-b border-gray-300"
            />
            <button
              type="button"
              onClick={() => setGuestCount(prev => Math.min(maxGuests, prev + 1))}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r"
              disabled={guestCount >= maxGuests}
            >
              +
            </button>
            <span className="ml-2 text-sm text-gray-600">
              (Max: {maxGuests})
            </span>
          </div>
        </div>
        
        {startDate && endDate && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                ${price} x {differenceInDays(endDate, startDate)} nights
              </span>
              <span className="font-medium">${totalPrice}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">${totalPrice}</span>
              </div>
            </div>
          </div>
        )}
        
        {isAuthenticated ? (
          <button
            type="submit"
            disabled={!startDate || !endDate || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-colors duration-200 ${
              !startDate || !endDate
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : !startDate || !endDate ? (
              'Select dates to book'
            ) : (
              'Book Now'
            )}
          </button>
        ) : (
          <div className="text-center">
            <p className="mb-2 text-gray-600 text-sm">Log in to book this venue</p>
            <Link 
              to="/login" 
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Log In
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingCalendar;