import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import DestinationList from '../components/DestinationList';
import DestinationCard from '../components/DestinationCard';
import { getAllDestinations } from '../services/destinationService';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    // Load user preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const prefs = JSON.parse(savedPreferences);
      setUserPreferences(prefs);
      
      // Fetch and filter destinations based on preferences
      const fetchRecommendations = async () => {
        try {
          const allDestinations = await getAllDestinations();
          
          // Filter destinations that match user interests
          const matching = allDestinations.filter(dest => {
            if (!dest.interests || !prefs.interests) return false;
            
            // Check if destination has at least one matching interest
            return prefs.interests.some(userInterest => 
              dest.interests.includes(userInterest)
            );
          });
          
          // Further filter by budget if specified
          if (prefs.budgetRange) {
            const budgetFiltered = matching.filter(dest => {
              if (!dest.avg_daily_cost) return true;
              
              switch (prefs.budgetRange) {
                case 'budget':
                  return dest.avg_daily_cost < 100;
                case 'moderate':
                  return dest.avg_daily_cost >= 100 && dest.avg_daily_cost <= 200;
                case 'luxury':
                  return dest.avg_daily_cost > 200;
                default:
                  return true;
              }
            });
            
            setRecommendations(budgetFiltered.slice(0, 6)); // Show top 6
          } else {
            setRecommendations(matching.slice(0, 6));
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      };
      
      fetchRecommendations();
    }
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl text-blue-100">
              Explore breathtaking destinations and plan your perfect trip
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      {userPreferences && recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <span>✨</span> Recommended For You
                </h2>
                <p className="text-gray-600 mt-1">
                  Based on your preferences: {userPreferences.interests?.join(', ')}
                </p>
              </div>
              <Link 
                to="/preferences"
                className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition font-medium"
              >
                ⚙️ Update Preferences
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(destination => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>

            {recommendations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No recommendations found. Try updating your preferences!</p>
                <Link to="/preferences">
                  <button className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                    Set Your Preferences
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <FilterPanel onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-4 py-3 bg-white rounded-lg shadow-md flex items-center justify-between"
            >
              <span className="font-semibold">Filters</span>
              <svg 
                className={`w-5 h-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilters && (
              <div className="mt-4">
                <FilterPanel onFilterChange={handleFilterChange} />
              </div>
            )}
          </div>

          {/* Destinations Grid */}
          <div className="lg:col-span-3">
            <DestinationList filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TravelInspire?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600">Find destinations that match your preferences and budget</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Budget Planner</h3>
              <p className="text-gray-600">Get accurate cost estimates for your trips</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Reviews</h3>
              <p className="text-gray-600">Read authentic experiences from fellow travelers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
