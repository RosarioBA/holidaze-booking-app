// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVenues } from '../api/venueService';
import { Venue } from '../types/venue';
import VenueCard from '../components/venue/VenueCard';

/**
 * Homepage component that displays a hero search section,
 * featured venues, platform benefits, and a CTA for new hosts.
 */
const HomePage = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Fetches top-rated venues to display as featured on homepage.
   */
  useEffect(() => {
    const fetchFeaturedVenues = async () => {
      setIsLoading(true);

      try {
        const result = await getVenues(1, 3, 'rating', 'desc');

        if (result?.venues && Array.isArray(result.venues)) {
          setFeaturedVenues(result.venues.slice(0, 3));
        }
      } catch {
        // Optionally handle errors silently or with a fallback UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedVenues();
  }, []);

  /**
   * Handles search form submission.
   * Redirects to the venues listing with optional search query.
   * @param {React.FormEvent} e
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchLocation ? `?search=${encodeURIComponent(searchLocation)}` : '';
    navigate(`/venues${query}`);
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="bg-[#505E64] text-white py-16 rounded-t-lg">
        <div className="mx-auto px-2 sm:px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center font-averia">
            Find your perfect stay with Holidaze
          </h1>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-grow">
                <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2 tracking-wide">
                  Where do you want to go?
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Search locations or properties..."
                  className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-800 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 focus:outline-none"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full md:w-auto bg-primary text-white py-3 px-8 rounded font-medium tracking-wide hover:bg-primary-dark transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="bg-secondary py-16 px-2 sm:px-4">
        <div className="mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center font-averia">Featured Properties</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredVenues.length > 0 ? (
              featuredVenues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-600">No featured properties available at the moment.</p>
                <Link to="/venues" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded">
                  Browse All Venues
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Book With Holidaze Section */}
      <section className="py-16 px-2 sm:px-4 bg-white">
        <div className="mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center font-averia">Why Book With Holidaze</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Trusted Properties',
                description: 'All our listings are verified for quality and comfort.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ),
              },
              {
                title: 'Best Price Guarantee',
                description: 'We offer competitive prices with no hidden fees.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
              {
                title: 'Customer Support',
                description: '24/7 support for all your booking needs.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="font-bold mb-2 font-averia">{item.title}</h3>
                <p className="text-gray-600 font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 px-2 sm:px-4 rounded-b-lg">
        <div className="mx-auto text-center max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 font-averia">Own a Property? Become a Host Today!</h2>
          <p className="mb-6 font-light">List your property on Holidaze and start earning income.</p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Register as a Venue Manager
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
