// src/api/venueService.ts
import { Venue, VenueFilters } from '../types/venue';

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

// Function to get all venues with optional pagination
export const getVenues = async (page = 1, limit = 100, sort = 'created', sortOrder = 'desc'): Promise<{venues: Venue[], meta: any}> => {
  try {
    const url = new URL(`${API_BASE_URL}/holidaze/venues`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('sort', sort);
    url.searchParams.append('sortOrder', sortOrder);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Venue[]> = await response.json();
    return {
      venues: result.data,
      meta: result.meta
    };
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

// Function to get a single venue by ID
export const getVenueById = async (id: string, includeOwner = false, includeBookings = false): Promise<Venue> => {
  try {
    const url = new URL(`${API_BASE_URL}/holidaze/venues/${id}`);
    
    if (includeOwner) {
      url.searchParams.append('_owner', 'true');
    }
    
    if (includeBookings) {
      url.searchParams.append('_bookings', 'true');
    }
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Venue> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching venue with ID ${id}:`, error);
    throw error;
  }
};

// Function to search venues
export const searchVenues = async (query: string): Promise<Venue[]> => {
  try {
    const url = new URL(`${API_BASE_URL}/holidaze/venues/search`);
    url.searchParams.append('q', query);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Venue[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error searching venues:', error);
    throw error;
  }
};

// Function to filter venues (client-side, when API doesn't support all filter options)
export const filterVenues = (venues: Venue[], filters: VenueFilters): Venue[] => {
  return venues.filter(venue => {
    // Filter by price range
    if (filters.minPrice !== undefined && venue.price < filters.minPrice) {
      return false;
    }
    
    if (filters.maxPrice !== undefined && venue.price > filters.maxPrice) {
      return false;
    }
    
    // Filter by max guests
    if (filters.maxGuests !== undefined && venue.maxGuests < filters.maxGuests) {
      return false;
    }
    
    // Filter by amenities
    if (filters.wifi !== undefined && venue.meta.wifi !== filters.wifi) {
      return false;
    }
    
    if (filters.parking !== undefined && venue.meta.parking !== filters.parking) {
      return false;
    }
    
    if (filters.breakfast !== undefined && venue.meta.breakfast !== filters.breakfast) {
      return false;
    }
    
    if (filters.pets !== undefined && venue.meta.pets !== filters.pets) {
      return false;
    }
    
    return true;
  });
};

// Function to create a new venue (for venue managers)
export const createVenue = async (venueData: Omit<Venue, 'id' | 'created' | 'updated'>, token: string): Promise<Venue> => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(venueData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Venue> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

// Function to update a venue (for venue managers)
export const updateVenue = async (id: string, venueData: Partial<Venue>, token: string): Promise<Venue> => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(venueData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    
    const result: ApiResponse<Venue> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating venue with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a venue (for venue managers)
export const deleteVenue = async (id: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
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
    console.error(`Error deleting venue with ID ${id}:`, error);
    throw error;
  }
};