// src/components/venue/VenueCard.tsx
import { Link } from 'react-router-dom';
import { Venue } from '../../types/venue';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard = ({ venue }: VenueCardProps) => {
  const { id, name, media, price, location, maxGuests, rating = 0 } = venue;
  const { isAuthenticated } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  // Check if this venue is in favorites
  const favorite = isFavorite(id);
  
  // Get first image, or use placeholder if no images
  const imageUrl = media && media.length > 0 ? media[0].url : 'https://placehold.co/600x400?text=No+Image';
  const imageAlt = media && media.length > 0 ? media[0].alt : name;

  // Format location text
  const locationText = [
    location?.city,
    location?.country
  ].filter(Boolean).join(', ') || 'Location not specified';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to venue detail
    e.stopPropagation();
    
    if (favorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {isAuthenticated && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 z-10 bg-white bg-opacity-80 p-1 rounded-full"
          aria-label={favorite ? "Remove from saved" : "Save venue"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${favorite ? 'text-red-500' : 'text-gray-400'}`} 
            viewBox="0 0 20 20" 
            fill={favorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={favorite ? '0' : '1.5'}
          >
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      
      <Link to={`/venues/${id}`} className="block">
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
            <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-gray-600 text-sm mt-1">{locationText}</p>
          
          <div className="mt-2 flex flex-wrap gap-2">
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
            <p className="font-semibold">${price} <span className="text-gray-600 text-sm font-normal">/ night</span></p>
            <p className="text-gray-600 text-sm">Max guests: {maxGuests}</p>
          </div>
          
          <div className="mt-4 flex justify-end">
            <div className="bg-blue-600 text-white px-4 py-1 rounded text-sm">
              View
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VenueCard;