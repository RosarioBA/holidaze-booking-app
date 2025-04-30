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
  
  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // If there's an error parsing the user data, clear the storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  const login = (newToken: string, userProfile: Profile) => {
    // Save to localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userProfile));
    
    // Update state
    setToken(newToken);
    setUser(userProfile);
  };
  
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setToken(null);
    setUser(null);
  };
  
  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isVenueManager: user?.venueManager || false,
    login,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};