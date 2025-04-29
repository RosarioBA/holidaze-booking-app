// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '../types/user';

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
  
  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);
  
  const login = (newToken: string, userProfile: Profile) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userProfile));
    setToken(newToken);
    setUser(userProfile);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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