// src/api/venueService.ts
import { Venue, VenueFilters } from '../types/venue';
import { fetchFromApi } from './api';

interface ApiResponse<T> {
  data?: T;
  venues?: T;
  meta?: {
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
export const getVenues = async (page = 1, limit = 100, sort = 'created', sortOrder = 'desc') => {
  try {
    // Ensure page is a valid number
    const validPage = isNaN(Number(page)) ? 1 : Number(page);
    
    const response = await fetchFromApi(
      `/holidaze/venues?page=${validPage}&limit=${limit}&sort=${sort}&sortOrder=${sortOrder}`
    );
    
    // Log the response structure for debugging
    console.log("Venue service received data:", response);
    
    // Handle different response formats
    let result: any = {
      venues: [],
      meta: {
        currentPage: 1,
        pageCount: 1,
        isFirstPage: true,
        isLastPage: true
      }
    };
    
    // Check for various response structures and normalize them
    if (Array.isArray(response)) {
      // If response is directly an array of venues
      result.venues = response;
    } else if (typeof response === 'object' && response !== null && 'data' in response) {
      // If response has data property
      if (Array.isArray(response.data)) {
        result.venues = response.data;
      } else {
        result.venues = [response.data];
      }
      
      // If response has meta, use it
      if ('meta' in response && response.meta) {
        result.meta = response.meta;
      }
    } else if (typeof response === 'object' && response !== null && 'venues' in response && Array.isArray((response as any).venues)) {
      // If response has venues property
      result = response;
    }
    
    return result;
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
    
    // Handle different response structures
    if (response.data) {
      return response.data;
    } else if (response.venues && !Array.isArray(response.venues)) {
      return response.venues;
    } else {
      // If the API changes and returns a different structure, try to handle it
      return response as unknown as Venue;
    }
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
    
    // Handle different response structures
    let venues: Venue[] = [];
    
    if (response.data && Array.isArray(response.data)) {
      venues = response.data;
    } else if (response.venues && Array.isArray(response.venues)) {
      venues = response.venues;
    } else if (Array.isArray(response)) {
      venues = response;
    }
    
    console.log(`Found ${venues.length} venues for profile ${profileName}`);
    return venues;
  } catch (error) {
    console.error(`Error fetching venues for venue manager ${profileName}:`, error);
    throw error;
  }
};

// Function to search venues
export const searchVenues = async (query: string): Promise<Venue[]> => {
  try {
    const response = await fetchFromApi<ApiResponse<Venue[]>>(`/holidaze/venues/search?q=${encodeURIComponent(query)}`);
    
    // Handle different response structures
    let venues: Venue[] = [];
    
    if (response.data && Array.isArray(response.data)) {
      venues = response.data;
    } else if (response.venues && Array.isArray(response.venues)) {
      venues = response.venues;
    } else if (Array.isArray(response)) {
      venues = response;
    }
    
    return venues;
  } catch (error) {
    console.error('Error searching venues:', error);
    throw error;
  }
};

// Function to filter venues (client-side, when API doesn't support all filter options)
export const filterVenues = (venues: Venue[], filters: VenueFilters): Venue[] => {
  console.log("Filtering venues with:", filters);
  console.log("Before filtering:", venues.length, "venues");
  
  return venues.filter(venue => {
    // Filter by price range
    if (filters.minPrice !== undefined && venue.price < filters.minPrice) {
      console.log(`Venue ${venue.name} filtered out: price ${venue.price} < min ${filters.minPrice}`);
      return false;
    }
    
    if (filters.maxPrice !== undefined && venue.price > filters.maxPrice) {
      console.log(`Venue ${venue.name} filtered out: price ${venue.price} > max ${filters.maxPrice}`);
      return false;
    }
    
    // Filter by max guests
    if (filters.maxGuests !== undefined && venue.maxGuests < filters.maxGuests) {
      console.log(`Venue ${venue.name} filtered out: maxGuests ${venue.maxGuests} < requested ${filters.maxGuests}`);
      return false;
    }
    
    // Filter by amenities
    if (filters.wifi !== undefined && venue.meta?.wifi !== filters.wifi) {
      console.log(`Venue ${venue.name} filtered out: wifi status doesn't match`);
      return false;
    }
    
    if (filters.parking !== undefined && venue.meta?.parking !== filters.parking) {
      console.log(`Venue ${venue.name} filtered out: parking status doesn't match`);
      return false;
    }
    
    if (filters.breakfast !== undefined && venue.meta?.breakfast !== filters.breakfast) {
      console.log(`Venue ${venue.name} filtered out: breakfast status doesn't match`);
      return false;
    }
    
    if (filters.pets !== undefined && venue.meta?.pets !== filters.pets) {
      console.log(`Venue ${venue.name} filtered out: pets status doesn't match`);
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
    
    // Handle different response structures
    if (response.data) {
      return response.data;
    } else if (response.venues && !Array.isArray(response.venues)) {
      return response.venues;
    } else {
      // If the API changes and returns a different structure, try to handle it
      return response as unknown as Venue;
    }
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
    
    // Handle different response structures
    if (response.data) {
      return response.data;
    } else if (response.venues && !Array.isArray(response.venues)) {
      return response.venues;
    } else {
      // If the API changes and returns a different structure, try to handle it
      return response as unknown as Venue;
    }
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