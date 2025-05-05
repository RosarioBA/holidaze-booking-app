// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Profile {
  name: string;
  email: string;
  avatar?: {
    url: string;
    alt: string;
  };
  venueManager: boolean;
}

interface AuthContextType {
  user: Profile | null;
  token: string | null;
  isAuthenticated: boolean;
  isVenueManager: boolean;
  login: (token: string, userProfile: Profile) => void;
  logout: () => void;
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
  // This is a simple check - adjust according to your token format
  const isTokenValid = (token: string): boolean => {
    // If your API uses JWT tokens, you can validate them here
    // For basic validation, just check if the token exists and has a valid format
    return !!token && token.length > 10; // Simple validation example
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
            setToken(storedToken);
            setUser(parsedUser);
            console.log('Auth state restored successfully');
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
    console.log('Logging in with new token');
    
    // Validate the token before saving
    if (!isTokenValid(newToken)) {
      console.error('Invalid token provided to login');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userProfile));
    
    // Update state
    setToken(newToken);
    setUser(userProfile);
    console.log('Login successful, auth state updated');
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
  
  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isVenueManager: user?.venueManager || false,
    login,
    logout,
  };
  
  // Don't render children until we've tried to load from localStorage
  if (loading) {
    return null; // Or a loading spinner if you prefer
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};