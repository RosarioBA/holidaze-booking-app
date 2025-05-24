/**
 * @file EditVenuePage.tsx
 * @description Page component for venue managers to edit their existing venues
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getVenueById, updateVenue, deleteVenue } from '../../api/venueService';
import { Venue } from '../../types/venue';
import VenueForm, { VenueFormData } from '../../components/venue/VenueForm';

/**
 * Modal component for confirming venue deletion
 */
interface DeleteConfirmationModalProps {
  /** Whether deletion is in progress */
  isDeleting: boolean;
  /** Function to execute on confirmation */
  onConfirm: () => void;
  /** Function to cancel the deletion */
  onCancel: () => void;
}

/**
 * Component for confirming venue deletion
 * 
 * @param {DeleteConfirmationModalProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isDeleting,
  onConfirm,
  onCancel
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 className="text-xl font-bold mb-4 font-averia">Confirm Deletion</h3>
      <p className="mb-6">
        Are you sure you want to delete this venue? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Venue'}
        </button>
      </div>
    </div>
  </div>
);

/**
 * Page component for venue managers to edit an existing venue
 * 
 * @returns {JSX.Element} Rendered component
 */
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
  
  // Default initial form values
  const [initialFormValues, setInitialFormValues] = useState({
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
    rating: null as number | null
  });
  
  /**
   * Fetches venue data when component mounts
   */
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
        
        // Set initial form values
        setInitialFormValues({
          name: venueData.name,
          description: venueData.description,
          price: venueData.price.toString(),
          maxGuests: venueData.maxGuests.toString(),
          media: (venueData.media || [{ url: '', alt: '' }]).map(media => ({
            url: media.url,
            alt: media.alt || ''
          })),
          location: {
            address: venueData.location?.address || '',
            city: venueData.location?.city || '',
            zip: venueData.location?.zip || '',
            country: venueData.location?.country || '',
            continent: venueData.location?.continent || ''
          },
          meta: {
            wifi: venueData.meta?.wifi || false,
            parking: venueData.meta?.parking || false,
            breakfast: venueData.meta?.breakfast || false,
            pets: venueData.meta?.pets || false
          },
          rating: venueData.rating !== undefined ? venueData.rating : null
        });
        
        setError(null);
      } catch (err) {
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
  
  /**
   * Handles the form submission to update venue
   * 
   * @param {VenueFormData} formData - Form data from VenueForm
   */
  const handleSubmit = async (formData: VenueFormData) => {
    if (!id || !token) {
      setError('You must be logged in to update a venue');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
    
      
      setSuccess('Venue updated successfully!');
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        // Redirect to venue details page
        navigate(`/venues/${id}`);
      }, 1000);
    } catch (err) {
      setError('Failed to update venue. Please try again.');
      setIsSaving(false);
    }
  };
  
  /**
   * Handles showing the deletion confirmation modal
   */
  const handleShowDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };
  
  /**
   * Handles the venue deletion process
   */
  const handleDelete = async () => {
    if (!id || !token) return;
    
    try {
      setIsDeleting(true);
      await deleteVenue(id, token);
      
      // Redirect to venue manager dashboard
      navigate('/venue-manager/dashboard');
    } catch (err) {
      setError('Failed to delete venue. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
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
      
      <VenueForm
        initialValues={initialFormValues}
        isLoading={isSaving}
        onSubmit={handleSubmit}
        submitButtonText="Save Changes"
        showDeleteButton={true}
        onDelete={handleShowDeleteConfirm}
        deleteButtonText="Delete Venue"
      />
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default EditVenuePage;