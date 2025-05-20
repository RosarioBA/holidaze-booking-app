// src/components/venue/VenueLocation.tsx

/**
 * @file VenueLocation.tsx
 * @description Component displaying venue location details
 */

import React from 'react';

interface VenueLocationProps {
  /** Location information */
  location: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
}

/**
 * Component for displaying venue location information
 */
const VenueLocation: React.FC<VenueLocationProps> = ({ location }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 font-averia">Location</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium mb-2 font-averia">Address</h3>
        <p>
          {location.address && <span className="block">{location.address}</span>}
          {location.city && location.zip && <span className="block">{location.city}, {location.zip}</span>}
          {location.country && <span className="block">{location.country}</span>}
        </p>
        
        {/* If we had map integration, it would go here */}
        <div className="h-64 bg-gray-200 mt-4 rounded flex items-center justify-center">
          <p className="text-gray-500">Map view not available</p>
        </div>
      </div>
    </section>
  );
};

export default VenueLocation;