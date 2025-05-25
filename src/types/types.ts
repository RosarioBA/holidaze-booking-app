// src/types/types.ts

/**
 * @file types.ts 
 * @description Type definitions for various entities in the application
 */


export interface Media {
    url: string;
    alt: string;
  }
  
  export interface Location {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    lat?: number;
    lng?: number;
  }
  
  export interface Meta {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  }
  
  export interface Profile {
    name: string;
    email: string;
    bio?: string;
    avatar?: Media;
    banner?: Media;
  }
  
  export interface Venue {
    id: string;
    name: string;
    description: string;
    media: Media[];
    price: number;
    maxGuests: number;
    rating?: number;
    created?: string;
    updated?: string;
    meta?: Meta;
    location: Location;
    owner?: Profile;
  }
  
  export interface Booking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    created: string;
    updated: string;
    venue?: Venue;
    customer?: Profile;
  }