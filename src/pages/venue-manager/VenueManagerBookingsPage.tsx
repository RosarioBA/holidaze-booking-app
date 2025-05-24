/**
 * @file VenueManagerBookingsPage.tsx
 * @description Page for venue managers to view and manage bookings for their venues
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getVenueManagerVenues } from '../../api/venueService';
import { getProfileBookings } from '../../api/bookingService';
import { Venue } from '../../types/venue';
import { fetchFromApi } from '../../api/api';
import { getUserAvatar } from '../../utils/avatarUtils';

/**
 * API response structure with pagination metadata
 */
interface ApiResponse<T> {
  data: T;
  meta: {
    isFirstPage?: boolean;
    isLastPage?: boolean;
    currentPage?: number;
    previousPage?: number | null;
    nextPage?: number | null;
    pageCount?: number;
    totalCount?: number;
  };
}

/**
 * Structure for venue booking data display
 */
interface VenueBooking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: {
    id: string;
    name: string;
  };
  customer?: {
    name: string;
    email: string;
    avatar?: { url: string; alt: string };
  };
}

/**
 * Booking status type with label and color information
 */
interface BookingStatus {
  label: string;
  color: string;
}

/**
 * Page component for venue managers to view and manage bookings for their venues
 * 
 * @returns {JSX.Element} Rendered component
 */
const VenueManagerBookingsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<VenueBooking[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  /**
   * Fetches all venues managed by the user and their bookings
   */
  useEffect(() => {
    const fetchVenuesAndBookings = async () => {
      if (!token || !user) return;
      
      setIsLoading(true);
      try {
        // First, get all venues owned by this manager
        const venuesData = await getVenueManagerVenues(user.name, token);
        setVenues(venuesData);
        
  
        
        // For each venue, fetch its bookings
        const allBookings: VenueBooking[] = [];
        
        for (const venue of venuesData) {
          try {
            // Try to get venue with bookings
            const venueResponse = await fetchFromApi<ApiResponse<any>>(
              `/holidaze/venues/${venue.id}?_bookings=true`, 
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            if (venueResponse.data?.bookings) {
              // Add venue info to each booking
              const venueBookings = venueResponse.data.bookings.map((booking: any) => ({
                ...booking,
                venue: {
                  id: venue.id,
                  name: venue.name
                }
              }));
              
              allBookings.push(...venueBookings);
            }
          } catch (err) {
            // Continue with next venue if there's an error with this one
          }
        }
        
        // Sort bookings by date (most recent first)  
        allBookings.sort((a, b) => 
          new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()
        );
        
        setBookings(allBookings);
        setError(null);
      } catch (err) {
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVenuesAndBookings();
  }, [token, user]);

  /**
   * Formats a date string to a localized date string
   * 
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  /**
   * Calculates the duration in nights between two dates
   * 
   * @param {string} checkIn - Check-in date string
   * @param {string} checkOut - Check-out date string
   * @returns {number} Number of nights
   */
  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  /**
   * Determines booking status based on check-in and check-out dates
   * 
   * @param {string} checkIn - Check-in date string
   * @param {string} checkOut - Check-out date string
   * @returns {BookingStatus} Booking status with label and color
   */
  const getBookingStatus = (checkIn: string, checkOut: string): BookingStatus => {
    const now = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (now < checkInDate) {
      return { label: 'Upcoming', color: 'bg-blue-80 text-blue-800' };
    } else if (now >= checkInDate && now <= checkOutDate) {
      return { label: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  /**
   * Filter bookings based on selected venue and time filter
   */
  const filteredBookings = bookings.filter(booking => {
    // Venue filter
    if (selectedVenue !== 'all' && booking.venue?.id !== selectedVenue) {
      return false;
    }
    
    // Time filter
    const now = new Date();
    const checkOutDate = new Date(booking.dateTo);
    
    switch (activeFilter) {
      case 'upcoming':
        return new Date(booking.dateFrom) > now;
      case 'past':
        return checkOutDate < now;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 font-averia">Bookings Management</h1>
        <p className="text-gray-600 font-light">View and manage all bookings for your venues</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Venue filter */}
        <div className="flex-1">
          <label htmlFor="venueFilter" className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
            Filter by Venue
          </label>
          <select
            id="venueFilter"
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Venues</option>
            {venues.map(venue => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Time filter */}
        <div className="flex items-end gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded border ${
              activeFilter === 'all' 
                ? 'bg-[#0081A7] text-white border-[#0081A7]' 
                : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
            } font-medium tracking-wide`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-4 py-2 rounded border ${
              activeFilter === 'upcoming' 
                ? 'bg-[#0081A7] text-white border-[#0081A7]' 
                : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter('past')}
            className={`px-4 py-2 rounded border ${
              activeFilter === 'past' 
                ? 'bg-[#0081A7] text-white border-[#0081A7]' 
                : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
            }`}
          >
            Past
          </button>
        </div>
      </div>
      
      {/* Bookings table */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2 font-averia">No bookings found</h2>
          <p className="text-gray-600">
            {selectedVenue === 'all' 
              ? "You don't have any bookings for your venues yet."
              : "No bookings found for the selected venue."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map(booking => {
                  const status = getBookingStatus(booking.dateFrom, booking.dateTo);
                  const nights = calculateNights(booking.dateFrom, booking.dateTo);
                  
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{booking.id.substring(0, 8)}...
                        </div>
                        <div className="text-sm text-gray-500">
                          {nights} night{nights !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.venue?.name || 'Unknown venue'}
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
                          <span className="text-sm text-gray-500">Unknown customer</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Summary cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2 font-averia">Total Bookings</h3>
          <p className="text-3xl font-bold text-[#0081A7]">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2 font-averia">Upcoming Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">
            {bookings.filter(b => new Date(b.dateFrom) > new Date()).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2 font-averia">Total Venues</h3>
          <p className="text-3xl font-bold text-green-600">{venues.length}</p>
        </div>
      </div>
    </div>
  );
};

export default VenueManagerBookingsPage;