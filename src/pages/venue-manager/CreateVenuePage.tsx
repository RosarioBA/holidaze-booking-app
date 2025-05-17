// src/pages/venue-manager/CreateVenuePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createVenue } from '../../api/venueService';

const CreateVenuePage: React.FC = () => {
  const { token, isVenueManager } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [mediaUrls, setMediaUrls] = useState(['']);
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

  // Redirect non-venue managers
  if (!isVenueManager) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          You need to be a venue manager to create venues.
        </div>
      </div>
    );
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('You must be logged in to create a venue');
      return;
    }
    
    // Basic validation
    if (!name.trim() || !description.trim() || !price || !maxGuests) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Filter out empty media URLs
      const media = mediaUrls
        .filter(url => url.trim() !== '')
        .map(url => ({
          url,
          alt: `Image of ${name}`
        }));
      
      const venueData = {
        name,
        description,
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests, 10),
        media,
        location,
        meta
      };
      
      await createVenue(venueData, token);
      
      // Redirect to venue manager dashboard on success
      navigate('/venue-manager/dashboard');
    } catch (err) {
      console.error('Error creating venue:', err);
      setError('Failed to create venue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 font-averia">Create New Venue</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 tracking-wide">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
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
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Media
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
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#0081A7] text-white px-6 py-2 rounded-md hover:bg-[#13262F] disabled:opacity-50 font-medium tracking-wide"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Venue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVenuePage;