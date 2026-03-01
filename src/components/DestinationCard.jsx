import { Link } from 'react-router-dom';
import { useState } from 'react';

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

  return (
    <Link to={`/destination/${id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gray-200">
          <img
            src={imageError ? fallbackImage : imageUrl}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                {name}
              </h3>
              <p className="text-sm text-gray-500">{country}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">from</p>
              <p className="text-lg font-bold text-blue-600">
                ${avg_daily_cost ? Math.round(avg_daily_cost) : 'N/A'}/day
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Best Time to Visit */}
          {bestTimeToVisit && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="capitalize">Best: {bestTimeToVisit}</span>
            </div>
          )}

          {/* Activities/Interests */}
          {popularActivities && popularActivities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {popularActivities.slice(0, 3).map((activity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize"
                >
                  {activity}
                </span>
              ))}
              {popularActivities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{popularActivities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
