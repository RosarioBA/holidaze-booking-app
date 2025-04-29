// src/types/user.ts
export interface Profile {
    name: string;
    email: string;
    avatar?: string;
    venueManager: boolean;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    avatar?: string;
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
    avatar?: string;
    venueManager: boolean;
  }