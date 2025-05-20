// src/pages/venue/VenuesPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getVenues, searchVenues, filterVenues } from '../../api/venueService';
import VenueCard from '../../components/venue/VenueCard';
import { Venue, VenueFilters } from '../../types/venue';

const VenuesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get('search') || '';
  
  // Get page from URL query parameters, fixed limit to 12
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const ITEMS_PER_PAGE = 12; // Fixed limit of 12 items per page

  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    isFirstPage: initialPage === 1,
    isLastPage: true
  });
  
  // Filter states
  const [search, setSearch] = useState(initialSearchQuery);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // State to track if filters are applied
  const [activeFilters, setActiveFilters] = useState<VenueFilters>({});
  const [searchResults, setSearchResults] = useState<Venue[]>([]);
  
  // Fetch venues on initial load or when pagination changes
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const result = await getVenues(pagination.currentPage, ITEMS_PER_PAGE);
        
        // Extract venues from the result based on its structure
        let venuesList: Venue[] = [];
        
        if (result && typeof result === 'object' && 'venues' in result && Array.isArray(result.venues)) {
          venuesList = result.venues;
        } else if (Array.isArray(result)) {
          venuesList = result;
        }
        
        // Process venues to ensure they have all required properties
        const processedVenues = venuesList.map(venue => ({
          ...venue,
          media: venue.media || [],
          location: venue.location || {},
          meta: venue.meta || {}
        }));
        
        setVenues(processedVenues);
        setFilteredVenues(processedVenues);
        setSearchResults(processedVenues); // Initialize search results with all venues
        
        // Set pagination data if available
        if (result && typeof result === 'object' && 'meta' in result && result.meta) {
          setPagination({
            currentPage: result.meta.currentPage || pagination.currentPage,
            totalPages: result.meta.pageCount || 1,
            isFirstPage: result.meta.isFirstPage || (result.meta.currentPage === 1),
            isLastPage: result.meta.isLastPage || (result.meta.currentPage === result.meta.pageCount)
          });
        }
        
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
  }, [initialSearchQuery, pagination.currentPage]);
  
  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchQuery(search);
  };
  
  const handleSearchQuery = async (query: string) => {
    if (!query.trim()) {
      // When clearing search, reset to first page
      const params = new URLSearchParams(location.search);
      params.delete('search');
      params.set('page', '1');
      navigate(`${location.pathname}?${params.toString()}`);
      
      setSearchResults(venues);
      
      // Apply any active filters to the full venue list
      if (Object.keys(activeFilters).length > 0) {
        const newFilteredVenues = filterVenues(venues, activeFilters);
        setFilteredVenues(newFilteredVenues);
      } else {
        setFilteredVenues(venues);
      }
      
      // Reset to first page
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        isFirstPage: true,
        isLastPage: prev.totalPages <= 1
      }));
      
      return;
    }
    
    try {
      setLoading(true);
      
      // Update URL with search query and reset to page 1
      const params = new URLSearchParams(location.search);
      params.set('search', query);
      params.set('page', '1');
      navigate(`${location.pathname}?${params.toString()}`);
      
      // Try to use the API search endpoint first
      try {
        // Fetch search results
        const searchResultsArray = await searchVenues(query);
        
        // Ensure each venue has the minimal required properties
        const processedResults = searchResultsArray.map(venue => ({
          ...venue,
          media: venue.media || [],
          location: venue.location || {},
          meta: venue.meta || {}
        }));
        
        setSearchResults(processedResults);
        
        // Apply any active filters to the search results
        if (Object.keys(activeFilters).length > 0) {
          const filteredSearchResults = filterVenues(processedResults, activeFilters);
          setFilteredVenues(filteredSearchResults);
        } else {
          setFilteredVenues(processedResults);
        }
        
        // Reset to first page
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          isFirstPage: true,
          isLastPage: Math.ceil(processedResults.length / ITEMS_PER_PAGE) <= 1
        }));
      } catch (searchError) {
        // Fallback to client-side filtering if API search fails
        console.warn('API search failed, falling back to client-side filtering:', searchError);
        const clientSearchResults = venues.filter(venue => {
          const searchLower = query.toLowerCase();
          return (
            venue.name.toLowerCase().includes(searchLower) ||
            venue.description.toLowerCase().includes(searchLower) ||
            (venue.location?.city && venue.location.city.toLowerCase().includes(searchLower)) ||
            (venue.location?.country && venue.location.country.toLowerCase().includes(searchLower))
          );
        });
        
        setSearchResults(clientSearchResults);
        
        // Apply any active filters to the client-side search results
        if (Object.keys(activeFilters).length > 0) {
          const filteredClientResults = filterVenues(clientSearchResults, activeFilters);
          setFilteredVenues(filteredClientResults);
        } else {
          setFilteredVenues(clientSearchResults);
        }
        
        // Reset to first page
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          isFirstPage: true,
          isLastPage: Math.ceil(clientSearchResults.length / ITEMS_PER_PAGE) <= 1
        }));
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
    // Build filters object
    const filters: VenueFilters = {};
    
    if (minPrice && !isNaN(parseFloat(minPrice))) {
      filters.minPrice = parseFloat(minPrice);
    }
    
    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      filters.maxPrice = parseFloat(maxPrice);
    }
    
    if (guests && !isNaN(parseInt(guests, 10))) {
      filters.maxGuests = parseInt(guests, 10);
    }
    
    console.log("Applying filters:", filters);
    
    // Save active filters
    setActiveFilters(filters);
    
    // Apply filters to current search results, not all venues
    const filtered = filterVenues(searchResults, filters);
    console.log("Filtered results:", filtered.length);
    setFilteredVenues(filtered);
    
    // Reset to first page when filters change
    const params = new URLSearchParams(location.search);
    params.set('page', '1');
    navigate(`${location.pathname}?${params.toString()}`);
    
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      isFirstPage: true,
      isLastPage: Math.ceil(filtered.length / ITEMS_PER_PAGE) <= 1
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setGuests('');
    setActiveFilters({});
    
    // Reset to search results or all venues if no search
    setFilteredVenues(searchResults);
    
    // Reset to first page when clearing filters
    const params = new URLSearchParams(location.search);
    params.set('page', '1');
    navigate(`${location.pathname}?${params.toString()}`);
    
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      isFirstPage: true,
      isLastPage: Math.ceil(searchResults.length / ITEMS_PER_PAGE) <= 1
    }));
  };
  
  // Reset everything
  const resetAll = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setGuests('');
    setActiveFilters({});
    setSearchResults(venues);
    setFilteredVenues(venues);
    
    // Reset page to 1 and clear search params
    const params = new URLSearchParams();
    params.set('page', '1');
    navigate(`${location.pathname}?${params.toString()}`);
    
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      isFirstPage: true,
      isLastPage: Math.ceil(venues.length / ITEMS_PER_PAGE) <= 1
    }));
  };
  
  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    // Update URL with new page
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate(`${location.pathname}?${params.toString()}`);
    
    // Update pagination state
    setPagination(prev => ({
      ...prev,
      currentPage: newPage,
      isFirstPage: newPage === 1,
      isLastPage: newPage === pagination.totalPages
    }));
  };
  
  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-8"> {/* Added padding here */}
      <section className="bg-[#0081A7] text-white p-6 rounded-lg">
       <h1 className="text-3xl font-bold mb-6 font-averia">Explore Venues</h1>
        
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
              className="md:w-auto bg-[#13262F] hover:bg-opacity-90 text-white py-3 px-6 rounded font-medium tracking-wide"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <button 
              type="submit"
              className="md:w-auto bg-white hover:bg-gray-100 text-[#0081A7] py-3 px-6 rounded font-medium tracking-wide"
            >
              Search
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-[#13262F] p-4 rounded grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
              <label htmlFor="minPrice" className="block text-sm font-medium mb-1 tracking-wide">
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
              <label htmlFor="maxPrice" className="block text-sm font-medium mb-1 tracking-wide">
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
              <label htmlFor="guests" className="block text-sm font-medium mb-1 tracking-wide">
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
                  className="bg-transparent hover:bg-[#13262F] text-white py-2 px-4 border border-white rounded mr-2"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="bg-white hover:bg-gray-100 text-[#0081A7] py-2 px-4 rounded"
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0081A7]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : filteredVenues.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 font-light tracking-wide">No venues found matching your criteria</p>
          <button
            onClick={resetAll}
            className="mt-4 bg-[#0081A7] text-white py-2 px-4 rounded hover:bg-[#13262F]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="px-2"> {/* Added padding here too */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600 font-light">
                Showing {Math.min((pagination.currentPage - 1) * ITEMS_PER_PAGE + 1, filteredVenues.length)} - {Math.min(pagination.currentPage * ITEMS_PER_PAGE, filteredVenues.length)} of {filteredVenues.length} venues
              </p>
            </div>
           
            {/* Show active filters indicator */}
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Filters active</span>
                <button 
                  onClick={clearFilters}
                  className="text-[#0081A7] text-sm hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map(venue => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
          
          {/* Pagination controls without page size selector */}
          <div className="flex justify-center items-center space-x-4 mt-8 pb-8">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.isFirstPage}
              className={`px-3 py-1 rounded ${
                pagination.isFirstPage 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#0081A7] text-white hover:bg-[#13262F]'
              }`}
            >
              First
            </button>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.isFirstPage}
              className={`px-3 py-1 rounded ${
                pagination.isFirstPage 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#0081A7] text-white hover:bg-[#13262F]'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center">
              <span className="mx-2 text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.isLastPage}
              className={`px-3 py-1 rounded ${
                pagination.isLastPage 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#0081A7] text-white hover:bg-[#13262F]'
              }`}
            >
              Next
            </button>
            
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.isLastPage}
              className={`px-3 py-1 rounded ${
                pagination.isLastPage 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#0081A7] text-white hover:bg-[#13262F]'
              }`}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenuesPage;