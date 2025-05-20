/**
 * @file bookingService.ts
 * @description Service for managing venue bookings including creating, retrieving, updating, and deleting bookings
 */

import { Booking } from '../types/venue';
import { fetchFromApi } from './api';

/**
 * API response structure with pagination metadata
 * @template T The type of data contained in the response
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
 * Data required to create a new booking
 */
interface CreateBookingData {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}

/**
 * Data for updating an existing booking
 */
interface UpdateBookingData {
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
} 

/**
 * Creates a new booking for a venue
 * 
 * @param {CreateBookingData} bookingData - Data for the booking to be created
 * @param {string} token - Authentication token
 * @returns {Promise<Booking>} The created booking
 * @throws {Error} If the booking creation fails or authentication is missing
 */
export const createBooking = async (bookingData: CreateBookingData, token: string): Promise<Booking> => {
  if (!token) {
    throw new Error('Authorization token is required');
  }
  
  const response = await fetchFromApi<ApiResponse<Booking>>('/holidaze/bookings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });
  
  return response.data;
};

/**
 * Retrieves all bookings for a specific venue
 * 
 * @param {string} venueId - ID of the venue to get bookings for
 * @param {string} token - Authentication token
 * @returns {Promise<Booking[]>} Array of bookings for the venue
 * @throws {Error} If parameters are missing
 */
export const getVenueBookings = async (venueId: string, token: string): Promise<Booking[]> => {
  if (!venueId) {
    throw new Error('Venue ID is required');
  }
  
  if (!token) {
    throw new Error('Authorization token is required');
  }
  
  // Since there's no direct endpoint for venue bookings, we need to get ALL bookings
  // and filter them based on venue ID
  const response = await fetchFromApi<ApiResponse<Booking[]>>(
    `/holidaze/bookings?_venue=true&_customer=true`, 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  // Filter bookings to only include those for the specified venue
  const allBookings = response.data || [];
  return allBookings.filter(booking => booking.venue?.id === venueId);
};

/**
 * Gets bookings for the currently authenticated user
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<Booking[]>} User's bookings
 * @throws {Error} If token is missing or user information cannot be determined
 */
export const getUserBookings = async (token: string): Promise<Booking[]> => {
  if (!token) {
    throw new Error('Authorization token is required');
  }
  
  // Get username from localStorage
  const userJSON = localStorage.getItem('user');
  let username = "";
  
  if (userJSON) {
    try {
      const user = JSON.parse(userJSON);
      username = user.name;
    } catch (e) {
      throw new Error('Failed to parse user data from localStorage');
    }
  }
  
  if (!username) {
    throw new Error('Username could not be determined');
  }
  
  // Make API request with username
  const response = await fetchFromApi<ApiResponse<Booking[]>>(
    `/holidaze/profiles/${username}/bookings?_venue=true`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.data || [];
};

/**
 * Gets bookings for a specific user profile
 * 
 * @param {string} profileName - Username of the profile to get bookings for
 * @param {string} token - Authentication token
 * @returns {Promise<Booking[]>} Profile's bookings
 * @throws {Error} If parameters are missing
 */
export const getProfileBookings = async (profileName: string, token: string): Promise<Booking[]> => {
  if (!token || !profileName) {
    throw new Error('Authorization token and profile name are required');
  }
  
  const response = await fetchFromApi<ApiResponse<Booking[]>>(
    `/holidaze/profiles/${profileName}/bookings?_venue=true&_customer=true`, 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.data || [];
};

/**
 * Gets a single booking by its ID
 * 
 * @param {string} bookingId - ID of the booking to retrieve
 * @param {string} token - Authentication token
 * @returns {Promise<Booking>} The requested booking
 * @throws {Error} If parameters are missing or booking cannot be found
 */
export const getBookingById = async (bookingId: string, token: string): Promise<Booking> => {
  if (!bookingId) {
    throw new Error('Booking ID is required');
  }
  
  if (!token) {
    throw new Error('Authorization token is required');
  }
  
  const response = await fetchFromApi<ApiResponse<Booking>>(`/holidaze/bookings/${bookingId}?_venue=true`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

/**
 * Updates an existing booking
 * 
 * @param {string} bookingId - ID of the booking to update
 * @param {UpdateBookingData} updateData - New booking data
 * @param {string} token - Authentication token
 * @returns {Promise<Booking>} Updated booking
 * @throws {Error} If parameters are missing or update fails
 */
export const updateBooking = async (
  bookingId: string, 
  updateData: UpdateBookingData, 
  token: string
): Promise<Booking> => {
  if (!bookingId) {
    throw new Error('Booking ID is required');
  }
  
  if (!token) {
    throw new Error('Authorization token is required');
  }
  
  const response = await fetchFromApi<ApiResponse<Booking>>(`/holidaze/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
  
  return response.data;
};

/**
 * Deletes a booking
 * 
 * @param {string} bookingId - ID of the booking to delete
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} True if deletion was successful
 * @throws {Error} If parameters are missing
 */
export const deleteBooking = async (bookingId: string, token: string): Promise<boolean> => {
  if (!bookingId) {
    throw new Error('Booking ID is required');
  }
  
  if (!token) {
    throw new Error('Authorization token is required');
  }
  
  try {
    await fetchFromApi(`/holidaze/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return true;
  } catch (error) {
    throw new Error(`Failed to delete booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};