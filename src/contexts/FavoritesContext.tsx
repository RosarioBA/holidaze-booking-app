// src/contexts/FavoritesContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Venue } from '../types/venue';

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
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteVenues');
    
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        localStorage.removeItem('favoriteVenues');
      }
    }
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteVenues', JSON.stringify(favorites));
  }, [favorites]);
  
  const addFavorite = (venueId: string) => {
    setFavorites(prev => {
      if (prev.includes(venueId)) return prev;
      return [...prev, venueId];
    });
  };
  
  const removeFavorite = (venueId: string) => {
    setFavorites(prev => prev.filter(id => id !== venueId));
  };
  
  const isFavorite = (venueId: string) => {
    return favorites.includes(venueId);
  };
  
  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};