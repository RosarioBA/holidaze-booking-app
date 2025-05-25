/**
 * @file VenueLocationForm.tsx
 * @description Form component for editing venue location information
 */

import React from 'react';

interface LocationData {
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
}

interface VenueLocationFormProps {
  /** Current location data */
  location: LocationData;
  /** Function to update a location field */
  onLocationChange: (field: keyof LocationData, value: string) => void;
}

/**
 * Form component for editing venue location information
 * 
 * @param {VenueLocationFormProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const VenueLocationForm: React.FC<VenueLocationFormProps> = ({ 
  location, 
  onLocationChange 
}) => {
  return (
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
            onChange={(e) => onLocationChange('address', e.target.value)}
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
            onChange={(e) => onLocationChange('city', e.target.value)}
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
            onChange={(e) => onLocationChange('zip', e.target.value)}
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
            onChange={(e) => onLocationChange('country', e.target.value)}
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
            onChange={(e) => onLocationChange('continent', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default VenueLocationForm;