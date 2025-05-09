// src/components/booking/BookingUpdateForm.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { Booking } from '../../types/venue';
import { updateBooking } from '../../api/bookingService';

interface BookingUpdateFormProps {
  booking: Booking;
  onCancel: () => void;
  onSuccess: (updatedBooking: Booking) => void;
}

const BookingUpdateForm: React.FC<BookingUpdateFormProps> = ({
  booking,
  onCancel,
  onSuccess
}) => {
  const { token } = useAuth();
  const [startDate, setStartDate] = useState<Date | null>(parseISO(booking.dateFrom));
  const [endDate, setEndDate] = useState<Date | null>(parseISO(booking.dateTo));
  const [guests, setGuests] = useState(booking.guests);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const maxGuests = booking.venue?.maxGuests || 1;
  
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError('Please select check-in and check-out dates.');
      return;
    }
    
    if (guests < 1 || guests > maxGuests) {
      setError(`Guest count must be between 1 and ${maxGuests}.`);
      return;
    }
    
    if (!token) {
      setError('You must be logged in to update a booking.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const updateData = {
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
        guests
      };
      
      // Use the bookingService function instead of direct API call
      const updatedBooking = await updateBooking(booking.id, updateData, token);

      if (!updatedBooking) {
        throw new Error('Failed to update booking');
      }
      
      // Add the venue data back to the response since the API doesn't return it
      const completeUpdatedBooking: Booking = {
        ...updatedBooking,
        venue: booking.venue
      };
      
      onSuccess(completeUpdatedBooking);
    } catch (err: any) {
      console.error('Error updating booking:', err);
      setError(err.message || 'Failed to update booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Modify Booking</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Check-in / Check-out Dates
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
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="guests" className="block text-gray-700 font-medium mb-2">
            Number of Guests
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setGuests(prev => Math.max(1, prev - 1))}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l"
              disabled={guests <= 1}
            >
              -
            </button>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              min={1}
              max={maxGuests}
              className="w-16 text-center py-2 border-t border-b border-gray-300"
            />
            <button
              type="button"
              onClick={() => setGuests(prev => Math.min(maxGuests, prev + 1))}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r"
              disabled={guests >= maxGuests}
            >
              +
            </button>
            <span className="ml-2 text-sm text-gray-600">
              (Max: {maxGuests})
            </span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingUpdateForm;

