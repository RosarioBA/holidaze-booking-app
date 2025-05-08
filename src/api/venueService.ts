// src/api/venueService.ts
import { Venue, VenueFilters } from '../types/venue';
import { fetchFromApi } from './api';

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
    const response = await fetchFromApi<ApiResponse<Venue[]>>(`/holidaze/venues?page=${page}&limit=${limit}&sort=${sort}&sortOrder=${sortOrder}`);
    
    return {
      venues: response.data,
      meta: response.meta
    };
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

// Function to get a single venue by ID
export const getVenueById = async (id: string, includeOwner = false, includeBookings = false): Promise<Venue> => {
  try {
    let endpoint = `/holidaze/venues/${id}`;
    const queryParams = [];
    
    if (includeOwner) {
      queryParams.push('_owner=true');
    }
    
    if (includeBookings) {
      queryParams.push('_bookings=true');
    }
    
    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`;
    }
    
    const response = await fetchFromApi<ApiResponse<Venue>>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching venue with ID ${id}:`, error);
    throw error;
  }
};

// Function to get venues for the current venue manager
export const getVenueManagerVenues = async (profileName: string, token: string): Promise<Venue[]> => {
  try {
    // First check if the user's venues are in the API
    const response = await fetchFromApi<ApiResponse<Venue[]>>(`/holidaze/profiles/${profileName}/venues`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Found ${response.data.length} venues for profile ${profileName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching venues for venue manager ${profileName}:`, error);
    throw error;
  }
};

// Function to search venues
export const searchVenues = async (query: string): Promise<Venue[]> => {
  try {
    const response = await fetchFromApi<ApiResponse<Venue[]>>(`/holidaze/venues/search?q=${encodeURIComponent(query)}`);
    return response.data;
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
    if (filters.wifi !== undefined && venue.meta?.wifi !== filters.wifi) {
      return false;
    }
    
    if (filters.parking !== undefined && venue.meta?.parking !== filters.parking) {
      return false;
    }
    
    if (filters.breakfast !== undefined && venue.meta?.breakfast !== filters.breakfast) {
      return false;
    }
    
    if (filters.pets !== undefined && venue.meta?.pets !== filters.pets) {
      return false;
    }
    
    return true;
  });
};

// Function to create a new venue (for venue managers)
export const createVenue = async (venueData: Omit<Venue, 'id' | 'created' | 'updated'>, token: string): Promise<Venue> => {
  try {
    const response = await fetchFromApi<ApiResponse<Venue>>('/holidaze/venues', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(venueData)
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

// Function to update a venue (for venue managers)
export const updateVenue = async (id: string, venueData: Partial<Venue>, token: string): Promise<Venue> => {
  try {
    const response = await fetchFromApi<ApiResponse<Venue>>(`/holidaze/venues/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(venueData)
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating venue with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a venue (for venue managers)
export const deleteVenue = async (id: string, token: string): Promise<void> => {
  try {
    await fetchFromApi(`/holidaze/venues/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error(`Error deleting venue with ID ${id}:`, error);
    throw error;
  }
};