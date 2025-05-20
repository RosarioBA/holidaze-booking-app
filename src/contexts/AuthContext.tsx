/**
 * @file AuthContext.tsx
 * @description Authentication context provider for managing user authentication state
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * User profile information structure
 */
interface Profile {
  /** User's name/username */
  name: string;
  /** User's email address */
  email: string;
  /** User's avatar image (optional) */
  avatar?: {
    /** URL of the avatar image */
    url: string;
    /** Alternative text for the avatar */
    alt: string;
  };
  /** Whether the user has venue manager privileges */
  venueManager: boolean;
  /** User's biography (optional) */
  bio?: string;
}

/**
 * Authentication context interface providing auth state and methods
 */
interface AuthContextType {
  /** Currently authenticated user or null if not authenticated */
  user: Profile | null;
  /** JWT authentication token or null if not authenticated */
  token: string | null;
  /** Whether a user is currently authenticated */
  isAuthenticated: boolean;
  /** Whether the current user has venue manager privileges */
  isVenueManager: boolean;
  /** Function to authenticate a user with token and profile */
  login: (token: string, userProfile: Profile) => void;
  /** Function to log out the current user */
  logout: () => void;
  /** Function to update the current user's profile data */
  updateUser: (updatedUserData: Partial<Profile>) => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access the authentication context
 * 
 * @returns {AuthContextType} The authentication context value
 * @throws {Error} When used outside of an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  /** Child components that will have access to the auth context */
  children: ReactNode;
}

/**
 * Authentication provider component that manages user authentication state
 * Handles token validation, persistence, and user information
 * 
 * @param {AuthProviderProps} props - Component props
 * @returns {JSX.Element} Auth provider with context
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Computed property for role check (explicitly cast to boolean)
  const isVenueManager = user?.venueManager === true;
  
  /**
   * Validates if a JWT token is properly formatted and not expired
   * 
   * @param {string} token - JWT token to validate
   * @returns {boolean} Whether the token is valid
   */
  const isTokenValid = (token: string): boolean => {
    try {
      // Basic check that token is in JWT format
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Try to decode the token payload
      const payload = JSON.parse(atob(parts[1]));
      
      // Check token expiration if it has an expiry
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) return false;
      }
      
      return true;
    } catch (error) {
      // Only log in development environment
      if (process.env.NODE_ENV === 'development') {
        console.error('Error validating token:', error);
      }
      return false;
    }
  };
  
  /**
   * Load authentication state from localStorage on initial render
   */
  useEffect(() => {
    const loadAuth = () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {          
          if (isTokenValid(storedToken)) {
            const parsedUser = JSON.parse(storedUser);
            
            // Ensure venueManager is properly typed as boolean
            const normalizedUser = {
              ...parsedUser,
              venueManager: parsedUser.venueManager === true // Force boolean value
            };
            
            setToken(storedToken);
            setUser(normalizedUser);
          } else {
            // Token is invalid or expired, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          // Error parsing stored data, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    // Run the function
    loadAuth();
    
    // Also set up a listener for storage events to handle multi-tab synchronization
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'user') {
        loadAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  /**
   * Logs in a user with the provided token and profile
   * 
   * @param {string} newToken - JWT token for the authenticated user
   * @param {Profile} userProfile - User profile information
   */
  const login = (newToken: string, userProfile: Profile) => {
    // Ensure venueManager is a proper boolean
    const normalizedProfile: Profile = {
      ...userProfile,
      venueManager: userProfile.venueManager === true
    };
    
    // Save to localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(normalizedProfile));
    
    // Update state
    setToken(newToken);
    setUser(normalizedProfile);
  };

  /**
   * Logs out the current user and clears authentication state
   */
  const logout = () => {
    // Clear all authentication and user-specific data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(`holidaze_avatar_url_${user?.name}`); // Clear user-specific avatar
    localStorage.removeItem('registered_as_venue_manager');
    localStorage.removeItem('registered_venue_manager_name');
    
    // Update state
    setToken(null);
    setUser(null);
  };
  
  /**
   * Updates the current user's profile information
   * 
   * @param {Partial<Profile>} updatedUserData - New user data to merge with existing profile
   */
  const updateUser = (updatedUserData: Partial<Profile>) => {
    if (!user) return;
    
    // Create an updated user object by merging current user with updates
    const updatedUser = { 
      ...user, 
      ...updatedUserData
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update state
    setUser(updatedUser);
  };

  // Context value to be provided to consumers
  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isVenueManager,
    login,
    logout,
    updateUser,
  };
  
  // Don't render children until we've tried to load from localStorage
  if (loading) {
    return null; // Or a loading spinner
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};