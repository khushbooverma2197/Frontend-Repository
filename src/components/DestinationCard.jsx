import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isFavorite, addToFavorites, removeFromFavorites } from '../services/favoritesService';

export default function DestinationCard({ destination }) {
  const {
    id,
    name,
    country,
    description,
    images,
    avg_daily_cost,
    best_seasons,
    interests
  } = destination;

  const [imageError, setImageError] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(id));
  }, [id]);

  // Debug logging for image issues
  if (!images || images.length === 0) {
    console.warn(`No images for ${name}:`, destination);
  }

  // Use first image from images array
  const imageUrl = (images && images.length > 0) ? images[0] : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
  const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
  const bestTimeToVisit = best_seasons?.join(', ') || null;
  const popularActivities = interests || [];

  const handleImageError = () => {
    console.error('Image failed to load for', name, '- URL:', imageUrl);
    setImageError(true);
  };

  const toggleFavorite = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(id);
      setFavorite(false);
    } else {
      addToFavorites(destination);
      setFavorite(true);
    }
  };

  return (
    <Link to={`/destination/${id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={imageError ? fallbackImage : imageUrl}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          {/* Favourite button */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all
              ${favorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-400'}`}
            title={favorite ? 'Remove from favourites' : 'Add to favourites'}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {/* Price badge */}
          {avg_daily_cost && (
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
              <span className="text-xs font-bold text-blue-600">${Math.round(avg_daily_cost)}</span>
              <span className="text-xs text-gray-500">/day</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
              {name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {country}
            </p>
          </div>

          <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {popularActivities && popularActivities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {popularActivities.slice(0, 3).map((activity, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-md font-medium capitalize"
                >
                  {activity}
                </span>
              ))}
              {popularActivities.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-xs rounded-md">
                  +{popularActivities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
