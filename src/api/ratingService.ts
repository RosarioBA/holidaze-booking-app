
// src/api/ratingService.ts
// LOCAL STORAGE VERSION

// Export the Rating interface so it can be imported in other files
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
   * Load all ratings from localStorage
   */
  const loadRatingsFromStorage = (): Record<string, Rating[]> => {
    try {
      const ratingsJson = localStorage.getItem(RATINGS_STORAGE_KEY);
      if (ratingsJson) {
        return JSON.parse(ratingsJson);
      }
    } catch (error) {
      console.error('Error loading ratings from storage:', error);
    }
    return {};
  };
  
  /**
   * Save ratings to localStorage
   */
  const saveRatingsToStorage = (ratingsMap: Record<string, Rating[]>): void => {
    try {
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratingsMap));
    } catch (error) {
      console.error('Error saving ratings to storage:', error);
    }
  };
  
  /**
   * Submit a rating for a venue (stores in localStorage)
   */
  export const submitRating = async (
    venueId: string,
    data: { rating: number; comment?: string },
    token: string,
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
   * Get all ratings for a venue
   */
  export const getVenueRatings = async (venueId: string): Promise<Rating[]> => {
    const allRatings = loadRatingsFromStorage();
    return allRatings[venueId] || [];
  };
  
  /**
   * Check if a user has already rated a venue
   */
  export const hasUserRatedVenue = (venueId: string, userName: string): boolean => {
    const allRatings = loadRatingsFromStorage();
    const venueRatings = allRatings[venueId] || [];
    
    return venueRatings.some(rating => 
      rating.userName === userName || (rating.user && rating.user.name === userName)
    );
  };
  
  /**
   * Calculate the average rating for a venue
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
   * Get average rating and count for a venue
   */
  export const getVenueRatingInfo = (venueId: string): { rating: number; count: number } => {
    const ratings = loadRatingsFromStorage()[venueId] || [];
    const count = ratings.length;
    const rating = count > 0 
      ? Number((ratings.reduce((total, r) => total + r.rating, 0) / count).toFixed(1))
      : 0;
      
    return { rating, count };
  };