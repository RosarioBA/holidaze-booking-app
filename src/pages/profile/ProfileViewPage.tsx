/**
 * @file ProfileViewPage.tsx
 * @description Page for viewing other users' profiles and their venues
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFromApi } from '../../api/api';
import { Venue } from '../../types/venue';
import { getUserAvatar, getUserBanner } from '../../utils/avatarUtils';
import { useAuth } from '../../contexts/AuthContext';
import { Profile } from '../../types/profile'; // Import the shared Profile interface

// Import shared components
import ProfileHeader from '../../components/profile/ProfileHeader';

/**
 * Extracts the actual bio text from a bio that may contain favorites data
 * @param bioText - The bio text that may contain favorites JSON
 * @returns The clean bio text without favorites data
 */
const extractCleanBio = (bioText: string): string => {
  if (!bioText) return '';
  
  // Remove the favorites data section if it exists
  const cleanBio = bioText.replace(/\[FAVORITES\].*?\[\/FAVORITES\]$/, '').trim();
  return cleanBio;
};

/**
 * Component for a single venue card
 */
interface VenueCardProps {
  venue: Venue;
}

/**
 * Venue card component for the venue manager's listings
 */
const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  // Helper function to get venue image URL
  const getImageUrl = (venue: Venue) => {
    if (venue?.media && venue.media.length > 0 && venue.media[0].url) {
      return venue.media[0].url;
    }
    return 'https://placehold.co/300x200?text=No+Image';
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md">
      <div className="h-40 bg-gray-200">
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
        <h3 className="font-medium text-lg mb-1 font-averia">{venue.name}</h3>
        <p className="text-sm text-gray-600 mb-2 tracking-wide">
          {venue.location?.city ? `${venue.location.city}, ` : ''}
          {venue.location?.country || 'Location not specified'}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-bold">{venue.price} kr/night</span>
          <Link 
            to={`/venues/${venue.id}`}
            className="text-[#0081A7] hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * Component for displaying venue manager's venues
 */
interface VenueListProps {
  profileName: string;
  venues: Venue[];
}

/**
 * Section component for displaying the venue manager's listings
 */
const VenueList: React.FC<VenueListProps> = ({ profileName, venues }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 font-averia">{profileName}'s Venues</h2>
      
      {venues.length === 0 ? (
        <p className="text-gray-600 font-light">This venue manager hasn't listed any venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Profile view page for viewing another user's profile
 */
const ProfileViewPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches profile data and venue listings if applicable
   */
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!name || !token) {
        setError("Authentication required to view profiles");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch profile data with authentication
        const profileResponse = await fetchFromApi<{data: Profile}>(
          `/holidaze/profiles/${name}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Apply locally stored avatar/banner if available
        const profileData = profileResponse.data;
        const localAvatar = getUserAvatar(name);
        const localBanner = getUserBanner(name);
        
        if (localAvatar) {
          profileData.avatar = {
            url: localAvatar,
            alt: `${name}'s avatar`
          };
        }
        
        if (localBanner) {
          profileData.banner = {
            url: localBanner,
            alt: `${name}'s banner`
          };
        }
        
        setProfile(profileData);
        
        // Check if profile is a venue manager before fetching venues
        if (profileData.venueManager) {
          // Fetch venues for this profile with authentication
          const venuesResponse = await fetchFromApi<{data: Venue[]}>(
            `/holidaze/profiles/${name}/venues`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          setVenues(venuesResponse.data || []);
        }
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [name, token]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error || 'Profile not found'}
        </div>
        <Link to="/" className="text-[#0081A7] hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  // Create a custom ProfileInfo component for the view-only version
  const ViewOnlyProfileInfo = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold font-averia">{profile.name}</h1>
          <p className="text-gray-600 font-light">{profile.email}</p>
          <p className="text-gray-700 mt-2 tracking-wide">
           {extractCleanBio(profile.bio || '') || 'No bio provided'}
          </p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h2 className="font-semibold mb-2 font-averia">Account Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600 block text-sm">Account Type</span>
            <span className="font-medium">
              {profile.venueManager ? 'Venue Manager' : 'Customer'}
            </span>
          </div>
          {profile._count && (
            <>
              <div>
                <span className="text-gray-600 block text-sm">Bookings</span>
                <span className="font-medium">
                  {profile._count.bookings || 0}
                </span>
              </div>
              {profile.venueManager && (
                <div>
                  <span className="text-gray-600 block text-sm">Venues Listed</span>
                  <span className="font-medium">
                    {profile._count.venues || 0}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header with Banner and Avatar */}
      <ProfileHeader profile={profile} />
      
      {/* Profile Information - Using our custom ViewOnlyProfileInfo */}
      <ViewOnlyProfileInfo />
      
      {/* Venues Section - only show if profile is a venue manager */}
      {profile.venueManager && (
        <VenueList 
          profileName={profile.name} 
          venues={venues} 
        />
      )}
    </div>
  );
};

export default ProfileViewPage;