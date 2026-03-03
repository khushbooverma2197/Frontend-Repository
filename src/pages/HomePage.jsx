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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
              Discover Your Next Adventure
            </h1>
            <p className="text-lg text-blue-100 max-w-xl mx-auto">
              Explore breathtaking destinations and plan your perfect trip
            </p>
          </div>
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      {userPreferences && recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Based on: {userPreferences.interests?.join(', ')}
                </p>
              </div>
              <Link
                to="/preferences"
                className="text-xs font-medium text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-50 transition"
              >
                Update preferences
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map(destination => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-7">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <FilterPanel onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between text-sm font-medium text-gray-700 hover:border-blue-300 transition"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showFilters && (
              <div className="mt-3">
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
      <div className="bg-white border-t border-gray-100 py-16 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Why TravelInspire?</h2>
            <p className="text-gray-500 text-sm mt-2">Everything you need to plan with confidence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                bg: 'bg-blue-50',
                title: 'Smart Search',
                desc: 'Find destinations that match your preferences and budget',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                bg: 'bg-purple-50',
                title: 'Budget Planner',
                desc: 'Get accurate cost estimates for flights, hotels, and activities',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                bg: 'bg-emerald-50',
                title: 'Real Reviews',
                desc: 'Read authentic experiences from fellow travellers',
              },
            ].map(({ icon, bg, title, desc }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
