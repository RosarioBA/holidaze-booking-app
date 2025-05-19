// src/pages/venue/VenueDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getVenueById } from '../../api/venueService';
import { createBooking } from '../../api/bookingService';
import { getVenueRatings, hasUserRatedVenue, calculateAverageRating, getVenueRatingInfo } from '../../api/ratingService';
import { Rating } from '../../types/rating';
import { Venue } from '../../types/venue';
import { useAuth } from '../../contexts/AuthContext';
import ImageGallery from '../../components/venue/ImageGallery';
import AmenityIcon from '../../components/venue/AmenityIcon';
import BookingCalendar from '../../components/venue/BookingCalendar';
import RatingForm from '../../components/venue/RatingForm';
import RatingsList from '../../components/venue/RatingsList';
import RatingPrompt from '../../components/venue/RatingPrompt';
import RatingModal from '../../components/venue/RatingModal';
import StarRating from '../../components/common/StarRating';
import { getUserAvatar } from '../../utils/avatarUtils';

const VenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const currentLocation = useLocation();
  const queryParams = new URLSearchParams(currentLocation.search);
  const source = queryParams.get('source');
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  // Ratings state
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [userHasBooked, setUserHasBooked] = useState(false);
  const [userHasRated, setUserHasRated] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Function to fetch ratings from localStorage
  const fetchRatings = async () => {
    if (!id) return;
    
    try {
      setRatingsLoading(true);
      
      // Get the ratings from localStorage
      const ratingsData = await getVenueRatings(id);
      setRatings(ratingsData);
      
      // Calculate average rating
      const avgRating = calculateAverageRating(id);
      setAverageRating(avgRating);
      
      // Check if current user has already rated
      if (user) {
        // Use the imported hasUserRatedVenue directly with the venue ID and user name
        const userHasRated = hasUserRatedVenue(id, user.name);
        setUserHasRated(userHasRated);
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
    } finally {
      setRatingsLoading(false);
    }
  };

  // Check if the user has booked this venue
  // For development purposes, consider everyone eligible to rate
  // In a real app, you'd check if user has completed a booking
  const checkEligibilityToRate = () => {
    // In development, allow all authenticated users to rate
    // For production, uncomment the code below to check booking history
    /*
    if (user && venue.bookings) {
      const userBookings = venue.bookings.filter(booking => 
        booking.customer?.name === user.name && 
        new Date(booking.dateTo) < new Date()  // Only past bookings
      );
      setUserHasBooked(userBookings.length > 0);
    }
    */
    
    // For now, allow all authenticated users to rate
    setUserHasBooked(!!user);
  };

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Include owner and bookings details when fetching the venue
        const venueData = await getVenueById(id, true, true);
        setVenue(venueData);
        setError(null);
        
        // Check eligibility to rate
        checkEligibilityToRate();
        
        // Add this venue to recently viewed (localStorage)
        addToRecentlyViewed(venueData);
      } catch (err) {
        console.error('Error fetching venue:', err);
        setError('Failed to load venue details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
    fetchRatings();
  }, [id, user]);

  // Add venue to recently viewed in localStorage
  const addToRecentlyViewed = (venue: Venue) => {
    try {
      console.log("Adding to recently viewed:", venue.id, venue.name);
      
      // Get existing recently viewed IDs or initialize empty array
      const recentlyViewedString = localStorage.getItem('recentlyViewed');
      let recentlyViewedIds: string[] = [];
      
      if (recentlyViewedString) {
        try {
          const parsed = JSON.parse(recentlyViewedString);
          // Check if it's an array of strings (IDs) or an array of objects (old format)
          if (Array.isArray(parsed)) {
            if (parsed.length > 0 && typeof parsed[0] === 'string') {
              // It's already the correct format - array of IDs
              recentlyViewedIds = parsed;
            } else if (parsed.length > 0 && typeof parsed[0] === 'object') {
              // Old format - array of venue objects
              recentlyViewedIds = parsed.map((v: any) => v.id || '').filter(Boolean);
            }
          }
        } catch (error) {
          console.error('Error parsing recently viewed:', error);
        }
      }
      
      // Remove this venue ID if it already exists
      recentlyViewedIds = recentlyViewedIds.filter(id => id !== venue.id);
      
      // Add to beginning of array
      recentlyViewedIds.unshift(venue.id);
      
      // Keep only the last 5
      const limited = recentlyViewedIds.slice(0, 5);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(limited));
    } catch (error) {
      console.error('Error saving to recently viewed:', error);
    }
  };

  // Handle rating submission - simplified for localStorage version
  const handleRatingSubmitted = () => {
    // Refresh ratings after submission
    fetchRatings();
  };

  const handleBookingSubmit = async (from: Date, to: Date, guests: number) => {
    if (!id || !token) return;
    
    try {
      setBookingError(null);
      
      const bookingData = {
        dateFrom: from.toISOString(),
        dateTo: to.toISOString(),
        guests,
        venueId: id
      };
      
      await createBooking(bookingData, token);
      setBookingSuccess(true);
      
      // Refresh venue data to update booking information
      const updatedVenue = await getVenueById(id, true, true);
      setVenue(updatedVenue);
      
      // Update userHasBooked state
      setUserHasBooked(true);
      
      // Scroll to the top to show the success message
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setBookingError('Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
          {error || 'Venue not found'}
        </div>
        <Link to="/venues" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Venues
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    media,
    price,
    maxGuests,
    location,
    meta,
    owner,
    bookings
  } = venue;

  // Show rating form only if:
  // 1. User is logged in
  // 2. User has not already rated the venue
  // 3. User is not the owner of the venue
  const canRateVenue = user && !userHasRated && user.name !== owner?.name;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Success Message */}
      {bookingSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Booking Confirmed!</span>
          </div>
          <p className="mt-1 ml-7">Your reservation has been successfully booked. <Link to="/my-trips" className="text-green-700 underline">View your bookings</Link></p>
        </div>
      )}
      
      {/* Error Message */}
      {bookingError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
          {bookingError}
        </div>
      )}
      
      {/* Back Button */}
      <Link 
        to={source === 'my-trips' ? '/my-trips' : '/venues'} 
        className="text-blue-600 hover:underline flex items-center mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {source === 'my-trips' ? 'Back to My Trips' : 'Back to Venues'}
      </Link>

      {/* Venue Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-averia">{name}</h1>
        <div className="flex flex-wrap items-center text-gray-600 gap-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>
              {[location.city, location.country].filter(Boolean).join(', ') || 'Location not specified'}
            </span>
          </div>
          {averageRating > 0 && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{averageRating.toFixed(1)} ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-6">
        <ImageGallery images={media} name={name} />
      </div>
      
      {/* Rating Prompt */}
      <RatingPrompt
        venueId={id || ''}
        hasUserBooked={userHasBooked}
        hasUserRated={userHasRated}
        onOpenRatingForm={() => setShowRatingModal(true)}
      />

      {/* Two Column Layout for Details and Booking */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column - Venue Details */}
        <div className="lg:w-2/3">
          {/* Description Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 font-averia">About this venue</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line font-light">{description}</p>
            </div>
          </section>

          {/* Amenities Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 font-averia">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`flex items-center ${meta?.wifi ? 'text-gray-800' : 'text-gray-400'}`}>
                <AmenityIcon type="wifi" active={meta?.wifi || false} />
                <span className="ml-2">WiFi</span>
              </div>
              <div className={`flex items-center ${(meta?.parking ?? false) ? 'text-gray-800' : 'text-gray-400'}`}>
                <AmenityIcon type="parking" active={meta?.parking ?? false} />
                <span className="ml-2">Parking</span>
              </div>
              <div className={`flex items-center ${(meta?.breakfast ?? false) ? 'text-gray-800' : 'text-gray-400'}`}>
                <AmenityIcon type="breakfast" active={meta?.breakfast ?? false} />
                <span className="ml-2">Breakfast</span>
              </div>
              <div className={`flex items-center ${(meta?.pets ?? false) ? 'text-gray-800' : 'text-gray-400'}`}>
                <AmenityIcon type="pets" active={meta?.pets ?? false} />
                <span className="ml-2">Pets Allowed</span>
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 font-averia">Location</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2 font-averia">Address</h3>
              <p>
                {location.address && <span className="block">{location.address}</span>}
                {location.city && location.zip && <span className="block">{location.city}, {location.zip}</span>}
                {location.country && <span className="block">{location.country}</span>}
              </p>
              
              {/* If we had map integration, it would go here */}
              <div className="h-64 bg-gray-200 mt-4 rounded flex items-center justify-center">
                <p className="text-gray-500">Map view not available</p>
              </div>
            </div>
          </section>

          {/* Host Section */}
          {owner && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 font-averia">
                Hosted by{' '}
                <Link to={`/profiles/${owner.name}`} className="text-[#0081A7] hover:underline">
                  {owner.name}
                </Link>
              </h2>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                  {/* Check for avatar in localStorage first */}
                  {owner.name && getUserAvatar(owner.name) ? (
                    <img 
                      src={getUserAvatar(owner.name)} 
                      alt={`${owner.name}'s avatar`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/200x200?text=Host';
                      }}
                    />
                  ) : owner.avatar ? (
                    <img 
                      src={owner.avatar.url} 
                      alt={owner.avatar.alt || `${owner.name}'s avatar`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/200x200?text=Host';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg font-averia">
                    <Link to={`/profiles/${owner.name}`} className="text-[#0081A7] hover:underline">
                      {owner.name}
                    </Link>
                  </h3>
                  {owner.bio && <p className="text-gray-600">{owner.bio}</p>}
                </div>
              </div>
            </section>
          )}

          {/* Ratings Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-averia">
                Reviews
                {ratings.length > 0 && ` (${ratings.length})`}
              </h2>
              {averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-xl">
                        {star <= Math.round(averageRating) ? (
                          <span className="text-yellow-500">★</span>
                        ) : (
                          <span className="text-gray-300">☆</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* Show rating form if showRatingForm is true */}
            {(showRatingForm && canRateVenue) && (
              <RatingForm 
                venueId={id || ''} 
                onRatingSubmitted={handleRatingSubmitted}
                canRate={true}
              />
            )}
            
            {/* Display ratings list */}
            <div className="mt-6">
              <RatingsList 
                ratings={ratings} 
                isLoading={ratingsLoading} 
              />
            </div>
          </section>
        </div>

        {/* Right Column - Booking Calendar */}
        <div className="lg:w-1/3">
          <div className="sticky top-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-2xl font-bold">${price}</span>
                  <span className="text-gray-600"> / night</span>
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Max guests: {maxGuests}</p>
              </div>
            </div>

            {/* Enhanced Booking Calendar Component */}
            <BookingCalendar
              venueId={id || ''}
              maxGuests={maxGuests}
              bookings={bookings}
              price={price}
              onBookingSubmit={handleBookingSubmit}
            />
          </div>
        </div>
      </div>
      
      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          venueId={id || ''}
          venueName={name}
          onClose={() => setShowRatingModal(false)}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
};

export default VenueDetailPage;