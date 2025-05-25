// src/types/profile.ts

/**
 * @file profile.ts
 * @description Type definitions for profile-related interfaces
 */

/**
 * Interface for profile media (avatar and banner)
 */
export interface ProfileMedia {
    /** URL to the media asset */
    url: string;
    /** Alt text for accessibility */
    alt?: string;
  }
  
  /**
   * Interface for user profile data
   */
  export interface Profile {
    /** Username */
    name: string;
    /** Email address */
    email: string;
    /** Optional biography text */
    bio?: string;
    /** User's avatar image */
    avatar?: ProfileMedia;
    /** Profile banner image */
    banner?: ProfileMedia;
    /** Whether the user is a venue manager */
    venueManager: boolean;
    /** Count of related entities */
    _count?: {
      /** Number of venues managed by this user */
      venues: number;
      /** Number of bookings made by or for this user */
      bookings: number;
    };
  }