// src/components/booking/BookingFilters.tsx

/**
 * @file BookingFilters.tsx
 * @description Filter tabs for the bookings page
 */

import React from 'react';

interface BookingFiltersProps {
  activeFilter: 'all' | 'upcoming' | 'past';
  onChange: (filter: 'all' | 'upcoming' | 'past') => void;
}

/**
 * Component for filtering bookings by status
 */
const BookingFilters: React.FC<BookingFiltersProps> = ({ activeFilter, onChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-8">
        <button
          onClick={() => onChange('all')}
          className={`pb-4 font-medium text-sm ${
            activeFilter === 'all'
              ? 'border-b-2 border-[#0081A7] text-[#0081A7]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Trips
        </button>
        <button
          onClick={() => onChange('upcoming')}
          className={`pb-4 font-medium text-sm ${
            activeFilter === 'upcoming'
              ? 'border-b-2 border-[#0081A7] text-[#0081A7]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => onChange('past')}
          className={`pb-4 font-medium text-sm ${
            activeFilter === 'past'
              ? 'border-b-2 border-[#0081A7] text-[#0081A7]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past Trips
        </button>
      </div>
    </div>
  );
};

export default BookingFilters;