/**
 * @file FavoritesContext.tsx
 * @description Context provider for managing user favorite venues with localStorage persistence only
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
  /** Whether favorites are currently being loaded */
  isLoading: boolean;
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
 * Handles persistence of favorites in localStorage only
 * 
 * @param {FavoritesProviderProps} props - Component props
 * @returns {JSX.Element} Provider component with context
 */
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Storage key specific to the current user
  const storageKey = user ? `favoriteVenues_${user.name}` : 'favoriteVenues_guest';
  
  /**
   * Load favorites from localStorage
   */
  const loadFavoritesFromLocalStorage = (): string[] => {
    try {
      const storedFavorites = localStorage.getItem(storageKey);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          return parsedFavorites;
        }
      }
    } catch (error) {
      console.error('Error parsing favorites from localStorage:', error);
    }
    return [];
  };
  
  /**
   * Save favorites to localStorage
   */
  const saveFavoritesToLocalStorage = (favoritesToSave: string[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favoritesToSave));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  };
  
  /**
   * Load favorites when user changes or component mounts
   */
  useEffect(() => {
    setIsLoading(true);
    const localFavorites = loadFavoritesFromLocalStorage();
    setFavorites(localFavorites);
    setIsLoading(false);
  }, [user?.name, storageKey]);
  
  /**
   * Add a venue to the favorites list
   * 
   * @param {string} venueId - ID of the venue to add to favorites
   */
  const addFavorite = (venueId: string) => {
    const newFavorites = favorites.includes(venueId) 
      ? favorites 
      : [...favorites, venueId];
    
    setFavorites(newFavorites);
    saveFavoritesToLocalStorage(newFavorites);
  };
  
  /**
   * Remove a venue from the favorites list
   * 
   * @param {string} venueId - ID of the venue to remove from favorites
   */
  const removeFavorite = (venueId: string) => {
    const newFavorites = favorites.filter(id => id !== venueId);
    setFavorites(newFavorites);
    saveFavoritesToLocalStorage(newFavorites);
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
    isFavorite,
    isLoading
  };
  
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};