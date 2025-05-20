/**
 * @file FavoritesContext.tsx
 * @description Context provider for managing user favorite venues
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Interface for the favorites context value
 */
interface FavoritesContextType {
  /** Array of venue IDs that are marked as favorites */
  favorites: string[];
  /** Function to add a venue to favorites */
  addFavorite: (venueId: string) => void;
  /** Function to remove a venue from favorites */
  removeFavorite: (venueId: string) => void;
  /** Function to check if a venue is favorited */
  isFavorite: (venueId: string) => boolean;
}

// Create context with undefined default value
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/**
 * Custom hook to access the favorites context
 * 
 * @returns {FavoritesContextType} The favorites context value
 * @throws {Error} When used outside of a FavoritesProvider
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

/**
 * Props for the FavoritesProvider component
 */
interface FavoritesProviderProps {
  /** Child components that will have access to the favorites context */
  children: ReactNode;
}

/**
 * Provider component for managing user favorite venues
 * Handles persistence of favorites in localStorage
 * 
 * @param {FavoritesProviderProps} props - Component props
 * @returns {JSX.Element} Provider component with context
 */
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  // Initialize state directly from localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const storedFavorites = localStorage.getItem('favoriteVenues');
      
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          return parsedFavorites;
        }
      }
    } catch (error) {
      // Log error only in development environment
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
    return []; // Default to empty array if no favorites or error
  });
  
  /**
   * Persist favorites to localStorage whenever they change
   */
  useEffect(() => {
    localStorage.setItem('favoriteVenues', JSON.stringify(favorites));
  }, [favorites]);
  
  /**
   * Add a venue to the favorites list
   * 
   * @param {string} venueId - ID of the venue to add to favorites
   */
  const addFavorite = (venueId: string) => {
    setFavorites(prev => {
      if (prev.includes(venueId)) {
        return prev; // Already in favorites, don't add again
      }
      return [...prev, venueId];
    });
  };
  
  /**
   * Remove a venue from the favorites list
   * 
   * @param {string} venueId - ID of the venue to remove from favorites
   */
  const removeFavorite = (venueId: string) => {
    setFavorites(prev => prev.filter(id => id !== venueId));
  };
  
  /**
   * Check if a venue is in the favorites list
   * 
   * @param {string} venueId - ID of the venue to check
   * @returns {boolean} True if the venue is favorited, false otherwise
   */
  const isFavorite = (venueId: string) => {
    return favorites.includes(venueId);
  };
  
  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
  
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};