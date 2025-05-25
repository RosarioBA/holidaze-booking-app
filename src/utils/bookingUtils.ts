// src/utils/bookingUtils.ts

/**
 * @file bookingUtils.ts
 * @description Utility functions for handling booking data
 */

/**
 * Formats date for display
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  /**
   * Calculates duration in nights
   * 
   * @param {string} checkIn - Check-in date
   * @param {string} checkOut - Check-out date
   * @returns {number} Number of nights
   */
  export const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  /**
   * Determines booking status based on dates
   * 
   * @param {string} checkIn - Check-in date
   * @param {string} checkOut - Check-out date
   * @returns {{ label: string; color: string }} Status object with label and color
   */
  export const getBookingStatus = (checkIn: string, checkOut: string) => {
    const now = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (now < checkInDate) {
      return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (now >= checkInDate && now <= checkOutDate) {
      return { label: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  /**
   * Gets image URL with fallback
   * 
   * @param {any} venue - Venue object
   * @returns {string} Image URL
   */
  export const getImageUrl = (venue: any) => {
    if (venue?.media && venue.media.length > 0 && venue.media[0].url) {
      return venue.media[0].url;
    }
    return 'https://placehold.co/300x200?text=Venue';
  };