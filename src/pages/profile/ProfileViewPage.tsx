// src/pages/profile/ProfileViewPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFromApi } from '../../api/api';
import { Venue } from '../../types/venue';
import { getUserAvatar, getUserBanner } from '../../utils/avatarUtils';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileViewProps {}

interface ProfileData {
  name: string;
  email: string;
  bio?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  banner?: {
    url: string;
    alt?: string;
  };
  venueManager: boolean;
  _count?: {
    venues: number;
    bookings: number;
  };
}

const ProfileViewPage: React.FC<ProfileViewProps> = () => {
  const { name } = useParams<{ name: string }>();
  const { token } = useAuth(); // Get the authentication token
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const profileResponse = await fetchFromApi<{data: ProfileData}>(
          `/holidaze/profiles/${name}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setProfile(profileResponse.data);
        
        // Check if profile is a venue manager before fetching venues
        if (profileResponse.data.venueManager) {
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
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [name, token]);
  
  // Get image URL with fallback
  const getImageUrl = (venue: Venue) => {
    if (venue?.media && venue.media.length > 0 && venue.media[0].url) {
      return venue.media[0].url;
    }
    return 'https://placehold.co/300x200?text=No+Image';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
      </div>
    );
  }

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Banner and Profile Image */}
      <div className="relative mb-16">
        <div className="h-48 bg-[#F5F7DC] rounded-lg overflow-hidden">
          {/* Try to get banner from localStorage first, then fall back to profile banner */}
          {name && getUserBanner(name) ? (
            <img 
              src={getUserBanner(name)}
              alt={`${profile.name}'s banner`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/1200x400?text=No+Banner';
              }}
            />
          ) : profile.banner ? (
            <img 
              src={profile.banner.url} 
              alt={profile.banner.alt || `${profile.name}'s banner`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/1200x400?text=No+Banner';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8F754F] font-medium">
              No Banner Available
            </div>
          )}
        </div>
        
        <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full border-4 border-white overflow-hidden">
          {/* Try to get avatar from localStorage first, then fall back to profile avatar */}
          {name && getUserAvatar(name) ? (
            <img 
              src={getUserAvatar(name)}
              alt={`${profile.name}'s avatar`}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/200x200?text=No+Avatar';
              }}
            />
          ) : profile.avatar ? (
            <img 
              src={profile.avatar.url} 
              alt={profile.avatar.alt || profile.name}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/200x200?text=No+Avatar';
              }}
            />
          ) : (
            <div className="w-full h-full bg-[#0081A7] flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold font-averia">{profile.name}</h1>
            <p className="text-gray-600 font-light">{profile.email}</p>
            <p className="text-gray-700 mt-2 tracking-wide">
              {profile.bio || 'No bio provided'}
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
      
      {/* Venues Section - only show if profile is a venue manager */}
      {profile.venueManager && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 font-averia">{profile.name}'s Venues</h2>
          
          {venues.length === 0 ? (
            <p className="text-gray-600 font-light">This venue manager hasn't listed any venues yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venues.map(venue => (
                <div key={venue.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md">
                  {/* ... */}
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileViewPage;