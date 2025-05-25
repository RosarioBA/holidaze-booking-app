/**
 * @file VenueBasicInfoForm.tsx
 * @description Form component for basic venue information
 */

import React from 'react';

interface VenueBasicInfoFormProps {
  /** Current venue name */
  name: string;
  /** Function to update venue name */
  setName: (name: string) => void;
  /** Current venue description */
  description: string;
  /** Function to update venue description */
  setDescription: (description: string) => void;
  /** Current venue price */
  price: string;
  /** Function to update venue price */
  setPrice: (price: string) => void;
  /** Current venue max guests */
  maxGuests: string;
  /** Function to update venue max guests */
  setMaxGuests: (maxGuests: string) => void;
}

/**
 * Form component for editing basic venue information
 * 
 * @param {VenueBasicInfoFormProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const VenueBasicInfoForm: React.FC<VenueBasicInfoFormProps> = ({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  maxGuests,
  setMaxGuests
}) => {
  return (
    <>
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
    </>
  );
};

export default VenueBasicInfoForm;