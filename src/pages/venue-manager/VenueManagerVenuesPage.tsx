// src/pages/venue-manager/VenueManagerVenuesPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getVenueManagerVenues, deleteVenue } from '../../api/venueService';
import { Venue } from '../../types/venue';

const VenueManagerVenuesPage: React.FC = () => {
  const { user, token } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, [token, user]);

  const fetchVenues = async () => {
    if (!token || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const myVenues = await getVenueManagerVenues(user.name, token);
      setVenues(myVenues);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to load venues. Please try again later.');
      setVenues([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (venueId: string) => {
    if (!token) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      await deleteVenue(venueId, token);
      // Refresh the venues list after successful deletion
      await fetchVenues();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Error deleting venue:', err);
      setError('Failed to delete venue. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getImageUrl = (venue: Venue) => {
    if (venue?.media && venue.media.length > 0 && venue.media[0].url) {
      return venue.media[0].url;
    }
    return 'https://placehold.co/300x200?text=No+Image';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Venues</h1>
        <Link
          to="/venue-manager/create"
          className="bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
        >
          Create New Venue
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {venues.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">No venues yet</h2>
          <p className="text-gray-600 mb-6">Start by creating your first venue.</p>
          <Link
            to="/venue-manager/create"
            className="inline-block bg-[#0081A7] text-white px-6 py-3 rounded hover:bg-[#13262F]"
          >
            Create Venue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map(venue => (
            <div key={venue.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="h-48 bg-gray-200">
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
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{venue.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{venue.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>{venue.location?.city}, {venue.location?.country}</span>
                  <span>{venue.price} kr/night</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/venues/${venue.id}`}
                    className="flex-1 text-center bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
                  >
                    View
                  </Link>
                  <Link
                    to={`/venue-manager/edit/${venue.id}`}
                    className="flex-1 text-center bg-[#0081A7] text-white px-3 py-2 rounded hover:bg-[#13262F]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirmId(venue.id)}
                    className="flex-1 text-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Delete Confirmation Modal */}
              {deleteConfirmId === venue.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to delete "{venue.name}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleDelete(venue.id)}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        disabled={isDeleting}
                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueManagerVenuesPage;