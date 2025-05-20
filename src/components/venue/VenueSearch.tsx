// src/components/venue/VenueSearch.tsx

/**
 * @file VenueSearch.tsx
 * @description Search and filter form for venues
 */

import React, { useState } from 'react';
import { VenueFilters } from '../../types/venue';

interface VenueSearchProps {
  /** Current search query */
  searchValue: string;
  /** Minimum price filter value */
  minPrice: string;
  /** Maximum price filter value */
  maxPrice: string;
  /** Number of guests filter value */
  guests: string;
  /** Whether filters are currently visible */
  showFilters: boolean;
  /** Handler for search query change */
  onSearchChange: (value: string) => void;
  /** Handler for min price change */
  onMinPriceChange: (value: string) => void;
  /** Handler for max price change */
  onMaxPriceChange: (value: string) => void;
  /** Handler for guests change */
  onGuestsChange: (value: string) => void;
  /** Handler for search form submission */
  onSearch: (e: React.FormEvent) => void;
  /** Handler for toggling filter visibility */
  onToggleFilters: () => void;
  /** Handler for applying filters */
  onApplyFilters: () => void;
  /** Handler for clearing filters */
  onClearFilters: () => void;
}

/**
 * Search and filter form component for venues
 */
const VenueSearch: React.FC<VenueSearchProps> = ({
  searchValue,
  minPrice,
  maxPrice,
  guests,
  showFilters,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onGuestsChange,
  onSearch,
  onToggleFilters,
  onApplyFilters,
  onClearFilters
}) => {
  return (
    <section className="bg-[#0081A7] text-white p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 font-averia">Explore Venues</h1>
      
      <form onSubmit={onSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search venues by name or location..."
              className="w-full p-3 rounded border border-gray-300 text-gray-800"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <button 
            type="button"
            onClick={onToggleFilters}
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
                onChange={(e) => onMinPriceChange(e.target.value)}
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
                onChange={(e) => onMaxPriceChange(e.target.value)}
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
                onChange={(e) => onGuestsChange(e.target.value)}
                min="1"
              />
            </div>
            
            <div className="md:col-span-3 flex justify-end">
              <button
                type="button"
                onClick={onClearFilters}
                className="bg-transparent hover:bg-[#13262F] text-white py-2 px-4 border border-white rounded mr-2"
              >
                Clear Filters
              </button>
              <button
                type="button"
                onClick={onApplyFilters}
                className="bg-white hover:bg-gray-100 text-[#0081A7] py-2 px-4 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default VenueSearch;