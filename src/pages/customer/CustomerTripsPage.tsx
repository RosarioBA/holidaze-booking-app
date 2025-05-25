// src/pages/customer/CustomerTripsPage.tsx

/**
 * @file CustomerTripsPage.tsx
 * @description Page displaying all customer bookings with filters
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserBookings } from '../../api/bookingService';

// Components
import BookingCard from '../../components/booking/BookingCard';
import BookingFilters from '../../components/booking/BookingFilters';
import CancelBookingModal from '../../components/booking/CancelBookingModal';
import EditBookingModal from '../../components/booking/EditBookingModal';
import RatingModal from '../../components/venue/RatingModal';

/**
 * Customer trips page for viewing and managing bookings
 */
const CustomerTripsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // Modal states
  const [modalState, setModalState] = useState({
    cancel: { show: false, booking: null as any },
    edit: { show: false, booking: null as any },
    rate: { show: false, venue: null as { id: string; name: string } | null }
  });

  /**
   * Fetches bookings from the API
   */
  const fetchBookings = async () => {
    if (!token || !user) return;
    
    setIsLoading(true);
    try {
      const bookingsData = await getUserBookings(token);
      const useMockFromStorage = localStorage.getItem('useMockBookings') === 'true';
      setUseMockData(useMockFromStorage);
      
      if (bookingsData.length > 0) {
        const sortedBookings = [...bookingsData].sort((a, b) => 
          new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()
        );
        
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
        setError(null);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (err: any) {
      setUseMockData(true);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, [token, user]);
  
  // Apply filter when data changes
  useEffect(() => {
    const now = new Date();
    
    switch (activeFilter) {
      case 'upcoming':
        setFilteredBookings(bookings.filter(booking => 
          new Date(booking.dateTo) >= now
        ));
        break;
      case 'past':
        setFilteredBookings(bookings.filter(booking => 
          new Date(booking.dateTo) < now
        ));
        break;
      default:
        setFilteredBookings(bookings);
    }
  }, [bookings, activeFilter]);

  // Modal handlers
  const handleCancelBooking = (booking: any) => {
    setModalState(prev => ({
      ...prev,
      cancel: { show: true, booking }
    }));
  };

  const handleEditBooking = (booking: any) => {
    setModalState(prev => ({
      ...prev,
      edit: { show: true, booking }
    }));
  };

  const handleRateVenue = (venueId: string, venueName: string) => {
    setModalState(prev => ({
      ...prev,
      rate: { show: true, venue: { id: venueId, name: venueName } }
    }));
  };

  const handleCancellationSuccess = () => {
    setModalState(prev => ({
      ...prev,
      cancel: { show: false, booking: null }
    }));
    
    fetchBookings();
  };

  const handleEditSuccess = (updatedBooking: any) => {
    setModalState(prev => ({
      ...prev,
      edit: { show: false, booking: null }
    }));
    
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
  };

  const handleRatingSubmitted = () => {
    setModalState(prev => ({
      ...prev,
      rate: { show: false, venue: null }
    }));
  };

  // Render empty state
  const renderEmptyState = () => (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h2 className="text-xl font-semibold mb-2 font-averia">No trips found</h2>
      <p className="text-gray-600 mb-6 font-light tracking-wide">
        {activeFilter === 'upcoming'
          ? "You don't have any upcoming trips planned."
          : activeFilter === 'past'
          ? "You don't have any past trips."
          : "You haven't booked any trips yet."}
      </p>

      <Link 
        to="/venues" 
        className="inline-block bg-[#0081A7] text-white px-6 py-3 rounded-lg hover:bg-[#13262F] transition"
      >
        Explore Venues
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 font-averia">My Trips</h1>
        <p className="text-gray-600 font-light">Manage your upcoming and past bookings</p>
      </div>
      
      {useMockData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          Note: Displaying sample booking data for development.
        </div>
      )}
      
      {error && !useMockData && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <BookingFilters 
        activeFilter={activeFilter} 
        onChange={setActiveFilter} 
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="space-y-6">
          {filteredBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              user={user}
              onEdit={handleEditBooking}
              onCancel={handleCancelBooking}
              onRate={handleRateVenue}
            />
          ))}
        </div>
      )}
      
      {/* Modals */}
      {modalState.cancel.show && modalState.cancel.booking && (
        <CancelBookingModal
          bookingId={modalState.cancel.booking.id}
          venueName={modalState.cancel.booking.venue?.name || 'this venue'}
          onClose={() => setModalState(prev => ({...prev, cancel: { show: false, booking: null }}))}
          onSuccess={handleCancellationSuccess}
        />
      )}
      
      {modalState.edit.show && modalState.edit.booking && (
        <EditBookingModal
          booking={modalState.edit.booking}
          onClose={() => setModalState(prev => ({...prev, edit: { show: false, booking: null }}))}
          onSuccess={handleEditSuccess}
        />
      )}
      
      {modalState.rate.show && modalState.rate.venue && (
        <RatingModal
          venueId={modalState.rate.venue.id}
          venueName={modalState.rate.venue.name}
          onClose={() => setModalState(prev => ({...prev, rate: { show: false, venue: null }}))}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
};

export default CustomerTripsPage;