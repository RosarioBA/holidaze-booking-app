/**
 * @file ProfilePage.tsx
 * @description User profile page showing personal information and booking summary
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getUserBookings } from '../../api/bookingService';
import { getVenueManagerVenues } from '../../api/venueService';
import { fetchFromApi } from '../../api/api';
import { Profile } from '../../types/profile';
import { 
  getUserAvatar, 
  getUserBanner, 
  setUserAvatar, 
  setUserBanner, 
  fetchProfileFromApi, 
  updateProfileWithApi 
} from '../../utils/avatarUtils';

// Components
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import BookingsSummary from '../../components/profile/BookingsSummary';

// Storage keys
const PROFILE_STORAGE_KEY = 'holidaze_profile';

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
 * Page component for user profile management
 * 
 * @returns {JSX.Element} Rendered component
 */
const ProfilePage: React.FC = () => {
  const { user, token, updateUser, logout } = useAuth();
  const editFormRef = useRef<HTMLDivElement>(null);
  
  
  // State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formBio, setFormBio] = useState('');
  const [formAvatarUrl, setFormAvatarUrl] = useState('');
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  /**
   * Handles the edit button click and scrolls to the edit form
   */
  const handleEditClick = () => {
    setIsEditing(true);
    
    // Use setTimeout to ensure the form is rendered before scrolling
    setTimeout(() => {
      // Smooth scroll to the edit form
      editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  /**
   * Handles the "Become a Venue Manager" button click
   * Uses window.location to force navigation and logout
   */
  const handleBecomeVenueManager = () => {
    // Log out first
    logout();
    
    // Use the full path including the base URL
    window.location.href = '/holidaze-booking-app/register?type=venue-manager';
  };

  /**
   * Fetches profile data from API and updates state and storage
   */
  const fetchProfileData = async () => {
    if (!user?.name || !token) return;
    
    try {
      setIsLoading(true);
      
      // Use our utility function to fetch profile and update localStorage
      const apiProfile = await fetchProfileFromApi(user.name, token);
      
      // Update local state
      setProfile(apiProfile);
      
      // Extract clean bio for the form display
      const cleanBio = extractCleanBio(apiProfile.bio || '');
      setFormBio(cleanBio);
      
      setFormAvatarUrl(apiProfile.avatar?.url || '');
      setFormBannerUrl(apiProfile.banner?.url || '');
      
      // Update localStorage
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(apiProfile));
      
      // Update auth context with clean bio
      updateUser({
        bio: cleanBio,
        avatar: apiProfile.avatar,
        banner: apiProfile.banner
      });
    } catch (error) {
      console.error('Error loading profile from API:', error);
      
      // Try loading from localStorage as fallback
      loadProfileFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Loads profile data from localStorage as fallback
   */
  const loadProfileFromLocalStorage = () => {
    if (!user) return;
    
    try {
      // Get avatar and banner using our utility functions
      const savedAvatarUrl = getUserAvatar(user.name);
      const savedBannerUrl = getUserBanner(user.name);
      
      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        
        // Only use stored profile if it matches current user
        if (parsedProfile.name === user.name) {
          // Apply saved avatar and banner if they exist
          if (savedAvatarUrl && (!parsedProfile.avatar || parsedProfile.avatar.url !== savedAvatarUrl)) {
            parsedProfile.avatar = {
              url: savedAvatarUrl,
              alt: `${user.name}'s avatar`
            };
          }
          
          if (savedBannerUrl && (!parsedProfile.banner || parsedProfile.banner.url !== savedBannerUrl)) {
            parsedProfile.banner = {
              url: savedBannerUrl,
              alt: `${user.name}'s banner`
            };
          }
          
          setProfile(parsedProfile);
          
          // Extract clean bio for form display
          const cleanBio = extractCleanBio(parsedProfile.bio || '');
          setFormBio(cleanBio);
          
          setFormAvatarUrl(parsedProfile.avatar?.url || savedAvatarUrl || '');
          setFormBannerUrl(parsedProfile.banner?.url || savedBannerUrl || '');
          
          return; // Exit early if we have a valid stored profile
        }
      }
      
      // If no stored profile, create default from user data
      const defaultProfile = {
        name: user.name,
        email: user.email,
        venueManager: user.venueManager || false,
        bio: '',
        _count: {
          bookings: 0,
          venues: 0
        }
      };
      
      setProfile(defaultProfile);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    } catch (error) {
      console.error('Error loading profile from localStorage:', error);
      
      // Create a basic profile even if there's an error
      if (user) {
        const basicProfile = {
          name: user.name,
          email: user.email,
          venueManager: user.venueManager || false,
          bio: '',
          _count: {
            bookings: 0,
            venues: 0
          }
        };
        setProfile(basicProfile);
      }
    }
  };

  /**
   * On component mount - fetch profile data
   */
  useEffect(() => {
    if (user && token) {
      fetchProfileData();
    }
  }, [user?.name, token]);

  /**
   * Fetches booking data from the API
   */
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!token || !user) return;
      
      setBookingsLoading(true);
      try {
        // Use different approaches depending on whether user is a venue manager
        if (user.venueManager) {
          // First, get all venues owned by this manager
          const venuesData = await getVenueManagerVenues(user.name, token);
          
          // For a venue manager, we'll fetch bookings for their venues
          const allBookings: any[] = [];
          
          for (const venue of venuesData) {
            try {
              // Try to get venue with bookings
              const venueResponse = await fetchFromApi<any>(
                `/holidaze/venues/${venue.id}?_bookings=true`, 
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              
              if (venueResponse.data?.bookings) {
                // Add venue info to each booking
                const venueBookings = venueResponse.data.bookings.map((booking: any) => ({
                  ...booking,
                  venue: {
                    id: venue.id,
                    name: venue.name
                  }
                }));
                
                allBookings.push(...venueBookings);
              }
            } catch (err) {
              // Skip the venue if there's an error
            }
          }
          
          // Sort bookings by date (most recent first)  
          allBookings.sort((a, b) => 
            new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()
          );
          
          setUserBookings(allBookings);
        } else {
          // For a regular customer, just fetch their bookings
          const bookings = await getUserBookings(token);
          setUserBookings(bookings);
        }
        
        // Also update the profile's booking count
        if (profile) {
          const updatedProfile: Profile = {
            ...profile,
            _count: {
              venues: profile._count?.venues || 0,
              bookings: userBookings.length
            }
          };
          setProfile(updatedProfile);
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
        }
      } catch (error) {
        // Handle silently - empty bookings will show appropriate UI
      } finally {
        setBookingsLoading(false);
      }
    };
    
    fetchUserBookings();
  }, [token, profile?.name, user]);
  
  /**
   * Handles profile data updates
   */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !token) return;
    
    try {
      setIsLoading(true);
      
      // Create update payload
      const updatePayload: any = {
        bio: formBio
      };
      
      // Only add avatar if URL provided
      if (formAvatarUrl.trim()) {
        updatePayload.avatar = {
          url: formAvatarUrl.trim(),
          alt: `${user.name}'s avatar`
        };
      }
      
      // Only add banner if URL provided
      if (formBannerUrl.trim()) {
        updatePayload.banner = {
          url: formBannerUrl.trim(),
          alt: `${user.name}'s banner`
        };
      }
      
      // Use our utility function to update profile
      const updatedProfile = await updateProfileWithApi(user.name, token, updatePayload);
      
      // Update local state
      setProfile(updatedProfile);
      
      // Update localStorage
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      
      // Ensure avatar and banner are stored in all locations
      if (updatedProfile.avatar?.url) {
        setUserAvatar(user.name, updatedProfile.avatar.url, user.venueManager);
      }
      
      if (updatedProfile.banner?.url) {
        setUserBanner(user.name, updatedProfile.banner.url, user.venueManager);
      }
      
      // Update the auth context with clean bio
      const cleanBio = extractCleanBio(updatedProfile.bio || '');
      updateUser({
        bio: cleanBio,
        avatar: updatedProfile.avatar,
        banner: updatedProfile.banner
      });
      
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
      </div>
    );
  }

  // Error state
  if (!profile && user) {
    // Create default profile if we somehow don't have one
    const defaultProfile = {
      name: user.name,
      email: user.email,
      venueManager: user.venueManager || false,
      bio: '',
      _count: {
        bookings: 0,
        venues: 0
      }
    };
    setProfile(defaultProfile);
  }

  // If we don't have any profile to display
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Unable to load profile. Please try again later.
        </div>
        <Link to="/dashboard" className="text-[#0081A7] hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate bookings count from fetched bookings
  const bookingsCount = userBookings.length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Profile updated successfully
        </div>
      )}
      
      {/* Profile Header with Banner and Avatar */}
      <ProfileHeader profile={profile} />
      
      {/* Profile Information */}
      <ProfileInfo 
        profile={{
          ...profile,
          bio: extractCleanBio(profile.bio || '') || 'No bio provided'
        }}
        bookingsCount={bookingsCount}
        bookingsLoading={bookingsLoading}
        onEditClick={handleEditClick}
      />
      
      {/* Profile Edit Form */}
      {isEditing && (
        <ProfileEditForm
          ref={editFormRef}
          bio={formBio}
          avatarUrl={formAvatarUrl}
          bannerUrl={formBannerUrl}
          isLoading={isLoading}
          onBioChange={setFormBio}
          onAvatarUrlChange={setFormAvatarUrl}
          onBannerUrlChange={setFormBannerUrl}
          onSubmit={handleUpdateProfile}
          onCancel={() => setIsEditing(false)}
        />
      )}
      
      {/* Bookings Summary */}
      <BookingsSummary
        isVenueManager={profile.venueManager}
        bookingsCount={bookingsCount}
        isLoading={bookingsLoading}
      />
      
      {/* Become a Venue Manager CTA (if not already) */}
      {!profile.venueManager && (
        <div className="bg-[#F5F7DC] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-2 font-averia">Become a Venue Manager</h2>
          <p className="text-gray-700 mb-4 font-light tracking-wide">
            List your property on Holidaze and start earning income from your space.
          </p>
          <p className="text-gray-600 mb-4 text-sm font-light">
            Note: You'll need to create a separate venue manager account to list properties.
          </p>
          <button
            onClick={handleBecomeVenueManager}
            className="inline-block bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F] transition-colors"
          >
            Register as Venue Manager
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;