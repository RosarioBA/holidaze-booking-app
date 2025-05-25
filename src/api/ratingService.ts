/**
 * @file ratingService.ts
 * @description Service for managing venue ratings stored in localStorage
 */

/**
 * Rating data structure
 */
export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  userName: string;
  date: string;
  user?: {
    name: string;
    email?: string;
    avatar?: {
      url: string;
      alt?: string;
    };
  };
  created: string;
}

// Local storage key for ratings
const RATINGS_STORAGE_KEY = 'holidaze_venue_ratings';

/**
 * Loads all venue ratings from localStorage
 * 
 * @returns {Record<string, Rating[]>} Object mapping venue IDs to arrays of ratings
 */
const loadRatingsFromStorage = (): Record<string, Rating[]> => {
  try {
    const ratingsJson = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (ratingsJson) {
      return JSON.parse(ratingsJson);
    }
  } catch (error) {
    // Silent fail and return empty object
  }
  return {};
};

/**
 * Saves venue ratings to localStorage
 * 
 * @param {Record<string, Rating[]>} ratingsMap - Object mapping venue IDs to arrays of ratings
 */
const saveRatingsToStorage = (ratingsMap: Record<string, Rating[]>): void => {
  try {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratingsMap));
  } catch (error) {
    throw new Error('Failed to save ratings to localStorage');
  }
};

/**
 * Submits a new rating for a venue (stores in localStorage)
 * 
 * @param {string} venueId - ID of the venue being rated
 * @param {{ rating: number; comment?: string }} data - Rating value and optional comment
 * @param {string} token - Authentication token (not used in localStorage implementation but kept for API compatibility)
 * @param {string} userName - Name of the user submitting the rating
 * @returns {Promise<Rating>} The newly created rating
 */
export const submitRating = async (
  venueId: string,
  data: { rating: number; comment?: string },
  _token: string,
  userName: string = 'Anonymous'
): Promise<Rating> => {
  // Load existing ratings
  const allRatings = loadRatingsFromStorage();
  
  // Get venue ratings or initialize empty array
  const venueRatings = allRatings[venueId] || [];
  
  // Create new rating object
  const newRating: Rating = {
    id: `rating_${Date.now()}`, // Generate a unique ID
    rating: data.rating,
    comment: data.comment,
    userId: userName, // Use username as userId for simplicity
    userName: userName,
    date: new Date().toISOString(),
    created: new Date().toISOString(),
    user: {
      name: userName
    }
  };
  
  // Add the new rating
  const updatedVenueRatings = [...venueRatings, newRating];
  
  // Update the ratings map
  allRatings[venueId] = updatedVenueRatings;
  
  // Save back to storage
  saveRatingsToStorage(allRatings);
  
  return newRating;
};

/**
 * Retrieves all ratings for a specific venue
 * 
 * @param {string} venueId - ID of the venue
 * @returns {Promise<Rating[]>} Array of ratings for the venue
 */
export const getVenueRatings = async (venueId: string): Promise<Rating[]> => {
  const allRatings = loadRatingsFromStorage();
  return allRatings[venueId] || [];
};

/**
 * Checks if a user has already rated a specific venue
 * 
 * @param {string} venueId - ID of the venue
 * @param {string} userName - Username to check
 * @returns {boolean} True if the user has already rated the venue
 */
export const hasUserRatedVenue = (venueId: string, userName: string): boolean => {
  const allRatings = loadRatingsFromStorage();
  const venueRatings = allRatings[venueId] || [];
  
  return venueRatings.some(rating => 
    rating.userName === userName || (rating.user && rating.user.name === userName)
  );
};

/**
 * Calculates the average rating for a venue
 * 
 * @param {string} venueId - ID of the venue
 * @returns {number} Average rating (0 if no ratings)
 */
export const calculateAverageRating = (venueId: string): number => {
  const ratings = loadRatingsFromStorage()[venueId] || [];
  
  if (ratings.length === 0) {
    return 0;
  }
  
  const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
  return Number((sum / ratings.length).toFixed(1));
};

/**
 * Gets average rating and count for a venue
 * 
 * @param {string} venueId - ID of the venue
 * @returns {{ rating: number; count: number }} Object containing average rating and count
 */
export const getVenueRatingInfo = (venueId: string): { rating: number; count: number } => {
  const ratings = loadRatingsFromStorage()[venueId] || [];
  const count = ratings.length;
  const rating = count > 0 
    ? Number((ratings.reduce((total, r) => total + r.rating, 0) / count).toFixed(1))
    : 0;
    
  return { rating, count };
};

/**
 * Checks if a user has completed a stay at a specific venue
 * 
 * @param {string} venueId - ID of the venue
 * @param {string} userName - Username to check
 * @returns {Promise<boolean>} True if the user has completed a stay at this venue
 */
export const hasUserCompletedStayAtVenue = async (venueId: string, userName: string): Promise<boolean> => {
  try {
    // Get user's bookings from localStorage or API
    // First, let's check if we have booking data stored locally
    const userBookingsKey = `user_bookings_${userName}`;
    const storedBookings = localStorage.getItem(userBookingsKey);
    
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
      const now = new Date();
      
      // Check if user has any completed bookings for this venue
      const completedStay = bookings.some((booking: any) => {
        const checkOutDate = new Date(booking.dateTo);
        const venueMatches = booking.venue?.id === venueId || booking.venueId === venueId;
        const stayCompleted = checkOutDate < now; // Check-out date has passed
        
        return venueMatches && stayCompleted;
      });
      
      return completedStay;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking user stay history:', error);
    return false;
  }
};

/**
 * Gets user's completed stays for validation purposes
 * 
 * @param {string} userName - Username to check
 * @returns {Array} Array of completed bookings
 */
export const getUserCompletedStays = (userName: string): any[] => {
  try {
    const userBookingsKey = `user_bookings_${userName}`;
    const storedBookings = localStorage.getItem(userBookingsKey);
    
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
      const now = new Date();
      
      return bookings.filter((booking: any) => {
        const checkOutDate = new Date(booking.dateTo);
        return checkOutDate < now; // Only completed stays
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user completed stays:', error);
    return [];
  }
};