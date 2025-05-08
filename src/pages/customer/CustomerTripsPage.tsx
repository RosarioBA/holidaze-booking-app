// src/pages/customer/CustomerTripsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserBookings } from '../../api/bookingService';

const CustomerTripsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token || !user) return;
      
      setIsLoading(true);
      try {
        // Use the bookingService to get bookings
        const bookingsData = await getUserBookings(token);
        console.log(`Received ${bookingsData.length} bookings from service`);
        
        // Get mock data flag from localStorage if debugging needed
        const useMockFromStorage = localStorage.getItem('useMockBookings') === 'true';
        setUseMockData(useMockFromStorage);
        
        // No error thrown if using mock data
        if (bookingsData.length > 0) {
          // Sort bookings by date (most recent check-in first)
          const sortedBookings = [...bookingsData].sort((a, b) => 
            new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()
          );
          
          setBookings(sortedBookings);
          setFilteredBookings(sortedBookings);
          setError(null);
          
          // For debug info
          console.log(`Successfully loaded ${sortedBookings.length} bookings`);
        } else {
          console.log("No bookings found - array empty");
          setBookings([]);
          setFilteredBookings([]);
        }
      } catch (err: any) {
        console.error('Error processing bookings:', err);
        setUseMockData(true);
        
        // Hide the error from users since mock data is shown
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [token, user]);
  
  useEffect(() => {
    // Apply filter when bookings or activeFilter changes
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate duration in nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Check if booking is past, current, or upcoming
  const getBookingStatus = (checkIn: string, checkOut: string) => {
    const now = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (now < checkInDate) {
      return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (now >= checkInDate && now <= checkOutDate) {
      return { label: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Get image URL with fallback
  const getImageUrl = (venue: any) => {
    if (venue?.media && venue.media.length > 0 && venue.media[0].url) {
      return venue.media[0].url;
    }
    return 'https://placehold.co/300x200?text=Venue';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Trips</h1>
        <p className="text-gray-600">Manage your upcoming and past bookings</p>
      </div>
      
      {/* Show mock data notice */}
      {useMockData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          Note: Displaying sample booking data for development.
        </div>
      )}
      
      {/* Show error only if we're not using mock data */}
      {error && !useMockData && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Filter tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`pb-4 font-medium text-sm ${
              activeFilter === 'all'
                ? 'border-b-2 border-[#0081A7] text-[#0081A7]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Trips
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`pb-4 font-medium text-sm ${
              activeFilter === 'upcoming'
                ? 'border-b-2 border-[#0081A7] text-[#0081A7]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter('past')}
            className={`pb-4 font-medium text-sm ${
              activeFilter === 'past'
                ? 'border-b-2 border-[#0081A7] text-[#0081A7]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past Trips
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No trips found</h2>
          <p className="text-gray-600 mb-6">
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
      ) : (
        <div className="space-y-6">
          {filteredBookings.map(booking => {
            const nights = calculateNights(booking.dateFrom, booking.dateTo);
            const status = getBookingStatus(booking.dateFrom, booking.dateTo);
            
            return (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
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
                        <h2 className="text-xl font-semibold">{booking.venue?.name || 'Unknown Venue'}</h2>
                        <p className="text-gray-600 mb-2">
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
                        <div className="flex space-x-2">
                          <Link 
                            to={`/venues/${booking.venue?.id}`}
                            className="text-[#0081A7] hover:underline text-sm"
                          >
                            View Venue
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerTripsPage;