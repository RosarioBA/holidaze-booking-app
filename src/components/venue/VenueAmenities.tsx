// src/components/venue/VenueAmenities.tsx

/**
 * @file VenueAmenities.tsx
 * @description Component displaying venue amenities
 */

import React from 'react';
import AmenityIcon from './AmenityIcon';

interface VenueAmenitiesProps {
  /** Meta information containing amenity flags */
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
}

/**
 * Component for displaying available amenities at a venue
 */
const VenueAmenities: React.FC<VenueAmenitiesProps> = ({ meta }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 font-averia">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`flex items-center ${meta?.wifi ? 'text-gray-800' : 'text-gray-400'}`}>
          <AmenityIcon type="wifi" active={meta?.wifi || false} />
          <span className="ml-2">WiFi</span>
        </div>
        <div className={`flex items-center ${(meta?.parking ?? false) ? 'text-gray-800' : 'text-gray-400'}`}>
          <AmenityIcon type="parking" active={meta?.parking ?? false} />
          <span className="ml-2">Parking</span>
        </div>
        <div className={`flex items-center ${(meta?.breakfast ?? false) ? 'text-gray-800' : 'text-gray-400'}`}>
          <AmenityIcon type="breakfast" active={meta?.breakfast ?? false} />
          <span className="ml-2">Breakfast</span>
        </div>
        <div className={`flex items-center ${(meta?.pets ?? false) ? 'text-gray-800' : 'text-gray-400'}`}>
          <AmenityIcon type="pets" active={meta?.pets ?? false} />
          <span className="ml-2">Pets Allowed</span>
        </div>
      </div>
    </section>
  );
};

export default VenueAmenities;