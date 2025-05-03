// src/api/bookingService.ts
import { Booking } from '../types/venue';

const API_BASE_URL = 'https://v2.api.noroff.dev';

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
    const response = await fetch(`${API_BASE_URL}/holidaze/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Booking> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get bookings for a venue
export const getVenueBookings = async (venueId: string, token: string): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${venueId}/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Booking[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error getting bookings for venue ${venueId}:`, error);
    throw error;
  }
};

// Get bookings for the current user
export const getUserBookings = async (token: string): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/profiles/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Booking[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (bookingId: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deleting booking ${bookingId}:`, error);
    throw error;
  }
};