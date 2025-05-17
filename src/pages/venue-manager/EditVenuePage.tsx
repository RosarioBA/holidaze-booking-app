// src/pages/venue-manager/EditVenuePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getVenueById, updateVenue } from '../../api/venueService';
import { Venue } from '../../types/venue';

const EditVenuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
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

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id || !token) return;
      
      try {
        const venueData = await getVenueById(id);
        setVenue(venueData);
        setName(venueData.name);
        setDescription(venueData.description);
        setPrice(venueData.price.toString());
        setMaxGuests(venueData.maxGuests.toString());
        
        // Set media URLs
        if (venueData.media && venueData.media.length > 0) {
          setMediaUrls(venueData.media.map(m => m.url));
        } else {
          setMediaUrls(['']);
        }
        
        // Set location if it exists
        if (venueData.location) {
          setLocation({
            address: venueData.location.address || '',
            city: venueData.location.city || '',
            zip: venueData.location.zip || '',
            country: venueData.location.country || '',
            continent: venueData.location.continent || ''
          });
        }
        
        // Set meta if it exists
        if (venueData.meta) {
          setMeta({
            wifi: venueData.meta.wifi || false,
            parking: venueData.meta.parking || false,
            breakfast: venueData.meta.breakfast || false,
            pets: venueData.meta.pets || false
          });
        }
      } catch (err) {
        console.error('Error fetching venue:', err);
        setError('Failed to load venue data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVenue();
  }, [id, token]);

  const handleAddMediaUrl = () => {
    setMediaUrls([...mediaUrls, '']);
  };

  const handleRemoveMediaUrl = (index: number) => {
    const updatedUrls = mediaUrls.filter((_, i) => i !== index);
    setMediaUrls(updatedUrls.length ? updatedUrls : ['']);
  };

  const handleMediaUrlChange = (index: number, value: string) => {
    const updatedUrls = [...mediaUrls];
    updatedUrls[index] = value;
    setMediaUrls(updatedUrls);
  };

  const handleLocationChange = (field: keyof typeof location, value: string) => {
    setLocation({
      ...location,
      [field]: value
    });
  };

  const handleMetaChange = (field: keyof typeof meta) => {
    setMeta({
      ...meta,
      [field]: !meta[field]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !token) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Filter out empty media URLs and format them
      const media = mediaUrls
        .filter(url => url.trim() !== '')
        .map(url => ({
          url,
          alt: `Image of ${name}`
        }));
      
      const updateData = {
        name,
        description,
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests, 10),
        media,
        location,
        meta
      };
      
      await updateVenue(id, updateData, token);
      navigate('/venue-manager/venues');
    } catch (err) {
      console.error('Error updating venue:', err);
      setError('Failed to update venue. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Venue not found
        </div>
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
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
          Venue Name
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
            Description
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
              Price per Night
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
              Maximum Guests
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
        
        {/* Media/Images Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          
          {mediaUrls.map((url, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="url"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                placeholder="Image URL"
                value={url}
                onChange={(e) => handleMediaUrlChange(index, e.target.value)}
              />
              
              <button
                type="button"
                onClick={() => handleRemoveMediaUrl(index)}
                className="ml-2 bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddMediaUrl}
            className="mt-2 text-[#0081A7] hover:text-[#13262F]"
          >
            + Add another image
          </button>
        </div>
        
        {/* Location Section */}
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
          </div>
        </div>
        
        {/* Amenities Section */}
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
        
        <div className="flex justify-end gap-4">
          <button
              type="button"
              onClick={() => navigate('/venue-manager/venues')}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium tracking-wide"
            >
              Cancel
            </button>
          <button
              type="submit"
              className="bg-[#0081A7] text-white px-6 py-2 rounded-md hover:bg-[#13262F] disabled:opacity-50 font-medium tracking-wide"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditVenuePage;