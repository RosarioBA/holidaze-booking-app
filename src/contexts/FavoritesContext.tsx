/**
 * @file FavoritesContext.tsx
 * @description Context provider for managing user favorite venues with API persistence
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { updateProfileWithApi, fetchProfileFromApi } from '../utils/avatarUtils';

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
 * Extracts favorites array from bio text that may contain both bio and favorites data
 * 
 * @param {string} bioText - The bio text that may contain favorites JSON
 * @returns {{ bio: string, favorites: string[] }} Separated bio and favorites
 */
const extractFavoritesFromBio = (bioText: string): { bio: string, favorites: string[] } => {
  try {
    // Look for a JSON object at the end of the bio that contains favorites
    const favoritesMatch = bioText.match(/\[FAVORITES\](.*?)\[\/FAVORITES\]$/);
    if (favoritesMatch) {
      const favoritesJson = favoritesMatch[1];
      const favorites = JSON.parse(favoritesJson);
      const bio = bioText.replace(/\[FAVORITES\].*?\[\/FAVORITES\]$/, '').trim();
      return { bio, favorites: Array.isArray(favorites) ? favorites : [] };
    }
    return { bio: bioText, favorites: [] };
  } catch (error) {
    return { bio: bioText, favorites: [] };
  }
};

/**
 * Combines bio text with favorites data for storage
 * 
 * @param {string} bio - The user's bio text
 * @param {string[]} favorites - Array of favorite venue IDs
 * @returns {string} Combined bio and favorites string
 */
const combineBioWithFavorites = (bio: string, favorites: string[]): string => {
  const trimmedBio = bio.trim();
  const favoritesJson = JSON.stringify(favorites);
  return trimmedBio + `[FAVORITES]${favoritesJson}[/FAVORITES]`;
};

/**
 * Provider component for managing user favorite venues
 * Handles persistence of favorites both in localStorage and API
 * 
 * @param {FavoritesProviderProps} props - Component props
 * @returns {JSX.Element} Provider component with context
 */
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Storage key specific to the current user
  const storageKey = user ? `favoriteVenues_${user.name}` : 'favoriteVenues';
  
  /**
   * Load favorites from localStorage as fallback
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
   * Load favorites from API when user logs in
   */
  useEffect(() => {
    const loadFavoritesFromApi = async () => {
      if (!user || !token) {
        // If no user, load from localStorage
        const localFavorites = loadFavoritesFromLocalStorage();
        setFavorites(localFavorites);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch user profile from API
        const profile = await fetchProfileFromApi(user.name, token);
        
        if (profile.bio) {
          // Extract favorites from bio
          const { favorites: apiFavorites } = extractFavoritesFromBio(profile.bio);
          setFavorites(apiFavorites);
          
          // Also save to localStorage for offline access
          saveFavoritesToLocalStorage(apiFavorites);
        } else {
          // No bio data, check localStorage
          const localFavorites = loadFavoritesFromLocalStorage();
          setFavorites(localFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites from API:', error);
        
        // Fallback to localStorage
        const localFavorites = loadFavoritesFromLocalStorage();
        setFavorites(localFavorites);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavoritesFromApi();
  }, [user, token]);
  
  /**
   * Save favorites to both localStorage and API
   */
  const saveFavorites = async (newFavorites: string[]) => {
    // Always save to localStorage immediately for responsive UI
    saveFavoritesToLocalStorage(newFavorites);
    setFavorites(newFavorites);
    
    // Save to API if user is logged in
    if (user && token) {
      try {
        // Get current profile to preserve existing bio
        const currentProfile = await fetchProfileFromApi(user.name, token);
        const { bio: currentBio } = extractFavoritesFromBio(currentProfile.bio || '');
        
        // Combine current bio with new favorites
        const updatedBio = combineBioWithFavorites(currentBio, newFavorites);
        
        // Update profile with new bio containing favorites
        await updateProfileWithApi(user.name, token, {
          bio: updatedBio
        });
      } catch (error) {
        console.error('Error saving favorites to API:', error);
        // Don't throw error - localStorage save was successful
      }
    }
  };
  
  /**
   * Add a venue to the favorites list
   * 
   * @param {string} venueId - ID of the venue to add to favorites
   */
  const addFavorite = async (venueId: string) => {
    const newFavorites = favorites.includes(venueId) 
      ? favorites 
      : [...favorites, venueId];
    
    await saveFavorites(newFavorites);
  };
  
  /**
   * Remove a venue from the favorites list
   * 
   * @param {string} venueId - ID of the venue to remove from favorites
   */
  const removeFavorite = async (venueId: string) => {
    const newFavorites = favorites.filter(id => id !== venueId);
    await saveFavorites(newFavorites);
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