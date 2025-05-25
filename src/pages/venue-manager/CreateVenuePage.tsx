/**
 * @file CreateVenuePage.tsx
 * @description Page component for venue managers to create new venues
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createVenue } from '../../api/venueService';
import VenueForm, { VenueFormData } from '../../components/venue/VenueForm';

/**
 * Page component for venue managers to create a new venue
 * 
 * @returns {JSX.Element} Rendered component
 */
const CreateVenuePage: React.FC = () => {
  const { token, isVenueManager } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  /**
   * Handles the form submission to create a new venue
   * 
   * @param {VenueFormData} formData - Form data from VenueForm
   */
  const handleSubmit = async (formData: VenueFormData) => {
    if (!token) {
      setError('You must be logged in to create a venue');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await createVenue(
        { ...formData, rating: formData.rating ?? undefined },
        token
      );
      
      // Redirect to venue manager dashboard on success
      navigate('/venue-manager/dashboard');
    } catch (err) {
      setError('Failed to create venue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial form values for a new venue
  const initialFormValues = {
    name: '',
    description: '',
    price: '',
    maxGuests: '',
    media: [{ url: '', alt: '' }],
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: ''
    },
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false
    },
    rating: null
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 font-averia">Create New Venue</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 tracking-wide">
          {error}
        </div>
      )}
      
      <VenueForm
        initialValues={initialFormValues}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        submitButtonText="Create Venue"
      />
    </div>
  );
};

export default CreateVenuePage;