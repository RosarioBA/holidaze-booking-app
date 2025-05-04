// src/pages/booking/BookingDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedLayout from '../../components/layout/AuthenticatedLayout';
import BookingUpdateForm from '../../components/booking/BookingUpdateForm';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { getBookingById, deleteBooking } from '../../api/bookingService';
import { Booking } from '../../types/venue'; // Import from the updated types file

const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id || !token) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the bookingService function instead of making a direct API call
        const bookingData = await getBookingById(id, token);
        setBooking(bookingData);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBooking();
  }, [id, token]);

  const handleUpdateSuccess = (updatedBooking: Booking) => {
    setBooking(updatedBooking);
    setIsEditing(false);
    setSuccessMessage('Booking updated successfully!');
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleDeleteBooking = async () => {
    if (!id || !token) return;
    
    try {
      setIsDeleting(true);
      
      // Use the bookingService function instead of making a direct API call
      await deleteBooking(id, token);
      
      // Navigate to My Trips page after successful deletion
      navigate('/my-trips', { state: { message: 'Booking cancelled successfully' } });
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to cancel booking. Please try again later.');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error || !booking) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error || 'Booking not found'}
          </div>
          <Link to="/my-trips" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to My Trips
          </Link>
        </div>
      </AuthenticatedLayout>
    );
  }

  const startDate = parseISO(booking.dateFrom);
  const endDate = parseISO(booking.dateTo);
  const nightsCount = differenceInDays(endDate, startDate);
  const totalPrice = booking.venue ? booking.venue.price * nightsCount : 0;
  
  // Check if the booking is in the future (can be modified)
  const isUpcoming = new Date(booking.dateFrom) > new Date();

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}
        
        {/* Back Button */}
        <Link to="/my-trips" className="text-blue-600 hover:underline flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to My Trips
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
        
        {isEditing ? (
          <BookingUpdateForm 
            booking={booking}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleUpdateSuccess}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Venue Image & Info */}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 h-64 bg-gray-200">
                {booking.venue?.media && booking.venue.media.length > 0 ? (
                  <img
                    src={booking.venue.media[0].url}
                    alt={booking.venue.media[0].alt || booking.venue.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/600x400?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              
              <div className="p-6 md:w-3/5">
                <h2 className="text-xl font-bold mb-2">
                  {booking.venue?.name || 'Venue Not Available'}
                </h2>
                
                {booking.venue?.location && (
                  <p className="text-gray-600 mb-4">
                    {[booking.venue.location.city, booking.venue.location.country]
                      .filter(Boolean)
                      .join(', ') || 'Location not specified'}
                  </p>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Booking Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600">Check-in:</span>
                      <p className="font-medium">{format(startDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Check-out:</span>
                      <p className="font-medium">{format(endDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">{nightsCount} {nightsCount === 1 ? 'night' : 'nights'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Guests:</span>
                      <p className="font-medium">{booking.guests}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Price Details</h3>
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>${booking.venue?.price || 0} x {nightsCount} nights</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
                
                {isUpcoming && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Modify Booking
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
                
                {!isUpcoming && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded">
                    <p>This booking cannot be modified or cancelled as the check-in date has passed.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Booking Info */}
            <div className="p-6 border-t border-gray-200">
              <h3 className="font-semibold mb-2">Additional Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 block">Booking ID</span>
                  <span className="font-medium">{booking.id.substring(0, 8)}...</span>
                </div>
                <div>
                  <span className="text-gray-600 block">Booked On</span>
                  <span className="font-medium">{booking.created ? format(parseISO(booking.created), 'MMM d, yyyy') : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600 block">Last Updated</span>
                  <span className="font-medium">{format(parseISO(booking.updated ?? ''), 'MMM d, yyyy')}</span>
                </div>
                {booking.venue && (
                  <div>
                    <span className="text-gray-600 block">Max Guests</span>
                    <span className="font-medium">{booking.venue.maxGuests}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          title="Cancel Booking"
          message="Are you sure you want to cancel this booking? This action cannot be undone."
          confirmText="Yes, Cancel Booking"
          cancelText="No, Keep Booking"
          isLoading={isDeleting}
          onConfirm={handleDeleteBooking}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </AuthenticatedLayout>
  );
};

export default BookingDetailPage;