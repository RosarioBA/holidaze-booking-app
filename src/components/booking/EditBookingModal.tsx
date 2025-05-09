// src/components/booking/EditBookingModal.tsx

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { updateBooking } from '../../api/bookingService';
import { useAuth } from '../../contexts/AuthContext';
import { Booking, Venue } from '../../types/venue';

interface EditBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: (updatedBooking: Booking) => void;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({
  booking,
  onClose,
  onSuccess
}) => {
  const { token } = useAuth();
  const [startDate, setStartDate] = useState<Date | null>(booking.dateFrom ? new Date(booking.dateFrom) : null);
  const [endDate, setEndDate] = useState<Date | null>(booking.dateTo ? new Date(booking.dateTo) : null);
  const [guests, setGuests] = useState(booking.guests);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const venue = booking.venue as Venue;
  const maxGuests = venue?.maxGuests || 1;
  
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError('Please select check-in and check-out dates');
      return;
    }
    
    if (guests < 1 || guests > maxGuests) {
      setError(`Guest count must be between 1 and ${maxGuests}`);
      return;
    }
    
    if (!token) {
      setError('You must be logged in to update a booking');
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
      
      const updatedBooking = await updateBooking(booking.id, updateData, token);
      
      if (updatedBooking) {
        // Add venue data back since API doesn't return it
        onSuccess({
          ...updatedBooking,
          venue: booking.venue
        });
      } else {
        setError('Failed to update booking. Please try again.');
      }
    } catch (err: any) {
      console.error('Error updating booking:', err);
      setError(err.message || 'An error occurred while updating your booking');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
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
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0081A7] text-white rounded hover:bg-[#13262F]"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;