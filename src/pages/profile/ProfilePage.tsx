// src/pages/profile/ProfilePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getUserBookings } from '../../api/bookingService';
import { getVenueManagerVenues } from '../../api/venueService';
import { fetchFromApi } from '../../api/api';

interface ProfileMedia {
  url: string;
  alt?: string;
}

interface Profile {
  name: string;
  email: string;
  bio?: string;
  avatar?: ProfileMedia;
  banner?: ProfileMedia;
  venueManager: boolean;
  _count?: {
    venues: number;
    bookings: number;
  };
}

const PROFILE_STORAGE_KEY = 'holidaze_profile';

const ProfilePage: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const editFormRef = useRef<HTMLDivElement>(null);
  
  // Define user-specific avatar and banner keys inside the component where user is available
  const AVATAR_STORAGE_KEY = user ? `holidaze_avatar_url_${user.name}_${user.venueManager ? 'manager' : 'customer'}` : 'holidaze_avatar_url_default';
  const BANNER_STORAGE_KEY = user ? `holidaze_banner_url_${user.name}_${user.venueManager ? 'manager' : 'customer'}` : 'holidaze_banner_url_default';
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formBio, setFormBio] = useState('');
  const [formAvatarUrl, setFormAvatarUrl] = useState('');
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
    
    // Use setTimeout to ensure the form is rendered before scrolling
    setTimeout(() => {
      // Smooth scroll to the edit form
      editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Load profile from localStorage first
  useEffect(() => {
    if (!user) return;
    
    try {
      // Check for saved avatar and banner URLs
      const savedAvatarUrl = localStorage.getItem(AVATAR_STORAGE_KEY);
      const savedBannerUrl = localStorage.getItem(BANNER_STORAGE_KEY);
      
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
            
            // Also update the auth context
            updateUser({
              avatar: {
                url: savedAvatarUrl,
                alt: `${user.name}'s avatar`
              }
            });
          }
          
          if (savedBannerUrl && (!parsedProfile.banner || parsedProfile.banner.url !== savedBannerUrl)) {
            parsedProfile.banner = {
              url: savedBannerUrl,
              alt: `${user.name}'s banner`
            };
          }
          
          setProfile(parsedProfile);
          setFormBio(parsedProfile.bio || '');
          setFormAvatarUrl(parsedProfile.avatar?.url || savedAvatarUrl || '');
          setFormBannerUrl(parsedProfile.banner?.url || savedBannerUrl || '');
          
          // Save the updated profile back to localStorage
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(parsedProfile));
          return; // Exit early if we have a stored profile
        }
      }
      
      // If no stored profile, create default from user data
      const defaultProfile = {
        name: user.name,
        email: user.email,
        venueManager: user.venueManager || false,
        bio: '',
        avatar: undefined,
        _count: {
          bookings: 0,
          venues: 0
        }
      };
      
      // Also save this default profile to localStorage
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
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser, AVATAR_STORAGE_KEY, BANNER_STORAGE_KEY]);

  // Fetch user bookings directly from the API
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
              console.error(`Error fetching venue ${venue.id}:`, err);
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
        console.error('Error fetching user bookings:', error);
      } finally {
        setBookingsLoading(false);
      }
    };
    
    fetchUserBookings();
  }, [token, profile?.name, user]);
  
  // Update profile function
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Create updated profile object
      const updatedProfile: Profile = {
        name: user.name,
        email: user.email,
        venueManager: user.venueManager || false,
        bio: formBio,
        _count: profile?._count || {
          bookings: userBookings.length,
          venues: 0
        }
      };
      
      // Only add avatar if URL provided
      if (formAvatarUrl.trim()) {
        updatedProfile.avatar = {
          url: formAvatarUrl.trim(),
          alt: `${user.name}'s avatar`
        };
        
        // Save avatar URL separately for persistence across sessions
        localStorage.setItem(AVATAR_STORAGE_KEY, formAvatarUrl.trim());
        
        // Update auth context with new avatar
        updateUser({
          avatar: {
            url: formAvatarUrl.trim(),
            alt: `${user.name}'s avatar`
          }
        });
      }
      
      // Only add banner if URL provided
      if (formBannerUrl.trim()) {
        updatedProfile.banner = {
          url: formBannerUrl.trim(),
          alt: `${user.name}'s banner`
        };
        
        // Save banner URL separately for persistence across sessions
        localStorage.setItem(BANNER_STORAGE_KEY, formBannerUrl.trim());
      }
      
      // Update state and localStorage
      setProfile(updatedProfile);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      
      setUpdateSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
      </div>
    );
  }

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

  // Calculate bookings count from fetched bookings rather than relying on profile._count
  const bookingsCount = userBookings.length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Profile updated successfully
        </div>
      )}
      
      {/* Banner and Profile Image */}
      <div className="relative mb-16">
        <div className="h-48 bg-[#F5F7DC] rounded-lg overflow-hidden">
          {profile.banner ? (
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
          {profile.avatar ? (
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
          
          <button
            onClick={handleEditClick}
            className="bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
          >
            Edit Profile
          </button>
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
            <div>
              <span className="text-gray-600 block text-sm">Bookings</span>
              <span className="font-medium">
                {bookingsLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  bookingsCount
                )}
              </span>
            </div>
            {profile.venueManager && (
              <div>
                <span className="text-gray-600 block text-sm">Venues Listed</span>
                <span className="font-medium">
                  {profile._count?.venues || 0}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Edit Form */}
      {isEditing && (
        <div 
          ref={editFormRef} 
          className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-[#0081A7]"
        >
          <h2 className="text-xl font-bold mb-4 font-averia">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                value={formBio}
                onChange={(e) => setFormBio(e.target.value)}
                placeholder="Tell us about yourself"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatarUrl"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                value={formAvatarUrl}
                onChange={(e) => setFormAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide a valid URL to a publicly accessible image
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Banner URL
              </label>
              <input
                type="url"
                id="bannerUrl"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0081A7]"
                value={formBannerUrl}
                onChange={(e) => setFormBannerUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide a valid URL to a publicly accessible image
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0081A7] text-white rounded-md hover:bg-[#13262F]"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
      
     {/* My Bookings Section */}
     <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-averia">
          {profile.venueManager ? 'Venue Bookings' : 'My Bookings'}
        </h2>
    <Link 
      to={profile.venueManager ? "/venue-manager/bookings" : "/my-trips"}
      className="text-[#0081A7] hover:underline"
    >
      View All
    </Link>
  </div>
  
  {bookingsLoading ? (
    <div className="text-center p-3">
      <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0081A7]"></div>
      <span className="ml-2 text-gray-600">Loading bookings...</span>
    </div>
  ) : !bookingsCount || bookingsCount === 0 ? (
    <div className="text-center p-6 bg-gray-50 rounded-lg">
      <p className="text-gray-600 mb-3">
        {profile.venueManager 
          ? "You don't have any bookings for your venues yet."
          : "You don't have any bookings yet."}
      </p>
      <Link 
        to="/venues" 
        className="inline-block bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
      >
        Explore Venues
      </Link>
    </div>
  ) : (
    <p className="text-gray-600">
      You have {bookingsCount} {bookingsCount === 1 ? 'booking' : 'bookings'}.
      <br />
      Visit the {profile.venueManager ? 'Bookings Management' : 'My Trips'} page to view {profile.venueManager ? 'all' : 'your'} bookings.
    </p>
  )}
</div>
     {/* Become a Venue Manager CTA (if not already) */}
      {!profile.venueManager && (
        <div className="bg-[#F5F7DC] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-2 font-averia">Become a Venue Manager</h2>
          <p className="text-gray-700 mb-4 font-light tracking-wide">
            List your property on Holidaze and start earning income from your space.
          </p>
          <Link
            to="/register?type=venue-manager"
            className="inline-block bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
          >
            Register as Venue Manager
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;