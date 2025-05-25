// src/components/venue/VenueHost.tsx

/**
 * @file VenueHost.tsx
 * @description Component displaying venue host information
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { getUserAvatar } from '../../utils/avatarUtils';

interface VenueHostProps {
  /** Host information */
  owner: {
    name: string;
    email?: string;
    avatar?: {
      url: string;
      alt?: string;
    };
    bio?: string;
  };
}

/**
 * Component for displaying information about the venue host
 */
const VenueHost: React.FC<VenueHostProps> = ({ owner }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 font-averia">
        Hosted by{' '}
        <Link to={`/profiles/${owner.name}`} className="text-[#0081A7] hover:underline">
          {owner.name}
        </Link>
      </h2>
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
          {/* Check for avatar in localStorage first */}
          {owner.name && getUserAvatar(owner.name) ? (
            <img 
              src={getUserAvatar(owner.name)} 
              alt={`${owner.name}'s avatar`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/200x200?text=Host';
              }}
            />
          ) : owner.avatar ? (
            <img 
              src={owner.avatar.url} 
              alt={owner.avatar.alt || `${owner.name}'s avatar`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/200x200?text=Host';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg font-averia">
            <Link to={`/profiles/${owner.name}`} className="text-[#0081A7] hover:underline">
              {owner.name}
            </Link>
          </h3>
          {owner.bio && <p className="text-gray-600">{owner.bio}</p>}
        </div>
      </div>
    </section>
  );
};

export default VenueHost;