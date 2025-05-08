/* // src/pages/dashboard/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Venue } from '../../types/venue';
import { getVenues } from '../../api/venueService';
import { getUserBookings } from '../../api/bookingService';

const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const { favorites } = useFavorites();
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [savedVenues, setSavedVenues] = useState<Venue[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch user bookings for upcoming trips
        if (token) {
          const bookings = await getUserBookings(token);
          const now = new Date();
          
          // Filter for upcoming bookings (where check-in date is in the future)
          const upcoming = bookings.filter(booking => {
            const checkInDate = new Date(booking.dateFrom);
            return checkInDate > now;
          });
          
          setUpcomingTrips(upcoming.slice(0, 3)); // Show only the first 3
        }
        
        // Fetch all venues
        const allVenues = await getVenues();
        
        // Filter for saved venues based on favorites
        const favoriteVenues = allVenues.venues.filter(venue => 
          favorites.includes(venue.id)
        );
        setSavedVenues(favoriteVenues.slice(0, 3)); // Show only first 3
        
        // Get recently viewed venues from localStorage
        const recentlyViewedString = localStorage.getItem('recentlyViewed');
        console.log("DEBUG Dashboard: Recently viewed from localStorage:", recentlyViewedString);
        
        if (recentlyViewedString) {
          try {
            const recentlyViewedIds = JSON.parse(recentlyViewedString);
            console.log("DEBUG Dashboard: Recently viewed IDs:", recentlyViewedIds);
            
            if (Array.isArray(recentlyViewedIds) && recentlyViewedIds.length > 0) {
              // Filter venues to only include those in recently viewed list
              const recentVenues = allVenues.venues.filter(venue => 
                recentlyViewedIds.includes(venue.id)
              );
              console.log("DEBUG Dashboard: Recent venues found:", recentVenues.map(v => v.name));
              
              // Sort them according to the order in recentlyViewedIds
              const orderedRecentVenues = [];
              for (const id of recentlyViewedIds) {
                const venue = allVenues.venues.find(v => v.id === id);
                if (venue) {
                  orderedRecentVenues.push(venue);
                }
              }
              
              setRecentlyViewed(orderedRecentVenues.slice(0, 2));
            } else {
              // Fallback to random venues if recently viewed is empty
              console.log("DEBUG Dashboard: No recently viewed IDs found, using random venues");
              setRecentlyViewed(allVenues.venues.slice(3, 5));
            }
          } catch (error) {
            console.error('Error parsing recently viewed:', error);
            setRecentlyViewed(allVenues.venues.slice(3, 5));
          }
        } else {
          // No recently viewed in localStorage, use random venues
          console.log("DEBUG Dashboard: No recently viewed in localStorage, using random venues");
          setRecentlyViewed(allVenues.venues.slice(3, 5));
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [token, favorites]);

  // Venue card for displaying venues in saved and recently viewed sections
  const VenueCard = ({ venue }: { venue: Venue }) => (
    <div className="bg-[#F5F7DC] rounded-lg overflow-hidden shadow-sm">
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
            <button className="bg-[#0081A7] text-white text-xs px-3 py-1 rounded hover:bg-[#13262F]">
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
            <button className="bg-[#0081A7] text-white text-xs px-3 py-1 rounded hover:bg-[#13262F]">
              Details
            </button>
          </div>
        </div>
      </Link>
    </div>
  );

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
        </div>
    );
  }

  return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.name}</h1>
        <p className="text-gray-600 mb-8">Ready to plan your next adventure?</p>
        
       // {/* Upcoming Trips Section */
        //<section className="mb-10">
         // <h2 className="text-lg font-bold mb-4">Your Upcoming Trips</h2>
         // <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         //   {upcomingTrips.length > 0 ? (
          //    upcomingTrips.map((booking) => (
         //       <TripCard key={booking.id} booking={booking} />
          //    ))
          //  ) : (
         //     <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          //      <p className="text-gray-600 text-center">No upcoming trips. Time to plan your next getaway!</p>
           //     <div className="flex justify-center mt-2">
           //       <Link 
            //        to="/venues" 
                //    className="bg-[#0081A7] text-white text-sm px-4 py-2 rounded hover:bg-[#13262F]"
                //  >
                //    Explore Venues
                //  </Link>
               // </div>
            //  </div>
           // )}
         // </div>
       // </section>
        
       // {/* Places You've Saved Section */}
      //  <section className="mb-10">
      //    <h2 className="text-lg font-bold mb-4">Places You've Saved</h2>
      //    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       //     {savedVenues.length > 0 ? (
       //       savedVenues.map((venue) => (
        //        <VenueCard key={venue.id} venue={venue} />
         //     ))
         //   ) : (
         //     <div className="col-span-3 bg-[#F5F7DC] p-4 rounded-lg">
         //       <p className="text-gray-600 text-center">You haven't saved any places yet.</p>
          //    </div>
         //   )}
        //  </div>
       // </section>
        
     //   {/* Recently Viewed Section */}
       // <section>
       //   <h2 className="text-lg font-bold mb-4">Recently Viewed</h2>
      //    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       //     {recentlyViewed.length > 0 ? (
        //      recentlyViewed.map((venue) => (
        //        <VenueCard key={venue.id} venue={venue} />
          //    ))
          //  ) : (
           //   <div className="col-span-2 bg-[#F5F7DC] p-4 rounded-lg">
             //   <p className="text-gray-600 text-center">No recently viewed venues.</p>
            //  </div>
        //    )}
        //  </div>
       // </section>
      //</div>
 // );
//};

//export default DashboardPage;  */