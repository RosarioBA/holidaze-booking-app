export interface Media {
  url: string;
  alt?: string;
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
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
}

export interface Owner {
  name: string;
  email?: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
}

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created?: string;
  updated?: string;
  venue?: Venue;
  customer?: {
    name: string;
    email?: string;
    bio?: string;
    avatar?: Media;
  };
}

export interface Rating {
  score: number;
  comment?: string;
  user: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  ratings?: Rating[];
  created?: string;
  updated?: string;
  meta: Meta;
  location: Location;
  owner?: Owner;
  bookings?: Booking[];
}

export interface VenueFilters {
  minPrice?: number;
  maxPrice?: number;
  maxGuests?: number;
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
}