// src/pages/venue-manager/EditVenuePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getVenueById, updateVenue, deleteVenue } from '../../api/venueService';
import { Venue } from '../../types/venue';

const EditVenuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, isVenueManager, user } = useAuth();
  const navigate = useNavigate();
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [mediaUrls, setMediaUrls] = useState<{ url: string; alt?: string }[]>([]);
  const [location, setLocation] = useState({
    address: '',
    city: '',
    zip: '',
    country: '',
    continent: ''
  });
  const [meta, setMeta] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false
  });
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  
  // Fetch venue data
  useEffect(() => {
    const fetchVenue = async () => {
      if (!id || !token) return;
      
      try {
        setIsLoading(true);
        const venueData = await getVenueById(id, true, false);
        
        // Check if current user is the owner
        if (user && venueData.owner?.name !== user.name) {
          setError('You can only edit venues that you manage');
          return;
        }
        
        setVenue(venueData);
        
        // Populate form fields
        setName(venueData.name);
        setDescription(venueData.description);
        setPrice(venueData.price.toString());
        setMaxGuests(venueData.maxGuests.toString());
        setMediaUrls(venueData.media || []);
        
        if (venueData.location) {
          setLocation({
            address: venueData.location.address || '',
            city: venueData.location.city || '',
            zip: venueData.location.zip || '',
            country: venueData.location.country || '',
            continent: venueData.location.continent || ''
          });
        }
        
        if (venueData.meta) {
          setMeta({
            wifi: venueData.meta.wifi || false,
            parking: venueData.meta.parking || false,
            breakfast: venueData.meta.breakfast || false,
            pets: venueData.meta.pets || false
          });
        }
        
        if (venueData.rating !== undefined) {
          setRating(venueData.rating);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching venue:', err);
        setError('Failed to load venue details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVenue();
  }, [id, token, user]);

  // Redirect non-venue managers
  if (!isVenueManager) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          You need to be a venue manager to edit venues.
        </div>
      </div>
    );
  }
  
  const handleAddMedia = () => {
    setMediaUrls([...mediaUrls, { url: '', alt: '' }]);
  };
  
  const handleRemoveMedia = (index: number) => {
    const updatedUrls = mediaUrls.filter((_, i) => i !== index);
    setMediaUrls(updatedUrls);
  };
  
  const handleMediaChange = (index: number, field: 'url' | 'alt', value: string) => {
    const updatedUrls = [...mediaUrls];
    updatedUrls[index] = { ...updatedUrls[index], [field]: value };
    setMediaUrls(updatedUrls);
  };
  
  const handleMetaChange = (field: keyof typeof meta) => {
    setMeta({
      ...meta,
      [field]: !meta[field]
    });
  };
  
  const handleLocationChange = (field: keyof typeof location, value: string) => {
    setLocation({
      ...location,
      [field]: value
    });
  };

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredStar(starValue);
  };

  const handleStarLeave = () => {
    setHoveredStar(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !token) {
      setError('You must be logged in to update a venue');
      return;
    }
    
    // Basic validation
    if (!name.trim() || !description.trim() || !price || !maxGuests) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Filter out empty media URLs
      const filteredMedia = mediaUrls
        .filter(media => media.url.trim() !== '')
        .map(media => ({
          url: media.url,
          alt: media.alt || `Image of ${name}`
        }));
      
      const venueData = {
        name,
        description,
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests, 10),
        media: filteredMedia,
        location,
        meta,
        // Only include rating if it's set
        ...(rating !== null && { rating })
      };
      
      await updateVenue(id, venueData, token);
      
      setSuccess('Venue updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating venue:', err);
      setError('Failed to update venue. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id || !token) return;
    
    try {
      setIsDeleting(true);
      await deleteVenue(id, token);
      
      // Redirect to venue manager dashboard
      navigate('/venue-manager/dashboard');
    } catch (err) {
      console.error('Error deleting venue:', err);
      setError('Failed to delete venue. Please try again.');
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
        </div>
      </div>
    );
  }
  
  if (error && !venue) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate('/venue-manager/dashboard')}
          className="text-[#0081A7] hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 font-averia">Edit Venue</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Venue Name*
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price per Night ($)*
            </label>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Guests*
            </label>
            <input
              type="number"
              id="maxGuests"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* Rating Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Update the venue's rating. This will be averaged with customer ratings as they come in.
          </p>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <button
                key={starValue}
                type="button"
                onClick={() => handleStarClick(starValue)}
                onMouseEnter={() => handleStarHover(starValue)}
                onMouseLeave={handleStarLeave}
                className="text-2xl focus:outline-none mr-1"
              >
                {starValue <= (hoveredStar || rating || 0) ? (
                  <span className="text-yellow-500">★</span>
                ) : (
                  <span className="text-gray-300">☆</span>
                )}
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating ? `${rating} out of 5 stars` : 'No rating'}
            </span>
            {rating && (
              <button
                type="button"
                onClick={() => setRating(null)}
                className="ml-3 text-sm text-red-600 hover:text-red-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Media
          </label>
          
          {mediaUrls.map((media, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="url"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                placeholder="Image URL"
                value={media.url}
                onChange={(e) => handleMediaChange(index, 'url', e.target.value)}
              />
              
              <button
                type="button"
                onClick={() => handleRemoveMedia(index)}
                className="ml-2 bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddMedia}
            className="mt-2 text-[#0081A7] hover:text-[#13262F]"
          >
            + Add another image
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 font-averia">Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                value={location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                value={location.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                id="zip"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                value={location.zip}
                onChange={(e) => handleLocationChange('zip', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                value={location.country}
                onChange={(e) => handleLocationChange('country', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="continent" className="block text-sm font-medium text-gray-700 mb-1">
                Continent
              </label>
              <input
                type="text"
                id="continent"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                value={location.continent}
                onChange={(e) => handleLocationChange('continent', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 font-averia">Amenities</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="wifi"
                className="h-4 w-4 text-[#0081A7] border-gray-300 rounded"
                checked={meta.wifi}
                onChange={() => handleMetaChange('wifi')}
              />
              <label htmlFor="wifi" className="ml-2 text-sm text-gray-700">
                WiFi
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="parking"
                className="h-4 w-4 text-[#0081A7] border-gray-300 rounded"
                checked={meta.parking}
                onChange={() => handleMetaChange('parking')}
              />
              <label htmlFor="parking" className="ml-2 text-sm text-gray-700">
                Parking
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="breakfast"
                className="h-4 w-4 text-[#0081A7] border-gray-300 rounded"
                checked={meta.breakfast}
                onChange={() => handleMetaChange('breakfast')}
              />
              <label htmlFor="breakfast" className="ml-2 text-sm text-gray-700">
                Breakfast
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pets"
                className="h-4 w-4 text-[#0081A7] border-gray-300 rounded"
                checked={meta.pets}
                onChange={() => handleMetaChange('pets')}
              />
              <label htmlFor="pets" className="ml-2 text-sm text-gray-700">
                Pets Allowed
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Delete Venue
          </button>
          
          <button
            type="submit"
            className="bg-[#0081A7] text-white px-6 py-2 rounded-md hover:bg-[#13262F] disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 font-averia">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this venue? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Venue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditVenuePage;