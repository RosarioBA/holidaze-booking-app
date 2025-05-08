// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUsernameFromToken } from '../api/api';

interface Profile {
  name: string;
  email: string;
  avatar?: {
    url: string;
    alt: string;
  };
  venueManager: boolean;
  bio?: string;
}

interface AuthContextType {
  user: Profile | null;
  token: string | null;
  isAuthenticated: boolean;
  isVenueManager: boolean;
  login: (token: string, userProfile: Profile) => void;
  logout: () => void;
  updateUser: (updatedUserData: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Helper function to check if token is valid
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
      console.error('Error validating token:', error);
      return false;
    }
  };
  
  // Load user data from localStorage on initial render
  useEffect(() => {
    console.log('Initializing auth state from localStorage');
    const loadAuth = () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('Stored token exists:', !!storedToken);
      console.log('Stored user exists:', !!storedUser);
      
      if (storedToken && storedUser) {
        try {
          console.log('Validating token and parsing user data');
          
          if (isTokenValid(storedToken)) {
            const parsedUser = JSON.parse(storedUser);
            
            // Ensure venueManager is properly typed as boolean
            const normalizedUser = {
              ...parsedUser,
              venueManager: parsedUser.venueManager === true // Force boolean value
            };
            
            setToken(storedToken);
            setUser(normalizedUser);
            console.log('Auth state restored successfully');
            console.log('Venue Manager status:', normalizedUser.venueManager);
          } else {
            console.warn('Stored token is invalid or expired');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('No stored authentication data found');
      }
      setLoading(false);
    };

    // Run the function
    loadAuth();
    
    // Also set up a listener for storage events to handle multi-tab synchronization
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'user') {
        console.log('Authentication data changed in another tab, reloading');
        loadAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const login = (newToken: string, userProfile: Profile) => {
    console.log('Login called with profile:', userProfile);
    
    // Ensure venueManager is a proper boolean
    const normalizedProfile: Profile = {
      ...userProfile,
      venueManager: userProfile.venueManager === true // Force boolean value
    };
    
    console.log('Logging in with venueManager status:', normalizedProfile.venueManager);
    
    // Save to localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(normalizedProfile));
    
    // Update state
    setToken(newToken);
    setUser(normalizedProfile);
    console.log('Login successful, auth state updated with venueManager:', normalizedProfile.venueManager);
  };
  
  const logout = () => {
    console.log('Logging out');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setToken(null);
    setUser(null);
    console.log('Logout complete, auth state cleared');
  };
  
  const updateUser = (updatedUserData: Partial<Profile>) => {
    if (!user) return; // Can't update if no user exists
    
    // Ensure venueManager is properly typed as boolean if it's being updated
    const normalizedUpdates = {
      ...updatedUserData
    };
    
    if (updatedUserData.venueManager !== undefined) {
      normalizedUpdates.venueManager = updatedUserData.venueManager === true;
    }
    
    // Create an updated user object by merging current user with updates
    const updatedUser = { ...user, ...normalizedUpdates };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update state
    setUser(updatedUser);
    console.log('User data updated successfully with venueManager:', updatedUser.venueManager);
  };
  
  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isVenueManager: user?.venueManager === true, // Explicit boolean conversion
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