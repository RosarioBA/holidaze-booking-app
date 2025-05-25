/**
 * @file AmenityIcon.tsx
 * @description Component for displaying amenity icons with active/inactive states
 */

import React from 'react';

/**
 * Types of amenities that can be displayed with icons
 */
type AmenityType = 'wifi' | 'parking' | 'breakfast' | 'pets';

/**
 * Props for the AmenityIcon component
 */
interface AmenityIconProps {
  /** Type of amenity to display */
  type: AmenityType;
  /** Whether the amenity is active/available */
  active: boolean;
}

/**
 * Component that renders SVG icons for different venue amenities
 * Changes appearance based on whether the amenity is active
 * 
 * @param {AmenityIconProps} props - Component props
 * @returns {JSX.Element | null} SVG icon for the specified amenity or null if type is invalid
 */
const AmenityIcon: React.FC<AmenityIconProps> = ({ type, active }) => {
  // Use opacity to indicate inactive amenities
  const color = active ? 'currentColor' : 'currentColor opacity-50';
  
  // Return the appropriate icon based on the amenity type
  switch (type) {
    case 'wifi':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
          />
        </svg>
      );
    
    case 'parking':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      );
    
    case 'breakfast':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      );
    
    case 'pets':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      );
    
    default:
      return null;
  }
};

export default AmenityIcon;