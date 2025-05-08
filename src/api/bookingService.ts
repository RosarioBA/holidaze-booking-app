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
// In bookingService.ts

export const getUserBookings = async (token: string): Promise<Booking[]> => {
  try {
    if (!token) {
      console.warn('No token provided');
      return getMockBookings();
    }
    
    // Get username from localStorage instead of token
    const userJSON = localStorage.getItem('user');
    let username = "rosario99"; // Fallback
    
    if (userJSON) {
      try {
        const user = JSON.parse(userJSON);
        username = user.name;
        console.log("Using username from localStorage:", username);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
    
    console.log(`Fetching bookings for user: ${username}`);
    
    // Make API request with username
    const response = await fetchFromApi<ApiResponse<Booking[]>>(
      `/holidaze/profiles/${username}/bookings?_venue=true`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log("API returned bookings:", response.data?.length || 0);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    
    // Return mock data for development
    console.log("Returning mock booking data");
    return getMockBookings();
  }
};

// Mock data to use when API fails
// Mock data to use when API fails
function getMockBookings(): Booking[] {
  return [
    {
      id: 'mock-1',
      dateFrom: '2024-06-15',
      dateTo: '2024-06-20',
      guests: 2,
      created: '2024-05-01',
      updated: '2024-05-01',
      venue: {
        id: 'venue-1',
        name: 'Seaside Villa',
        description: 'A beautiful villa by the sea',
        price: 1500,
        maxGuests: 6,
        rating: 4.8,
        created: '2023-01-01',    // Add these required properties
        updated: '2023-01-01',    // Add these required properties
        location: { 
          city: 'Oslo', 
          country: 'Norway',
          address: '123 Ocean Drive',  // Add these required properties
          zip: '0123',                 // Add these required properties
          continent: 'Europe',         // Add these required properties
          lat: 59.9,                   // Add these required properties
          lng: 10.7                    // Add these required properties
        },
        media: [{ url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', alt: 'Villa' }],
        meta: {                       // Add the meta object if required
          wifi: true,
          parking: true,
          breakfast: false,
          pets: false
        }
      }
    },
    {
      id: 'mock-2',
      dateFrom: '2024-07-10',
      dateTo: '2024-07-15',
      guests: 4,
      created: '2024-05-05',
      updated: '2024-05-05',
      venue: {
        id: 'venue-2',
        name: 'Mountain Cabin',
        description: 'Cozy cabin in the mountains',
        price: 950,
        maxGuests: 4,
        rating: 4.5,
        created: '2023-02-01',
        updated: '2023-02-01',
        location: { 
          city: 'Bergen', 
          country: 'Norway',
          address: '45 Mountain Road',
          zip: '5020',
          continent: 'Europe',
          lat: 60.4,
          lng: 5.3
        },
        media: [{ url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c', alt: 'Cabin' }],
        meta: {
          wifi: true,
          parking: true,
          breakfast: false,
          pets: true
        }
      }
    }
  ];
}

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