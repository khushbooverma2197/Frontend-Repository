import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDestinationById } from '../services/destinationService';
import { getReviewsByDestination } from '../services/reviewService';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import PrimaryButton from '../components/PrimaryButton';

export default function DestinationDetailPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [destData, reviewsData] = await Promise.all([
          getDestinationById(id),
          getReviewsByDestination(id).catch(() => []) // Don't fail if reviews fail
        ]);
        
        setDestination(destData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError(err.message || 'Failed to load destination');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay message={error} />;
  if (!destination) return <ErrorDisplay message="Destination not found" />;

  const {
    name,
    country,
    description,
    imageUrl,
    averageCost,
    bestTimeToVisit,
    popularActivities,
    averageRating,
    type
  } = destination;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center text-white hover:text-blue-200 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to destinations
            </Link>
            <h1 className="text-5xl font-bold mb-2">{name}</h1>
            <p className="text-xl">{country}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-4 font-semibold ${
                    activeTab === 'overview'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`flex-1 px-6 py-4 font-semibold ${
                    activeTab === 'activities'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Activities
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 px-6 py-4 font-semibold ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">About {name}</h2>
                    <p className="text-gray-700 leading-relaxed">{description}</p>
                    
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-xl font-semibold mb-3">Travel Tips</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Best time to visit: <strong className="ml-1">{bestTimeToVisit}</strong>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Type: <strong className="ml-1">{type}</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'activities' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Popular Activities</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {popularActivities?.map((activity, index) => (
                        <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            {index + 1}
                          </div>
                          <span className="text-gray-800 font-medium">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Traveler Reviews</h2>
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4">
                            <div className="flex items-center mb-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-6">
                <p className="text-gray-600 text-sm">Starting from</p>
                <p className="text-4xl font-bold text-blue-600">${averageCost?.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">per person</p>
              </div>

              {averageRating && (
                <div className="flex items-center justify-center mb-6 pb-6 border-b">
                  <svg className="w-6 h-6 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-2">({reviews.length} reviews)</span>
                </div>
              )}

              <div className="space-y-3">
                <Link to={`/budget?destination=${id}`}>
                  <PrimaryButton fullWidth>
                    Calculate Budget
                  </PrimaryButton>
                </Link>
                <Link to={`/journals/new?destination=${id}`}>
                  <PrimaryButton variant="outline" fullWidth>
                    Create Journal Entry
                  </PrimaryButton>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t text-sm text-gray-600">
                <p className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free cancellation
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Reserve now, pay later
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
