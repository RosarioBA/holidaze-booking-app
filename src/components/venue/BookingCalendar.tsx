// src/components/venue/BookingCalendar.tsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Booking } from '../../types/venue';
import { useAuth } from '../../contexts/AuthContext';

interface BookingCalendarProps {
  venueId: string;
  maxGuests: number;
  bookings?: Booking[];
  price: number;
  onBookingSubmit?: (from: Date, to: Date, guests: number) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  venueId,
  maxGuests,
  bookings = [],
  price,
  onBookingSubmit
}) => {
  const { isAuthenticated } = useAuth();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Create an array of dates that are already booked
  const bookedDates = bookings.flatMap(booking => {
    const dates: Date[] = [];
    const start = new Date(booking.dateFrom);
    const end = new Date(booking.dateTo);
    
    // Create dates for each day of the booking
    const date = new Date(start);
    while (date <= end) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return dates;
  });
  
  // Update total price when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setTotalPrice(days * price);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, price]);
  
  // Function to check if a date is booked
  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some(bookedDate => 
      bookedDate.getDate() === date.getDate() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getFullYear() === date.getFullYear()
    );
  };
  
  // Handle date changes
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  
  // Handle booking submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    
    if (guestCount < 1 || guestCount > maxGuests) {
      alert(`Guest count must be between 1 and ${maxGuests}.`);
      return;
    }
    
    if (onBookingSubmit) {
      onBookingSubmit(startDate, endDate, guestCount);
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-bold text-lg mb-4">Book Your Stay</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check-in / Check-out
        </label>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          selectsRange
          inline
          monthsShown={2}
          className="w-full"
          excludeDates={bookedDates}
          filterDate={date => !isDateBooked(date)}
          calendarClassName="w-full"
        />
      </div>
      
      <div className="mb-4">
        <label 
          htmlFor="guestCount" 
          className="block text-sm font-medium text-gray-700 mb-2"
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
            className="w-16 text-center py-2 border-t border-b"
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
              ${price} x {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} nights
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
          onClick={handleSubmit}
          disabled={!startDate || !endDate}
          className={`w-full py-3 px-4 rounded-lg font-medium text-center ${
            !startDate || !endDate
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {!startDate || !endDate ? 'Select dates to book' : 'Book Now'}
        </button>
      ) : (
        <div className="text-center">
          <p className="mb-2 text-gray-600">Log in to book this venue</p>
          <a 
            href="/login" 
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Log In
          </a>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;