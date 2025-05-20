/**
 * @file VenueAmenitiesForm.tsx
 * @description Form component for editing venue amenities
 */

import React from 'react';

interface VenueAmenitiesFormProps {
  /** Current amenities state */
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  /** Function to update amenities state */
  onMetaChange: (field: 'wifi' | 'parking' | 'breakfast' | 'pets') => void;
}

/**
 * Form component for editing venue amenities
 * 
 * @param {VenueAmenitiesFormProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const VenueAmenitiesForm: React.FC<VenueAmenitiesFormProps> = ({ meta, onMetaChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 font-averia">Amenities</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="wifi"
            className="h-4 w-4 text-[#0081A7] border-gray-300 rounded"
            checked={meta.wifi}
            onChange={() => onMetaChange('wifi')}
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
            onChange={() => onMetaChange('parking')}
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
            onChange={() => onMetaChange('breakfast')}
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
            onChange={() => onMetaChange('pets')}
          />
          <label htmlFor="pets" className="ml-2 text-sm text-gray-700">
            Pets Allowed
          </label>
        </div>
      </div>
    </div>
  );
};

export default VenueAmenitiesForm;