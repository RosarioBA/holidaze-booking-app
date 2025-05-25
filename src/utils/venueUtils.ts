// src/utils/venueUtils.ts

/**
 * @file venueUtils.ts
 * @description Utility functions for venue-related operations
 */

/**
 * Adds a venue to the recently viewed list in localStorage
 * 
 * @param {string} venueId - ID of the venue to add
 * @param {string} venueName - Name of the venue (for debugging)
 */
export const addToRecentlyViewed = (venueId: string) => {
    try {
      // Get existing recently viewed IDs or initialize empty array
      const recentlyViewedString = localStorage.getItem('recentlyViewed');
      let recentlyViewedIds: string[] = [];
      
      if (recentlyViewedString) {
        try {
          const parsed = JSON.parse(recentlyViewedString);
          // Check if it's an array of strings (IDs) or an array of objects (old format)
          if (Array.isArray(parsed)) {
            if (parsed.length > 0 && typeof parsed[0] === 'string') {
              // It's already the correct format - array of IDs
              recentlyViewedIds = parsed;
            } else if (parsed.length > 0 && typeof parsed[0] === 'object') {
              // Old format - array of venue objects
              recentlyViewedIds = parsed.map((v: any) => v.id || '').filter(Boolean);
            }
          }
        } catch (error) {
          // Silent fail and use empty array
        }
      }
      
      // Remove this venue ID if it already exists
      recentlyViewedIds = recentlyViewedIds.filter(id => id !== venueId);
      
      // Add to beginning of array
      recentlyViewedIds.unshift(venueId);
      
      // Keep only the last 5
      const limited = recentlyViewedIds.slice(0, 5);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(limited));
    } catch (error) {
      // Silent fail
    }
  };