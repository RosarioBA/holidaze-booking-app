/**
 * @file VenueCard.tsx
 * @description Card component for displaying venue information in a grid or list
 */

import { Link, useLocation } from 'react-router-dom';
import { Venue } from '../../types/venue';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { getVenueRatingInfo } from '../../api/ratingService';

/**
 * Props for the VenueCard component
 */
interface VenueCardProps {
  /** Venue data to display in the card */
  venue: Venue;
  /** Optional source parameter to add to the venue detail link */
  source?: string;
}

/**
 * Card component that displays venue information in a compact format
 * Includes image, name, location, amenities, price, and favorite functionality
 * 
 * @param {VenueCardProps} props - Component props
 * @returns {JSX.Element} Rendered venue card
 */
const VenueCard: React.FC<VenueCardProps> = ({ venue, source }) => {
  const { id, name, media, price, location, maxGuests } = venue;
  const { isAuthenticated } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { rating, count } = getVenueRatingInfo(id);
  const currentLocation = useLocation();
  
  // Check if this venue is favorited
  const isFavorited = isFavorite(id);
  
  /**
   * Determines the appropriate source parameter based on current location or prop
   */
  const getSourceParam = () => {
    if (source) return source;
    
    const pathname = currentLocation.pathname;
    const searchParams = new URLSearchParams(currentLocation.search);
    const hasSearch = searchParams.get('search');
    
    // Determine source based on current location
    if (pathname.includes('/customer/saved')) {
      return 'saved';
    } else if (pathname.includes('/venue-manager/venues')) {
      return 'manager-venues';
    } else if (pathname.includes('/customer/trips')) {
      return 'my-trips';
    } else if (pathname.includes('/dashboard')) {
      return 'dashboard';
    } else if (pathname.includes('/venues') && hasSearch) {
      return `search&searchQuery=${encodeURIComponent(hasSearch)}`;
    } else if (pathname.includes('/venues')) {
      return 'venues';
    }
    
    return 'venues'; // Default fallback
  };
  
  /**
   * Get the primary image URL or use a placeholder if none exists
   */
  const imageUrl = media && media.length > 0 ? media[0].url : 'https://placehold.co/600x400?text=No+Image';
  const imageAlt = media && media.length > 0 ? media[0].alt || `${name} image` : `${name} (no image available)`;

  /**
   * Format location text from city and country fields
   */
  const locationText = [
    location?.city,
    location?.country
  ].filter(Boolean).join(', ') || 'Location not specified';

  /**
   * Handles the favorite/unfavorite button click
   * 
   * @param {React.MouseEvent} e - Click event
   */
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    if (isFavorited) {
      await removeFavorite(id);
    } else {
      await addFavorite(id);
    }
  };

  // Build the venue detail link with source parameter
  const venueDetailLink = `/venues/${id}?source=${getSourceParam()}`;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {isAuthenticated && (
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 z-10 bg-white bg-opacity-80 p-1.5 rounded-full shadow-sm hover:bg-opacity-100"
          aria-label={isFavorited ? `Remove ${name} from saved venues` : `Save ${name} to your favorites`}
          type="button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${isFavorited ? 'text-red-500' : 'text-gray-400'}`} 
            viewBox="0 0 20 20" 
            fill={isFavorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavorited ? '0' : '1.5'}
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      
      <Link to={venueDetailLink} className="block" aria-label={`View details for ${name}, ${locationText}, $${price} per night`}>
        <div className="h-48 overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={imageAlt} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/600x400?text=No+Image';
            }}
          />
          {rating > 0 && (
            <div 
              className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center"
              aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars${count > 0 ? `, ${count} reviews` : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              {count > 0 && <span className="text-xs text-gray-500 ml-1">({count})</span>}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg font-averia">{name}</h3>
          <p className="text-gray-600 text-sm mt-1">{locationText}</p>
                  
          <div className="mt-2 flex flex-wrap gap-2" aria-label="Amenities">
            {venue.meta?.wifi && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                WiFi
              </span>
            )}
            {venue.meta?.parking && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                Parking
              </span>
            )}
            {venue.meta?.breakfast && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                Breakfast
              </span>
            )}
            {venue.meta?.pets && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                Pets allowed
              </span>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="font-semibold">
              <span className="sr-only">Price:</span>
              ${price} <span className="text-gray-600 text-sm font-normal">/ night</span>
            </p>
            <p className="text-gray-600 text-sm">
              <span className="sr-only">Capacity:</span>
              Max guests: {maxGuests}
            </p>
          </div>
          
          <div className="mt-4 flex justify-end">
           <div className="bg-primary text-white px-4 py-1 rounded text-sm hover:bg-primary-dark transition-colors">
              View
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default VenueCard;