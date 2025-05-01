// src/pages/dashboard/SavedVenuesPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthenticatedLayout from '../../components/layout/AuthenticatedLayout';
import { Venue } from '../../types/venue';
import { getVenues } from '../../api/venueService';

const SavedVenuesPage: React.FC = () => {
  const [savedVenues, setSavedVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedVenues = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In a real app, you would fetch the user's saved venues from your API
        // For now, we'll just fetch some venues as placeholders
        const result = await getVenues();
        setSavedVenues(result.venues.slice(0, 6));
      } catch (err) {
        console.error('Error fetching saved venues:', err);
        setError('Failed to load your saved venues. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedVenues();
  }, []);

  const handleRemoveFromSaved = (venueId: string) => {
    // In a real app, you would call your API to remove the venue from saved
    setSavedVenues(savedVenues.filter(venue => venue.id !== venueId));
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
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
              <div
                key={venue.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
              >
                <div className="h-48 bg-gray-200">
                  {venue.media && venue.media.length > 0 ? (
                    <img
                      src={venue.media[0].url}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/600x400?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFromSaved(venue.id)}
                    className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full"
                    aria-label="Remove from saved"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{venue.name}</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    {venue.location.city ? `${venue.location.city}, ` : ''}
                    {venue.location.country || 'Location not specified'}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">${venue.price} <span className="font-normal text-gray-600 text-sm">/ night</span></div>
                    <Link
                      to={`/venues/${venue.id}`}
                      className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default SavedVenuesPage;