// src/api/bookingService.ts
import { Booking } from '../types/venue';

const API_BASE_URL = 'https://v2.api.noroff.dev';
const API_KEY = '54941b48-0ce5-4d6d-a8f2-9e3dcc28ddcf'; // Store this securely in a .env file in a real application

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

// Helper function to create headers with token and API key
const createHeaders = (token: string) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Noroff-API-Key': API_KEY
  };
};

// Create a new booking
export const createBooking = async (bookingData: CreateBookingData, token: string): Promise<Booking> => {
  try {
    if (!token) {
      throw new Error('Authorization token is required');
    }
    
    const response = await fetch(`${API_BASE_URL}/holidaze/bookings`, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.errors?.[0]?.message || `API error: ${response.statusText}`);
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
    if (!venueId) {
      throw new Error('Venue ID is required');
    }
    
    if (!token) {
      throw new Error('Authorization token is required');
    }
    
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${venueId}/bookings`, {
      headers: createHeaders(token)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.errors?.[0]?.message || `API error: ${response.statusText}`);
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
    if (!token) {
      throw new Error('Authorization token is required');
    }
    
    // Extract the username from the token (JWT)
    let username;
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      username = payload.name; // This depends on the JWT structure
      
      if (!username) {
        throw new Error('Could not extract username from token');
      }
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      throw new Error('Invalid authentication token');
    }
    
    // Use the correct endpoint with the username
    const response = await fetch(`${API_BASE_URL}/holidaze/profiles/${username}/bookings?_venue=true`, {
      headers: createHeaders(token)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.errors?.[0]?.message || `API error: ${response.statusText}`);
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
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }
    
    if (!token) {
      throw new Error('Authorization token is required');
    }
    
    const response = await fetch(`${API_BASE_URL}/holidaze/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: createHeaders(token)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.errors?.[0]?.message || `API error: ${response.statusText}`);
    }
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
    
    const response = await fetch(`${API_BASE_URL}/holidaze/bookings/${bookingId}?_venue=true`, {
      headers: createHeaders(token)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.errors?.[0]?.message || `API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Booking> = await response.json();
    return result.data;
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
    
    const response = await fetch(`${API_BASE_URL}/holidaze/bookings/${bookingId}`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.errors?.[0]?.message || `API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Booking> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating booking ${bookingId}:`, error);
    throw error;
  }
};