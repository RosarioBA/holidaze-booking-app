// src/pages/customer/CustomerSavedPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Venue } from '../../types/venue';
import { getVenues } from '../../api/venueService';

const CustomerSavedPage: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [savedVenues, setSavedVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchSavedVenues = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("DEBUG: Current favorites IDs:", favorites);

        // Get all venues
        const result = await getVenues();
        console.log("DEBUG: All venues count:", result.venues.length);
        
        // Filter venues to only include those in favorites
        const filteredVenues = result.venues.filter(venue => 
          favorites.includes(venue.id)
        );
        
        console.log("DEBUG: Filtered venues count:", filteredVenues.length);
        console.log("DEBUG: Filtered venues:", filteredVenues.map(v => ({id: v.id, name: v.name})));
        
        setSavedVenues(filteredVenues);
      } catch (err) {
        console.error('Error fetching saved venues:', err);
        setError('Failed to load your saved venues. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedVenues();
  }, [favorites]);

  // Get image URL with fallback
  const getImageUrl = (venue: Venue) => {
    if (venue.media && venue.media.length > 0 && venue.media[0].url) {
      return venue.media[0].url;
    }
    return 'https://placehold.co/300x200?text=No+Image';
  };

  // Handle removing venue from favorites
  const handleRemoveFavorite = (venueId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(venueId);
  };

  // Render venue amenities icons
  const renderAmenities = (venue: Venue) => {
    if (!venue.meta) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {venue.meta.wifi && (
          <div className="text-xs flex items-center text-gray-600" title="WiFi">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            WiFi
          </div>
        )}
        {venue.meta.parking && (
          <div className="text-xs flex items-center text-gray-600" title="Parking">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Parking
          </div>
        )}
        {venue.meta.breakfast && (
          <div className="text-xs flex items-center text-gray-600" title="Breakfast">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Breakfast
          </div>
        )}
        {venue.meta.pets && (
          <div className="text-xs flex items-center text-gray-600" title="Pets Allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Pets
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Saved Venues</h1>
        <p className="text-gray-600">Your favorite venues in one place</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* View toggle and actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded ${
              view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            title="Grid view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded ${
              view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            title="List view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {savedVenues.length} {savedVenues.length === 1 ? 'venue' : 'venues'} saved
        </div>
      </div>
      
      {savedVenues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No saved venues</h2>
          <p className="text-gray-600 mb-6">
            You haven't saved any venues yet. Browse venues and click the heart icon to save them for later.
          </p>
          <Link 
            to="/venues" 
            className="inline-block bg-[#0081A7] text-white px-6 py-3 rounded-lg hover:bg-[#13262F] transition"
          >
            Explore Venues
          </Link>
        </div>
      ) : view === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVenues.map(venue => (
            <Link 
              key={venue.id}
              to={`/venues/${venue.id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition relative group"
            >
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={getImageUrl(venue)} 
                  alt={venue.name} 
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=No+Image';
                  }}
                />
                <button
                  onClick={(e) => handleRemoveFavorite(venue.id, e)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-600"
                  title="Remove from favorites"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{venue.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {venue.location?.city}, {venue.location?.country}
                </p>
                <p className="text-sm mt-2">
                  <span className="font-medium">{venue.price} kr</span>
                  <span className="text-gray-500"> / night</span>
                </p>
                {renderAmenities(venue)}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {savedVenues.map(venue => (
            <Link 
              key={venue.id}
              to={`/venues/${venue.id}`}
              className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition relative"
            >
              <div className="w-32 sm:w-48 h-full bg-gray-200 flex-shrink-0">
                <img 
                  src={getImageUrl(venue)} 
                  alt={venue.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/300x200?text=No+Image';
                  }}
                />
              </div>
              <div className="p-4 flex-grow relative">
                <div className="pr-8">
                  <h3 className="font-semibold">{venue.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {venue.location?.city}, {venue.location?.country}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{venue.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm">
                      <span className="font-medium">{venue.price} kr</span>
                      <span className="text-gray-500"> / night</span>
                    </p>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm font-medium">{venue.rating || 'N/A'}</span>
                    </div>
                  </div>
                  {renderAmenities(venue)}
                </div>
                <button
                  onClick={(e) => handleRemoveFavorite(venue.id, e)}
                  className="absolute top-3 right-3 p-2 text-red-500 hover:text-red-600"
                  title="Remove from favorites"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerSavedPage;