/**
 * @file venueService.ts
 * @description Service for managing venues including fetching, creating, updating, and deleting venues
 */

import { Venue, VenueFilters } from '../types/venue';
import { fetchFromApi } from './api';

/**
 * API response structure with possible data formats
 * @template T The type of data contained in the response
 */
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

/**
 * Retrieves venues with pagination options
 * 
 * @param {number} page - Page number for pagination
 * @param {number} limit - Maximum number of venues per page
 * @param {string} sort - Field to sort by
 * @param {string} sortOrder - Sort direction ('asc' or 'desc')
 * @returns {Promise<{venues: Venue[], meta: object}>} Venues and pagination metadata
 */
export const getVenues = async (page = 1, limit = 100, sort = 'created', sortOrder = 'desc') => {
  // Ensure page is a valid number
  const validPage = isNaN(Number(page)) ? 1 : Number(page);
  
  const response = await fetchFromApi(
    `/holidaze/venues?page=${validPage}&limit=${limit}&sort=${sort}&sortOrder=${sortOrder}`
  );
  
  // Handle different response formats
  let result: any = {
    venues: [],
    meta: {
      currentPage: validPage,
      pageCount: 1,
      isFirstPage: validPage === 1,
      isLastPage: true
    }
  };
  
  // Normalize the response structure
  if (Array.isArray(response)) {
    result.venues = response;
  } else if (typeof response === 'object' && response !== null && 'data' in response) {
    if (Array.isArray(response.data)) {
      result.venues = response.data;
    } else {
      result.venues = [response.data];
    }
    
    if ('meta' in response && response.meta) {
      result.meta = response.meta;
    }
  } else if (typeof response === 'object' && response !== null && 'venues' in response && Array.isArray((response as any).venues)) {
    result = response;
  }
  
  return result;
};

/**
 * Retrieves a single venue by its ID
 * 
 * @param {string} id - ID of the venue to retrieve
 * @param {boolean} includeOwner - Whether to include owner details
 * @param {boolean} includeBookings - Whether to include bookings
 * @returns {Promise<Venue>} The requested venue
 * @throws {Error} If venue cannot be found or there's a network error
 */
export const getVenueById = async (id: string, includeOwner = false, includeBookings = false): Promise<Venue> => {
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
    // Handle alternative response format
    return response as unknown as Venue;
  }
};

/**
 * Retrieves venues managed by a specific profile
 * 
 * @param {string} profileName - Username of the profile
 * @param {string} token - Authentication token
 * @returns {Promise<Venue[]>} Venues managed by the profile
 * @throws {Error} If profile cannot be found or there's a network error
 */
export const getVenueManagerVenues = async (profileName: string, token: string): Promise<Venue[]> => {
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
  
  return venues;
};

/**
 * Searches for venues by query string
 * 
 * @param {string} query - Search query
 * @returns {Promise<Venue[]>} Matching venues
 */
export const searchVenues = async (query: string): Promise<Venue[]> => {
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
};

/**
 * Filters venues by specified criteria (client-side filtering)
 * 
 * @param {Venue[]} venues - Array of venues to filter
 * @param {VenueFilters} filters - Filter criteria
 * @returns {Venue[]} Filtered venues
 */
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

/**
 * Creates a new venue
 * 
 * @param {Omit<Venue, 'id' | 'created' | 'updated'>} venueData - Venue data
 * @param {string} token - Authentication token
 * @returns {Promise<Venue>} The created venue
 * @throws {Error} If venue creation fails
 */
export const createVenue = async (venueData: Omit<Venue, 'id' | 'created' | 'updated'>, token: string): Promise<Venue> => {
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
    return response as unknown as Venue;
  }
};

/**
 * Updates an existing venue
 * 
 * @param {string} id - ID of the venue to update
 * @param {Partial<Venue>} venueData - Updated venue data
 * @param {string} token - Authentication token
 * @returns {Promise<Venue>} The updated venue
 * @throws {Error} If venue update fails
 */
export const updateVenue = async (id: string, venueData: Partial<Venue>, token: string): Promise<Venue> => {
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
    return response as unknown as Venue;
  }
};

/**
 * Deletes a venue
 * 
 * @param {string} id - ID of the venue to delete
 * @param {string} token - Authentication token
 * @returns {Promise<void>}
 * @throws {Error} If venue deletion fails
 */
export const deleteVenue = async (id: string, token: string): Promise<void> => {
  await fetchFromApi(`/holidaze/venues/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};