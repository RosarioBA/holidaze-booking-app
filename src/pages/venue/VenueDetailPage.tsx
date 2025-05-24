/**
 * @file VenueDetailPage.tsx
 * @description Page for viewing detailed information about a venue
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getVenueById } from '../../api/venueService';
import { createBooking } from '../../api/bookingService';
import { getVenueRatings, hasUserRatedVenue, calculateAverageRating } from '../../api/ratingService';
import { Rating } from '../../types/rating';
import { Venue } from '../../types/venue';
import { useAuth } from '../../contexts/AuthContext';
import { addToRecentlyViewed } from '../../utils/venueUtils';

// Components
import ImageGallery from '../../components/venue/ImageGallery';
import BookingCalendar from '../../components/venue/BookingCalendar';
import RatingPrompt from '../../components/venue/RatingPrompt';
import RatingModal from '../../components/venue/RatingModal';
import VenueHeader from '../../components/venue/VenueHeader';
import VenueAmenities from '../../components/venue/VenueAmenities';
import VenueLocation from '../../components/venue/VenueLocation';
import VenueHost from '../../components/venue/VenueHost';
import VenueRatingSection from '../../components/venue/VenueRatingSection';
import VenuePriceCard from '../../components/venue/VenuePriceCard';

/**
 * Page component for viewing detailed venue information and making bookings
 * 
 * @returns {JSX.Element} Rendered component
 */
const VenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Get source from query parameters
  const currentLocation = useLocation();
  const queryParams = new URLSearchParams(currentLocation.search);
  const source = queryParams.get('source');
  
  // Page state
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

  /**
   * Determines the appropriate back navigation based on source parameter
   */
  const getBackNavigation = () => {
    switch (source) {
      case 'venues':
        return { path: '/venues', label: 'Back to Venues' };
      case 'saved':
        return { path: '/customer/saved', label: 'Back to Saved Venues' };
      case 'my-trips':
        return { path: '/customer/trips', label: 'Back to My Trips' };
      case 'search':
        // Preserve search parameters if coming from search
        const searchQuery = queryParams.get('searchQuery');
        const searchPath = searchQuery ? `/venues?search=${encodeURIComponent(searchQuery)}` : '/venues';
        return { path: searchPath, label: 'Back to Search Results' };
      case 'manager-venues':
        return { path: '/venue-manager/venues', label: 'Back to My Venues' };
      case 'dashboard':
        return { path: '/dashboard', label: 'Back to Dashboard' };
      default:
        // Default to venues page
        return { path: '/venues', label: 'Back to Venues' };
    }
  };

  /**
   * Fetches ratings data for the venue
   */
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
        // Check if user has rated using the imported utility
        const userHasRated = hasUserRatedVenue(id, user.name);
        setUserHasRated(userHasRated);
      }
    } catch (err) {
      // Handle error silently
    } finally {
      setRatingsLoading(false);
    }
  };

  /**
   * Checks if the user is eligible to rate this venue
   */
  const checkEligibilityToRate = () => {
    // In development, allow all authenticated users to rate
    // For production, uncomment the code below to check booking history
    
    if (user && venue && venue.bookings && venue.bookings.length > 0) {
      const userCompletedBookings = venue.bookings.filter(booking => 
        booking.customer?.name === user.name && 
        new Date(booking.dateTo) < new Date()  // Only past bookings
      );
      setUserHasBooked(userCompletedBookings.length > 0);
    } else {
      // For now, allow all authenticated users to rate
      setUserHasBooked(false);
    }
  };

  /**
   * Fetches venue data and manages related state
   */
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
        if (venueData) {
          addToRecentlyViewed(venueData.id);
        }
      } catch (err) {
        setError('Failed to load venue details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
    fetchRatings();
  }, [id, user]);

  /**
   * Handles rating submission completion
   */
  const handleRatingSubmitted = () => {
    // Refresh ratings after submission
    fetchRatings();
  };

  /**
   * Handles booking submission
   * 
   * @param {Date} from - Check-in date
   * @param {Date} to - Check-out date
   * @param {number} guests - Number of guests
   */
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
      setBookingError('Failed to create booking. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error || !venue) {
    const backNav = getBackNavigation();
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
          {error || 'Venue not found'}
        </div>
        <Link to={backNav.path} className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {backNav.label}
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

  // Get back navigation info
  const backNav = getBackNavigation();

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
          <p className="mt-1 ml-7">Your reservation has been successfully booked. <Link to="/customer/trips" className="text-green-700 underline">View your bookings</Link></p>
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
        to={backNav.path}
        className="text-blue-600 hover:underline flex items-center mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {backNav.label}
      </Link>

      {/* Venue Header */}
      <VenueHeader 
        name={name}
        location={location}
        averageRating={averageRating}
        ratingsCount={ratings.length}
      />

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
          <VenueAmenities meta={meta} />

          {/* Location Section */}
          <VenueLocation location={location} />

          {/* Host Section */}
          {owner && <VenueHost owner={owner} />}

          {/* Ratings Section */}
          <VenueRatingSection
            averageRating={averageRating}
            ratings={ratings}
            isLoading={ratingsLoading}
            showRatingForm={showRatingForm}
            canRateVenue={canRateVenue ?? false}
            venueId={id || ''}
            onRatingSubmitted={handleRatingSubmitted}
          />
        </div>

        {/* Right Column - Booking Calendar */}
        <div className="lg:w-1/3">
          <div className="sticky top-6">
            {/* Price Card */}
            <VenuePriceCard
              price={price}
              maxGuests={maxGuests}
              averageRating={averageRating}
            />

           {/* Enhanced Booking Calendar Component */}
            <BookingCalendar
              venueId={id || ''}
              maxGuests={maxGuests}
              bookings={bookings}
              price={price}
              onBookingSubmit={handleBookingSubmit}
              venueOwner={owner}
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