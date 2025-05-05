// src/contexts/FavoritesContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[]; // Array of venue IDs
  addFavorite: (venueId: string) => void;
  removeFavorite: (venueId: string) => void;
  isFavorite: (venueId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  // Initialize state directly from localStorage to prevent overwriting
  const [favorites, setFavorites] = useState<string[]>(() => {
    console.log('DEBUG: Initializing favorites state from localStorage');
    try {
      const storedFavorites = localStorage.getItem('favoriteVenues');
      console.log('DEBUG: Raw stored favorites:', storedFavorites);
      
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        console.log('DEBUG: Parsed favorites:', parsedFavorites);
        if (Array.isArray(parsedFavorites)) {
          return parsedFavorites;
        }
      }
    } catch (error) {
      console.error('ERROR: Parsing favorites from localStorage:', error);
    }
    return []; // Default to empty array if no favorites or error
  });
  
  // Only save to localStorage when favorites change
  useEffect(() => {
    console.log('DEBUG: Saving favorites to localStorage:', favorites);
    localStorage.setItem('favoriteVenues', JSON.stringify(favorites));
    // Verify it was saved correctly
    const savedValue = localStorage.getItem('favoriteVenues');
    console.log('DEBUG: Verification - saved value:', savedValue);
  }, [favorites]);
  
  const addFavorite = (venueId: string) => {
    console.log('DEBUG: Adding favorite:', venueId);
    setFavorites(prev => {
      if (prev.includes(venueId)) {
        console.log('DEBUG: Venue already in favorites, not adding');
        return prev;
      }
      console.log('DEBUG: Adding venue to favorites');
      const newFavorites = [...prev, venueId];
      console.log('DEBUG: New favorites list:', newFavorites);
      return newFavorites;
    });
  };
  
  const removeFavorite = (venueId: string) => {
    console.log('DEBUG: Removing favorite:', venueId);
    setFavorites(prev => {
      const result = prev.filter(id => id !== venueId);
      console.log('DEBUG: New favorites after removal:', result);
      return result;
    });
  };
  
  const isFavorite = (venueId: string) => {
    const result = favorites.includes(venueId);
    // Reduce log spam by only logging true results
    if (result) {
      console.log(`DEBUG: Venue ${venueId} is a favorite`);
    }
    return result;
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