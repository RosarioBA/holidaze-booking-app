// src/api/bookingService.ts
import { Booking } from '../types/venue';
import { fetchFromApi, getUsernameFromToken } from './api';

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

interface CreateBookingData {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}

// Create a new booking
export const createBooking = async (bookingData: CreateBookingData, token: string): Promise<Booking> => {
  try {
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
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get bookings for a venue
export const getVenueBookings = async (venueId: string, token: string): Promise<Booking[]> => {
  try {
    if (!venueId) {
      throw new Error('Venue ID is required');
    }
    
    if (!token) {
      throw new Error('Authorization token is required');
    }
    
    const response = await fetchFromApi<ApiResponse<Booking[]>>(`/holidaze/venues/${venueId}/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error getting bookings for venue ${venueId}:`, error);
    throw error;
  }
};

// Get bookings for the current user
export const getUserBookings = async (token: string): Promise<Booking[]> => {
  try {
    if (!token) {
      throw new Error('Authorization token is required');
    }
    
    // Extract the username from the token
    const username = getUsernameFromToken(token);
    
    // Use the correct endpoint with the username
    const response = await fetchFromApi<ApiResponse<Booking[]>>(`/holidaze/profiles/${username}/bookings?_venue=true`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (bookingId: string, token: string): Promise<void> => {
  try {
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }
    
    if (!token) {
      throw new Error('Authorization token is required');
    }
    
    await fetchFromApi(`/holidaze/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error(`Error deleting booking ${bookingId}:`, error);
    throw error;
  }
};

// Get a single booking by ID
export const getBookingById = async (bookingId: string, token: string): Promise<Booking> => {
  try {
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
  } catch (error) {
    console.error(`Error getting booking ${bookingId}:`, error);
    throw error;
  }
};

// Update a booking
export const updateBooking = async (
  bookingId: string, 
  bookingData: Partial<Pick<CreateBookingData, 'dateFrom' | 'dateTo' | 'guests'>>, 
  token: string
): Promise<Booking> => {
  try {
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
      body: JSON.stringify(bookingData)
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${bookingId}:`, error);
    throw error;
  }
};