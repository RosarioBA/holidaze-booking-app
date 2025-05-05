// src/pages/dashboard/MyTripsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedLayout from '../../components/layout/AuthenticatedLayout';
import { getUserBookings } from '../../api/bookingService';

const MyTripsPage: React.FC = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const bookingsData = await getUserBookings(token);
        setBookings(bookingsData);
        
        // Sort into upcoming and past bookings
        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];
        
        bookingsData.forEach((booking: any) => {
          const checkOutDate = new Date(booking.dateTo);
          if (checkOutDate >= now) {
            upcoming.push(booking);
          } else {
            past.push(booking);
          }
        });
        
        // Sort upcoming by date (closest first)
        upcoming.sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());
        
        // Sort past by date (most recent first)
        past.sort((a, b) => new Date(b.dateTo).getTime() - new Date(a.dateTo).getTime());
        
        setUpcomingBookings(upcoming);
        setPastBookings(past);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your trips. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [token]);

  const formatDateRange = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`;
  };

  const calculateNights = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Trips</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {bookings.length === 0 && !error ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <h2 className="text-xl font-semibold mb-2">No trips booked yet</h2>
            <p className="text-gray-600 mb-4">Time to plan your next adventure!</p>
            <Link 
              to="/venues" 
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700"
            >
              Explore Venues
            </Link>
          </div>
        ) : (
          <>
            {/* Upcoming trips section */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
              
              {upcomingBookings.length === 0 ? (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-600">No upcoming trips scheduled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map(booking => (
                    <div 
                      key={booking.id} 
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row"
                    >
                      <div className="md:w-48 h-32 bg-gray-200 rounded overflow-hidden mb-4 md:mb-0 md:mr-4 flex-shrink-0">
                        {booking.venue?.media && booking.venue.media.length > 0 ? (
                          <img 
                            src={booking.venue.media[0].url} 
                            alt={booking.venue.name}
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
                      
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg">{booking.venue?.name || 'Venue'}</h3>
                        <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-600 mt-1 mb-3">
                          <span className="mr-4">{formatDateRange(booking.dateFrom, booking.dateTo)}</span>
                          <span>{calculateNights(booking.dateFrom, booking.dateTo)} nights · {booking.guests} guests</span>
                        </div>
                        
                        <div className="flex justify-end mt-2">
                          <Link 
                            to={`/bookings/${booking.id}`}
                            className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* Past trips section */}
            {pastBookings.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Past Trips</h2>
                <div className="space-y-4">
                  {pastBookings.map(booking => (
                    <div 
                      key={booking.id} 
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row"
                    >
                      <div className="md:w-48 h-32 bg-gray-200 rounded overflow-hidden mb-4 md:mb-0 md:mr-4 flex-shrink-0">
                        {booking.venue?.media && booking.venue.media.length > 0 ? (
                          <img 
                            src={booking.venue.media[0].url} 
                            alt={booking.venue.name}
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
                      
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg">{booking.venue?.name || 'Venue'}</h3>
                        <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-600 mt-1 mb-3">
                          <span className="mr-4">{formatDateRange(booking.dateFrom, booking.dateTo)}</span>
                          <span>{calculateNights(booking.dateFrom, booking.dateTo)} nights · {booking.guests} guests</span>
                        </div>
                        
                        <div className="flex justify-end mt-2">
                          <Link 
                            to={`/bookings/${booking.id}`}
                            className="bg-gray-600 text-white px-4 py-1 rounded text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
  );
};

export default MyTripsPage;