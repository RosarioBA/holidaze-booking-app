/**
 * @file VenuesPage.tsx
 * @description Page for browsing, searching and filtering venues
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getVenues, searchVenues, filterVenues } from '../../api/venueService';
import { Venue, VenueFilters } from '../../types/venue';

// Components
import VenueSearch from '../../components/venue/VenueSearch';
import VenuesGrid from '../../components/venue/VenuesGrid';
import Pagination from '../../components/common/Pagination';

/**
 * Page component for browsing, searching and filtering venues
 * 
 * @returns {JSX.Element} Rendered component
 */
const VenuesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get('search') || '';
  
  // Get page from URL query parameters, fixed limit to 12
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const ITEMS_PER_PAGE = 12; // Fixed limit of 12 items per page

  // State for venues data
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
  
  // Search and filter state
  const [search, setSearch] = useState(initialSearchQuery);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<VenueFilters>({});
  const [searchResults, setSearchResults] = useState<Venue[]>([]);
  
  // Flag to prevent infinite loading
  const [dataInitialized, setDataInitialized] = useState(false);
  
  /**
   * Fetches venues from API
   */
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
        
        // Only update filtered venues and search results if not already initialized
        if (!dataInitialized) {
          setFilteredVenues(processedVenues);
          setSearchResults(processedVenues);
        }
        
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
        
        // If this is initial load and we have search query, run search
        if (!dataInitialized && initialSearchQuery) {
          // Mark as initialized to prevent infinite loop
          setDataInitialized(true);
          
          // Run the search query (outside useEffect to avoid loop)
          setTimeout(() => {
            handleSearchQuery(initialSearchQuery);
          }, 0);
        } else {
          // Just mark as initialized
          setDataInitialized(true);
        }
      } catch (err) {
        setError('Failed to load venues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [initialPage]);
  
  /**
   * Handles search form submission
   * 
   * @param {React.FormEvent} e - Form event
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchQuery(search);
  };
  
  /**
   * Processes a search query
   * 
   * @param {string} query - Search query text
   */
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
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Applies price and guest filters
   */
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
    
    // Save active filters
    setActiveFilters(filters);
    
    // Apply filters to current search results, not all venues
    const filtered = filterVenues(searchResults, filters);
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
  
  /**
   * Clears all filters
   */
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
  
  /**
   * Resets all search and filter settings
   */
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
  
  /**
   * Handles page change
   * 
   * @param {number} newPage - New page number
   */
  const handlePageChange = (newPage: number) => {
    // Update URL with new page
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate(`${location.pathname}?${params.toString()}`);
    
    // Update pagination state - this should trigger the useEffect
    setPagination(prev => ({
      ...prev,
      currentPage: newPage,
      isFirstPage: newPage === 1,
      isLastPage: newPage === prev.totalPages
    }));
  };
  return (
    <div className="space-y-8">
      {/* Search and Filter Form */}
      <div className="px-2">
      <VenueSearch
        searchValue={search}
        minPrice={minPrice}
        maxPrice={maxPrice}
        guests={guests}
        showFilters={showFilters}
        onSearchChange={setSearch}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onGuestsChange={setGuests}
        onSearch={handleSearch}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />
      </div>
      <div className="px-4 md:px-6 lg:px-8">
      {/* Filters Button */}
      {/* Loading, Error and Empty States */}
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
        <>
          {/* Venues Grid */}
          <VenuesGrid
          venues={filteredVenues}
          currentPage={pagination.currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          hasActiveFilters={Object.keys(activeFilters).length > 0}
          onClearFilters={clearFilters}
          source={search ? `search&searchQuery=${encodeURIComponent(search)}` : 'venues'}
        />
                  
          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            isFirstPage={pagination.isFirstPage}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
    </div>
  );
};

export default VenuesPage;