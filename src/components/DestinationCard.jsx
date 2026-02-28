import { Link } from 'react-router-dom';

export default function DestinationCard({ destination }) {
  const {
    id,
    name,
    country,
    description,
    imageUrl,
    averageCost,
    bestTimeToVisit,
    popularActivities,
    averageRating
  } = destination;

  return (
    <Link to={`/destination/${id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {averageRating && (
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
            </div>
          )}
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
                ${averageCost?.toLocaleString() || 'N/A'}
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
              <span>Best: {bestTimeToVisit}</span>
            </div>
          )}

          {/* Activities */}
          {popularActivities && popularActivities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {popularActivities.slice(0, 3).map((activity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
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
