// src/components/common/Pagination.tsx

/**
 * @file Pagination.tsx
 * @description Reusable pagination component
 */

import React from 'react';

interface PaginationProps {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether current page is the first page */
  isFirstPage: boolean;
  /** Whether current page is the last page */
  isLastPage: boolean;
  /** Handler for page change */
  onPageChange: (page: number) => void;
}

/**
 * Reusable pagination component for paginated content
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  isFirstPage,
  isLastPage,
  onPageChange
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-8 pb-8">
      <button
        onClick={() => onPageChange(1)}
        disabled={isFirstPage}
        className={`px-3 py-1 rounded ${
          isFirstPage 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-[#0081A7] text-white hover:bg-[#13262F]'
        }`}
      >
        First
      </button>
      
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        className={`px-3 py-1 rounded ${
          isFirstPage 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-[#0081A7] text-white hover:bg-[#13262F]'
        }`}
      >
        Previous
      </button>
      
      <div className="flex items-center">
        <span className="mx-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className={`px-3 py-1 rounded ${
          isLastPage 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-[#0081A7] text-white hover:bg-[#13262F]'
        }`}
      >
        Next
      </button>
      
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={isLastPage}
        className={`px-3 py-1 rounded ${
          isLastPage 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-[#0081A7] text-white hover:bg-[#13262F]'
        }`}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;