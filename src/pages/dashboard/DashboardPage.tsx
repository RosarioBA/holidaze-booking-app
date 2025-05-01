// src/pages/dashboard/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedLayout from '../../components/layout/AuthenticatedLayout';
import { Venue } from '../../types/venue';
import { getVenues } from '../../api/venueService';
import { getUserBookings } from '../../api/bookingService';

const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [savedVenues, setSavedVenues] = useState<Venue[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Placeholder data - in a real app, you would fetch from your API
        if (token) {
          // Fetch user bookings for upcoming trips
          const bookings = await getUserBookings(token);
          const now = new Date();
          
          // Filter for upcoming bookings (where check-in date is in the future)
          const upcoming = bookings.filter(booking => {
            const checkInDate = new Date(booking.dateFrom);
            return checkInDate > now;
          });
          
          setUpcomingTrips(upcoming.slice(0, 3)); // Show only the first 3
        }
        
        // For demo purposes, fetch some venues and use them as saved/recently viewed
        const allVenues = await getVenues();
        
        // In a real app, you'd fetch actual saved venues from your API
        setSavedVenues(allVenues.venues.slice(0, 3));
        
        // In a real app, you'd fetch actual recently viewed venues from local storage or API
        setRecentlyViewed(allVenues.venues.slice(3, 5));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [token]);

  // Venue card for displaying venues in saved and recently viewed sections
  const VenueCard = ({ venue }: { venue: Venue }) => (
    <div className="bg-yellow-50 rounded-lg overflow-hidden shadow-sm">
      <Link to={`/venues/${venue.id}`}>
        <div className="h-32 bg-gray-200">
          {venue.media && venue.media.length > 0 && (
            <img 
              src={venue.media[0].url} 
              alt={venue.name}
              className="w-full h-full object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400?text=No+Image';
              }}
            />
          )}
        </div>
        <div className="p-3">
          <h3 className="font-bold text-sm">{venue.name}</h3>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-600">
              ${venue.price} / night
            </p>
            <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded">
              View
            </button>
          </div>
        </div>
      </Link>
    </div>
  );

  // Trip card for displaying upcoming bookings
  const TripCard = ({ booking }: { booking: any }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <Link to={`/bookings/${booking.id}`}>
        <div className="p-3">
          <h3 className="font-bold text-sm">{booking.venue?.name || 'Venue'}</h3>
          <p className="text-xs text-gray-600">
            {new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}
          </p>
          <div className="flex justify-end mt-1">
            <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded">
              Details
            </button>
          </div>
        </div>
      </Link>
    </div>
  );

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.name}</h1>
        <p className="text-gray-600 mb-8">Ready to plan your next adventure?</p>
        
        {/* Upcoming Trips Section */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4">Your Upcoming Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map((booking) => (
                <TripCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600 text-center">No upcoming trips. Time to plan your next getaway!</p>
                <div className="flex justify-center mt-2">
                  <Link 
                    to="/venues" 
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded"
                  >
                    Explore Venues
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Places You've Saved Section */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4">Places You've Saved</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedVenues.length > 0 ? (
              savedVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))
            ) : (
              <div className="col-span-3 bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-600 text-center">You haven't saved any places yet.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Recently Viewed Section */}
        <section>
          <h2 className="text-lg font-bold mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentlyViewed.length > 0 ? (
              recentlyViewed.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))
            ) : (
              <div className="col-span-2 bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-600 text-center">No recently viewed venues.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
  );
};

export default DashboardPage;