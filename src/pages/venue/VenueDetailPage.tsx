// src/pages/venue/VenueDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getVenueById } from '../../api/venueService';
import { createBooking } from '../../api/bookingService';
import { Venue } from '../../types/venue';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import ImageGallery from '../../components/venue/ImageGallery';
import AmenityIcon from '../../components/venue/AmenityIcon';
import BookingCalendar from '../../components/venue/BookingCalendar';

const VenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Include owner and bookings details when fetching the venue
        const venueData = await getVenueById(id, true, true);
        setVenue(venueData);
        setError(null);
        
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
  }, [id]);

  // Add venue to recently viewed in localStorage
  const addToRecentlyViewed = (venue: Venue) => {
    try {
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      
      // Remove if already exists
      const filtered = recentlyViewed.filter((v: Venue) => v.id !== venue.id);
      
      // Add to beginning of array
      filtered.unshift(venue);
      
      // Keep only the last 5
      const limited = filtered.slice(0, 5);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(limited));
    } catch (error) {
      console.error('Error saving to recently viewed:', error);
    }
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
      
      // Scroll to the top to show the success message
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setBookingError('Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !venue) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  const {
    name,
    description,
    media,
    price,
    maxGuests,
    rating,
    location,
    meta,
    owner,
    bookings
  } = venue;

  return (
    <Layout>
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
        <Link to="/venues" className="text-blue-600 hover:underline flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Venues
        </Link>

        {/* Venue Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
          <div className="flex flex-wrap items-center text-gray-600 gap-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>
                {[location.city, location.country].filter(Boolean).join(', ') || 'Location not specified'}
              </span>
            </div>
            {rating > 0 && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{rating.toFixed(1)} Rating</span>
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-10">
          <ImageGallery images={media} name={name} />
        </div>

        {/* Two Column Layout for Details and Booking */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column - Venue Details */}
          <div className="lg:w-2/3">
            {/* Description Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">About this venue</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{description}</p>
              </div>
            </section>

            {/* Amenities Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`flex items-center ${meta.wifi ? 'text-gray-800' : 'text-gray-400'}`}>
                  <AmenityIcon type="wifi" active={meta.wifi} />
                  <span className="ml-2">WiFi</span>
                </div>
                <div className={`flex items-center ${meta.parking ? 'text-gray-800' : 'text-gray-400'}`}>
                  <AmenityIcon type="parking" active={meta.parking} />
                  <span className="ml-2">Parking</span>
                </div>
                <div className={`flex items-center ${meta.breakfast ? 'text-gray-800' : 'text-gray-400'}`}>
                  <AmenityIcon type="breakfast" active={meta.breakfast} />
                  <span className="ml-2">Breakfast</span>
                </div>
                <div className={`flex items-center ${meta.pets ? 'text-gray-800' : 'text-gray-400'}`}>
                  <AmenityIcon type="pets" active={meta.pets} />
                  <span className="ml-2">Pets Allowed</span>
                </div>
              </div>
            </section>

            {/* Location Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Address</h3>
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
                <h2 className="text-2xl font-bold mb-4">Hosted by {owner.name}</h2>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                    {owner.avatar ? (
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
                    <h3 className="font-bold text-lg">{owner.name}</h3>
                    {owner.bio && <p className="text-gray-600">{owner.bio}</p>}
                  </div>
                </div>
              </section>
            )}
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
                  {rating > 0 && (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{rating.toFixed(1)}</span>
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
      </div>
    </Layout>
  );
};

export default VenueDetailPage;