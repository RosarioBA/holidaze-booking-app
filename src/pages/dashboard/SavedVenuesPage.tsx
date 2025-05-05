// src/pages/dashboard/SavedVenuesPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Venue } from '../../types/venue';
import { getVenueById } from '../../api/venueService';
import VenueCard from '../../components/venue/VenueCard';

const SavedVenuesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [savedVenues, setSavedVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedVenues = async () => {
      if (favorites.length === 0) {
        setSavedVenues([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);

        // Fetch each venue by ID from our favorites list
        const venuePromises = favorites.map(id => getVenueById(id));
        const venues = await Promise.all(venuePromises);
        
        setSavedVenues(venues);
      } catch (err) {
        console.error('Error fetching saved venues:', err);
        setError('Failed to load your saved venues. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedVenues();
  }, [favorites]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Saved Venues</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {savedVenues.length === 0 && !error ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <h2 className="text-xl font-semibold mb-2">No saved venues yet</h2>
          <p className="text-gray-600 mb-4">Browse venues and save your favorites for later!</p>
          <Link
            to="/venues"
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700"
          >
            Explore Venues
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVenues.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedVenuesPage;