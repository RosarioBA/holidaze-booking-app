// src/pages/venue/VenuesPage.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Venue, VenueFilters } from '../../types/venue';
import { getVenues, searchVenues, filterVenues } from '../../api/venueService';
import VenueCard from '../../components/venue/VenueCard';

const VenuesPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get('search') || '';

  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    isFirstPage: true,
    isLastPage: true
  });
  
  // Filter states
  const [search, setSearch] = useState(initialSearchQuery);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch venues on initial load
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const result = await getVenues(1, 100);
        setVenues(result.venues);
        setFilteredVenues(result.venues);
        setPagination({
          currentPage: result.meta.currentPage || 1,
          totalPages: result.meta.pageCount || 1,
          isFirstPage: result.meta.isFirstPage || true,
          isLastPage: result.meta.isLastPage || true
        });
        setError(null);
        
        // If there's an initial search query, immediately filter results
        if (initialSearchQuery) {
          handleSearchQuery(initialSearchQuery);
        }
      } catch (err) {
        console.error('Error fetching venues:', err);
        setError('Failed to load venues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [initialSearchQuery]);
  
  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchQuery(search);
  };
  
  const handleSearchQuery = async (query: string) => {
    if (!query.trim()) {
      setFilteredVenues(venues);
      return;
    }
    
    try {
      setLoading(true);
      
      // Try to use the API search endpoint first
      try {
        const searchResults = await searchVenues(query);
        setFilteredVenues(searchResults);
      } catch (searchError) {
        // Fallback to client-side filtering if API search fails
        console.warn('API search failed, falling back to client-side filtering:', searchError);
        const filteredResults = venues.filter(venue => {
          const searchLower = query.toLowerCase();
          return (
            venue.name.toLowerCase().includes(searchLower) ||
            venue.description.toLowerCase().includes(searchLower) ||
            (venue.location.city && venue.location.city.toLowerCase().includes(searchLower)) ||
            (venue.location.country && venue.location.country.toLowerCase().includes(searchLower))
          );
        });
        setFilteredVenues(filteredResults);
      }
    } catch (err) {
      console.error('Error during search:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply price and guest filters (client-side)
  const applyFilters = () => {
    const filters: VenueFilters = {};
    
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (guests) filters.maxGuests = parseInt(guests, 10);
    
    const filtered = filterVenues(filteredVenues, filters);
    setFilteredVenues(filtered);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setGuests('');
    setFilteredVenues(venues);
  };
  
  return (
    <div className="space-y-8">
      <section className="bg-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Explore Venues</h1>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search venues by name or location..."
                className="w-full p-3 rounded border border-gray-300 text-gray-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded font-medium"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <button 
              type="submit"
              className="md:w-auto bg-white hover:bg-gray-100 text-blue-600 py-3 px-6 rounded font-medium"
            >
              Search
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-blue-700 p-4 rounded grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium mb-1">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  id="minPrice"
                  placeholder="0"
                  className="w-full p-2 rounded border border-gray-300 text-gray-800"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="1000"
                  className="w-full p-2 rounded border border-gray-300 text-gray-800"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="guests" className="block text-sm font-medium mb-1">
                  Guests
                </label>
                <input
                  type="number"
                  id="guests"
                  placeholder="2"
                  className="w-full p-2 rounded border border-gray-300 text-gray-800"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  min="1"
                />
              </div>
              
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-transparent hover:bg-blue-800 text-white py-2 px-4 border border-white rounded mr-2"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="bg-white hover:bg-gray-100 text-blue-600 py-2 px-4 rounded"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </form>
      </section>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : filteredVenues.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No venues found matching your search</p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">{filteredVenues.length} venues found</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map(venue => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VenuesPage;