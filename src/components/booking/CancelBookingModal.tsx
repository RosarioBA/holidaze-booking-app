/**
 * @file CancelBookingModal.tsx
 * @description Modal component for confirming and processing booking cancellations
 */

import React, { useState } from 'react';
import { deleteBooking } from '../../api/bookingService';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Props for the CancelBookingModal component
 */
interface CancelBookingModalProps {
  /** ID of the booking to cancel */
  bookingId: string;
  /** Name of the venue for display in confirmation message */
  venueName: string;
  /** Function to call when cancellation is aborted */
  onClose: () => void;
  /** Function to call when cancellation is successful */
  onSuccess: () => void;
}

/**
 * Modal component for confirming and processing booking cancellations
 * 
 * @param {CancelBookingModalProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  bookingId,
  venueName,
  onClose,
  onSuccess
}) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Handles the booking cancellation process
   */
  const handleCancel = async () => {
    if (!token) {
      setError('You must be logged in to cancel a booking');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await deleteBooking(bookingId, token);
      
      if (success) {
        onSuccess();
      } else {
        setError('Failed to cancel booking. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while cancelling your booking');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
        
        <p className="mb-6 text-gray-700">
          Are you sure you want to cancel your booking at <span className="font-semibold">{venueName}</span>? This action cannot be undone.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Keep Booking
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;