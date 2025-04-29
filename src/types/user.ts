// src/types/user.ts
export interface MediaObject {
    url: string;
    alt: string;
  }
  
  export interface Profile {
    name: string;
    email: string;
    bio?: string;
    avatar?: MediaObject;
    banner?: MediaObject;
    venueManager: boolean;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    bio?: string;
    avatar?: MediaObject;
    banner?: MediaObject;
    venueManager: boolean;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    accessToken: string;
    name: string;
    email: string;
    bio?: string;
    avatar?: MediaObject;
    banner?: MediaObject;
    venueManager: boolean;
  }