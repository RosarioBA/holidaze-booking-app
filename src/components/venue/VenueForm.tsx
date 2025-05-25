/**
 * @file VenueForm.tsx
 * @description Shared form component for creating and editing venues
 */

import React, { useState } from 'react';
import VenueBasicInfoForm from './VenueBasicInfoForm';
import VenueRatingInput from './VenueRatingInput';
import VenueMediaInput from './VenueMediaInput';
import VenueLocationForm from './VenueLocationForm';
import VenueAmenitiesForm from './VenueAmenitiesForm';

/**
 * Media item with URL and optional alt text
 */
interface MediaItem {
  url: string;
  alt?: string;
}

/**
 * Form data structure for venue creation/editing
 */
export interface VenueFormData {
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media: MediaItem[];
  location: {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
  };
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  rating?: number | null;
}

/**
 * Props for the VenueForm component
 */
interface VenueFormProps {
  /** Initial values for the form fields */
  initialValues: {
    name: string;
    description: string;
    price: string;
    maxGuests: string;
    media: MediaItem[];
    location: {
      address: string;
      city: string;
      zip: string;
      country: string;
      continent: string;
    };
    meta: {
      wifi: boolean;
      parking: boolean;
      breakfast: boolean;
      pets: boolean;
    };
    rating: number | null;
  };
  /** Whether the form is in a loading/submitting state */
  isLoading: boolean;
  /** Function to call when the form is submitted */
  onSubmit: (formData: VenueFormData) => Promise<void>;
  /** Text to display on the submit button */
  submitButtonText: string;
  /** Whether to show the delete button (for edit mode) */
  showDeleteButton?: boolean;
  /** Function to call when the delete button is clicked */
  onDelete?: () => void;
  /** Text to display on the delete button */
  deleteButtonText?: string;
}

/**
 * Shared form component for creating and editing venues
 * Uses smaller specialized components for each section
 * 
 * @param {VenueFormProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const VenueForm: React.FC<VenueFormProps> = ({
  initialValues,
  isLoading,
  onSubmit,
  submitButtonText,
  showDeleteButton = false,
  onDelete,
  deleteButtonText = 'Delete Venue'
}) => {
  // Form state
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [price, setPrice] = useState(initialValues.price);
  const [maxGuests, setMaxGuests] = useState(initialValues.maxGuests);
  const [mediaUrls, setMediaUrls] = useState<MediaItem[]>(initialValues.media);
  const [location, setLocation] = useState(initialValues.location);
  const [meta, setMeta] = useState(initialValues.meta);
  const [rating, setRating] = useState<number | null>(initialValues.rating);
  const [error, setError] = useState<string | null>(null);

  /**
   * Updates a location field with a new value
   */
  const handleLocationChange = (field: keyof typeof location, value: string) => {
    setLocation({
      ...location,
      [field]: value
    });
  };

  /**
   * Toggles a boolean amenity field in the meta object
   */
  const handleMetaChange = (field: keyof typeof meta) => {
    setMeta({
      ...meta,
      [field]: !meta[field]
    });
  };

  /**
   * Handles the form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !description.trim() || !price || !maxGuests) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      // Filter out empty media URLs
      const filteredMedia = mediaUrls
        .filter(media => media.url.trim() !== '')
        .map(media => ({
          url: media.url,
          alt: media.alt || `Image of ${name}`
        }));
      
      const formData: VenueFormData = {
        name,
        description,
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests, 10),
        media: filteredMedia,
        location,
        meta,
        rating
      };
      
      await onSubmit(formData);
      setError(null);
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 tracking-wide">
          {error}
        </div>
      )}
      
      {/* Basic Information Section */}
      <VenueBasicInfoForm
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        maxGuests={maxGuests}
        setMaxGuests={setMaxGuests}
      />
      
      {/* Rating Section */}
      <VenueRatingInput
        rating={rating}
        onRatingChange={setRating}
      />
      
      {/* Media Section */}
      <VenueMediaInput
        mediaUrls={mediaUrls}
        setMediaUrls={setMediaUrls}
      />
      
      {/* Location Section */}
      <VenueLocationForm
        location={location}
        onLocationChange={handleLocationChange}
      />
      
      {/* Amenities Section */}
      <VenueAmenitiesForm
        meta={meta}
        onMetaChange={handleMetaChange}
      />
      
      {/* Form Actions */}
      <div className="flex justify-between">
        {showDeleteButton && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            {deleteButtonText}
          </button>
        )}
        
        <button
          type="submit"
          className={`bg-[#0081A7] text-white px-6 py-2 rounded-md hover:bg-[#13262F] disabled:opacity-50 font-medium tracking-wide ${!showDeleteButton ? 'ml-auto' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default VenueForm;