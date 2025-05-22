/**
 * @file VenuesGrid.tsx
 * @description Grid display for venue cards with filtering indicators
 */

import React from 'react';
import { Venue } from '../../types/venue';
import VenueCard from './VenueCard';

interface VenuesGridProps {
  /** Array of venues to display */
  venues: Venue[];
  /** Current page */
  currentPage: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Whether filters are currently active */
  hasActiveFilters: boolean;
  /** Function to clear all filters */
  onClearFilters: () => void;
  /** Optional source parameter to pass to venue cards */
  source?: string;
}

/**
 * Component for displaying a grid of venue cards with pagination info
 */
const VenuesGrid: React.FC<VenuesGridProps> = ({
  venues,
  currentPage,
  itemsPerPage,
  hasActiveFilters,
  onClearFilters,
  source
}) => {
  // Calculate which venues to show based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVenues = venues.slice(startIndex, endIndex);

  return (
    <div className="px-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-600 font-light">
            Showing {Math.min(startIndex + 1, venues.length)} - {Math.min(endIndex, venues.length)} of {venues.length} venues
          </p>
        </div>
       
        {/* Show active filters indicator */}
        {hasActiveFilters && (
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Filters active</span>
            <button 
              onClick={onClearFilters}
              className="text-[#0081A7] text-sm hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedVenues.map(venue => (
          <VenueCard key={venue.id} venue={venue} source={source} />
        ))}
      </div>
    </div>
  );
};

export default VenuesGrid;