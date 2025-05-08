// src/pages/venue-manager/VenueManagerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Venue } from '../../types/venue';
// Import your API functions as needed

const VenueManagerDashboard: React.FC = () => {
  // IMPORTANT: This should be false in production!
  const forceVenueManager = false; 
  
  const navigate = useNavigate();
  const { user, token, isVenueManager } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Use the actual isVenueManager value from auth context, with option to force for testing
  const isUserVenueManager = isVenueManager || forceVenueManager;
  
  console.log("VenueManagerDashboard - isVenueManager from context:", isVenueManager);
  console.log("VenueManagerDashboard - forceVenueManager:", forceVenueManager);
  console.log("VenueManagerDashboard - isUserVenueManager:", isUserVenueManager);
  console.log("VenueManagerDashboard - venueManager from user:", user?.venueManager);

  // Calculate stats
  const totalVenues = venues.length;
  const totalBookings = bookings.length;
  const averageRating = venues.length > 0 
    ? venues.reduce((sum, venue) => sum + (venue.rating || 0), 0) / venues.length
    : 0;
  const totalRevenue = bookings.reduce((sum, booking) => {
    const venue = venues.find(v => v.id === booking.venue?.id);
    if (!venue) return sum;
    
    // Calculate number of days
    const from = new Date(booking.dateFrom);
    const to = new Date(booking.dateTo);
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 3600 * 24));
    
    return sum + (venue.price * days);
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }
      
      if (!isUserVenueManager) {
        console.log("User is not a venue manager, skipping data fetch");
        return; // Don't fetch data if not a venue manager
      }
      
      setIsLoading(true);
      try {
        console.log("Fetching venues for user:", user?.name);
        
        // Fetch venues managed by this user
        const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${user?.name}/venues`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch venues: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const userVenues = data.data || [];
        
        console.log(`Found ${userVenues.length} venues for user ${user?.name}`);
        setVenues(userVenues);
        
        // Fetch bookings for all managed venues
        const allBookings: any[] = [];
        for (const venue of userVenues) {
          try {
            console.log(`Fetching bookings for venue ${venue.id}`);
            
            const bookingsResponse = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${venue.id}?_bookings=true`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (!bookingsResponse.ok) {
              console.error(`Failed to fetch bookings for venue ${venue.id}: ${bookingsResponse.status}`);
              continue;
            }
            
            const bookingsData = await bookingsResponse.json();
            
            if (bookingsData.data?.bookings) {
              console.log(`Found ${bookingsData.data.bookings.length} bookings for venue ${venue.id}`);
              allBookings.push(...bookingsData.data.bookings);
            }
          } catch (err) {
            console.error(`Error fetching bookings for venue ${venue.id}:`, err);
          }
        }
        
        setBookings(allBookings);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching venue manager data:', err);
        setError(err.message || 'Failed to load your venues. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, isUserVenueManager, user?.name, navigate]);

  const handleDeleteVenue = async (venueId: string) => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${venueId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete venue: ${response.status}`);
      }
      
      // Remove the venue from state
      setVenues(prevVenues => prevVenues.filter(venue => venue.id !== venueId));
      
      // Also remove any bookings for this venue
      setBookings(prevBookings => prevBookings.filter(booking => booking.venue?.id !== venueId));
      
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting venue:', err);
      setError(err.message || 'Failed to delete venue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect non-venue managers to become venue managers
  if (!isUserVenueManager) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">You need to be a venue manager to access this page.</p>
          <p className="mt-2">Would you like to become a venue manager?</p>
        </div>
        <Link 
          to="/settings" 
          className="inline-block bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
        >
          Become a Venue Manager
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.name}</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Total Venues</p>
          <p className="text-2xl font-bold">{totalVenues}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold">{totalBookings}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Revenue</p>
          <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} NOK</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Average Rating</p>
          <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0081A7]"></div>
        </div>
      ) : (
        <>
          {/* My Venues Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Venues</h2>
              <Link 
                to="/venue-manager/create" 
                className="bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
              >
                Create New Venue
              </Link>
            </div>
            
            {venues.length === 0 ? (
              <div className="bg-[#F5F7DC] p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">You haven't created any venues yet.</p>
                <Link 
                  to="/venue-manager/create" 
                  className="inline-block bg-[#0081A7] text-white px-4 py-2 rounded hover:bg-[#13262F]"
                >
                  Create Your First Venue
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {venues.map(venue => (
                  <div key={venue.id} className="bg-[#F5F7DC] p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{venue.name}</h3>
                        <p className="text-sm text-gray-600">${venue.price}/night • Max guests: {venue.maxGuests}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link 
                          to={`/venues/${venue.id}`} 
                          className="bg-[#0081A7] text-white text-sm px-3 py-1 rounded hover:bg-[#13262F]"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/venue-manager/edit/${venue.id}`} 
                          className="bg-[#0081A7] text-white text-sm px-3 py-1 rounded hover:bg-[#13262F]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(venue.id)}
                          className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {/* Delete confirmation */}
                    {deleteConfirm === venue.id && (
                      <div className="mt-4 bg-red-50 p-3 rounded border border-red-200">
                        <p className="text-red-700 mb-2">Are you sure you want to delete this venue? This action cannot be undone.</p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleDeleteVenue(venue.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
          
          {/* Upcoming Bookings Section */}
          <section>
            <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
            
            {bookings.length === 0 ? (
              <div className="bg-[#F5F7DC] p-6 rounded-lg text-center">
                <p className="text-gray-600">No upcoming bookings for your venues yet.</p>
              </div>
            ) : (
              <div className="bg-[#F5F7DC] p-4 rounded-lg overflow-x-auto">
                <table className="w-full">
                  <thead className="text-left">
                    <tr>
                      <th className="pb-2 text-sm font-medium text-gray-500">Venue</th>
                      <th className="pb-2 text-sm font-medium text-gray-500">Guest</th>
                      <th className="pb-2 text-sm font-medium text-gray-500">Check-in</th>
                      <th className="pb-2 text-sm font-medium text-gray-500">Check-out</th>
                      <th className="pb-2 text-sm font-medium text-gray-500">Guests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => {
                      const venue = venues.find(v => v.id === booking.venue?.id);
                      return (
                        <tr key={booking.id} className="border-t border-gray-200">
                          <td className="py-3">{venue?.name || 'Unknown Venue'}</td>
                          <td className="py-3">{booking.customer?.name || 'Unknown Guest'}</td>
                          <td className="py-3">{new Date(booking.dateFrom).toLocaleDateString()}</td>
                          <td className="py-3">{new Date(booking.dateTo).toLocaleDateString()}</td>
                          <td className="py-3">{booking.guests}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default VenueManagerDashboard;