// src/pages/venue-manager/VenueManagerDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getVenueManagerVenues } from '../../api/venueService';
import { fetchFromApi } from '../../api/api';
import { Venue, Booking } from '../../types/venue';
import { getUserAvatar } from '../../utils/avatarUtils';

const VenueManagerDashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !user) return;

      setIsLoading(true);
      setError(null);

      try {
        const myVenues = await getVenueManagerVenues(user.name, token);
        setVenues(myVenues.slice(0, 3));

        try {
          const allBookings: Booking[] = [];

          for (const venue of myVenues) {
            try {
              const venueResponse = await fetchFromApi<any>(
                `/holidaze/venues/${venue.id}?_bookings=true`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );

              if (venueResponse.data?.bookings && Array.isArray(venueResponse.data.bookings)) {
                const venueBookings = venueResponse.data.bookings.map((booking: any) => ({
                  ...booking,
                  venue: {
                    id: venue.id,
                    name: venue.name
                  }
                }));
                allBookings.push(...venueBookings);
              }
            } catch (err) {}
          }

          const now = new Date();
          const upcomingBookings = allBookings.filter(booking =>
            booking.dateTo && new Date(booking.dateTo) >= now
          );

          upcomingBookings.sort((a, b) =>
            new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
          );

          setBookings(upcomingBookings.slice(0, 3));
        } catch (bookingErr) {
          setBookings([]);
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        setVenues([]);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getImageUrl = (venue: Venue) => {
    if (venue?.media && venue.media.length > 0 && venue.media[0].url) {
      return venue.media[0].url;
    }
    return 'https://placehold.co/300x200?text=No+Image';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 font-averia">Venue Manager Dashboard</h1>
        <p className="text-gray-600 font-light">Welcome back, {user?.name}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg font-averia">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/venue-manager/create" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0081A7] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium tracking-wide">Create New Venue</span>
          </Link>

          <Link to="/venue-manager/venues" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0081A7] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium tracking-wide">Manage Venues</span>
          </Link>

          <Link to="/venue-manager/bookings" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0081A7] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium tracking-wide">Manage Bookings</span>
          </Link>
        </div>
      </section>

      {/* Your Venues */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-lg font-averia">Your Venues</h2>
          <Link to="/venue-manager/venues" className="text-[#0081A7] hover:underline text-sm">
            View All
          </Link>
        </div>
        <div className="p-6">
          {venues.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-gray-600 mb-4">You haven't created any venues yet.</p>
              <Link
                to="/venue-manager/create"
                className="inline-block bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
              >
                Create Your First Venue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {venues.map(venue => (
                <div key={venue.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md relative">
                  <Link to={`/venues/${venue.id}`} state={{ returnTo: '/venue-manager/dashboard' }} className="block">
                    <div className="h-40 bg-gray-200">
                      <img
                        src={getImageUrl(venue)}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/300x200?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="p-4 pb-12">
                      <h3 className="font-medium mb-1 font-averia">{venue.name}</h3>
                      <p className="text-sm text-gray-600">
                        {venue.location?.city ? `${venue.location.city}, ` : ''}
                        {venue.location?.country || 'Location not specified'}
                      </p>
                      <span className="text-sm font-medium">{venue.price} kr/night</span>
                    </div>
                  </Link>
                  <div className="absolute bottom-4 right-4 z-10">
                    <Link
                      to={`/venue-manager/edit/${venue.id}`}
                      className="text-[#0081A7] hover:underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-lg font-averia">Recent Bookings</h2>
          <Link to="/venue-manager/bookings" className="text-[#0081A7] hover:underline text-sm">
            View All
          </Link>
        </div>
        <div className="p-6">
          {bookings.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-gray-600">No bookings yet for your venues.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/venues/${booking.venue?.id}`} state={{ returnTo: '/venue-manager/dashboard' }} className="text-[#0081A7] hover:underline">
                            {booking.venue?.name || 'Unknown venue'}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.customer ? (
                          <div className="flex items-center">
                            {booking.customer.name && getUserAvatar(booking.customer.name) ? (
                              <img
                                src={getUserAvatar(booking.customer.name)}
                                alt={booking.customer.name}
                                className="h-8 w-8 rounded-full mr-2"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://ui-avatars.com/api/?name=${booking.customer?.name || 'U'}`;
                                }}
                              />
                            ) : booking.customer.avatar?.url ? (
                              <img
                                src={booking.customer.avatar.url}
                                alt={booking.customer.name}
                                className="h-8 w-8 rounded-full mr-2"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://ui-avatars.com/api/?name=${booking.customer?.name || 'U'}`;
                                }}
                              />
                            ) : null}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                <Link to={`/profiles/${booking.customer.name}`} className="text-[#0081A7] hover:underline">
                                  {booking.customer.name}
                                </Link>
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.customer.email}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unknown guest</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/bookings/${booking.id}`} className="text-[#0081A7] hover:underline">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VenueManagerDashboardPage;
