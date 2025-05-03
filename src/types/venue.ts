// src/types/venue.ts

export interface VenueMedia {
    url: string;
    alt: string;
  }
  
  export interface VenueLocation {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    lat?: number;
    lng?: number;
  }
  
  export interface VenueMeta {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  }
  
  export interface UserProfile {
    name: string;
    email: string;
    bio?: string;
    avatar?: {
      url: string;
      alt: string;
    };
    banner?: {
      url: string;
      alt: string;
    };
  }
  
  export interface Booking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    created: string;
    updated: string;
    customer?: UserProfile;
  }
  
  export interface Venue {
    id: string;
    name: string;
    description: string;
    media: VenueMedia[];
    price: number;
    maxGuests: number;
    rating: number;
    created: string;
    updated: string;
    meta: VenueMeta;
    location: VenueLocation;
    owner?: UserProfile;
    bookings?: Booking[];
  }
  
  export interface VenueFilters {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    maxGuests?: number;
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  }