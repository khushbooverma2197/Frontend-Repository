import { useState, useEffect, useCallback } from 'react';
import DestinationCard from './DestinationCard';
import Loading from './Loading';
import ErrorDisplay from './ErrorDisplay';
import { getAllDestinations, searchDestinations } from '../services/destinationService';

// Mapping filter types to database interests
const TYPE_TO_INTERESTS = {
  'Beach Paradise': ['beach', 'relaxation'],
  'Mountain Retreat': ['nature', 'hiking'],
  'Cultural Hub': ['culture', 'history'],
  'Adventure Zone': ['adventure'],
  'Relaxation Haven': ['relaxation', 'romance']
};

// Mapping activities to database interests
const ACTIVITY_TO_INTERESTS = {
  'Hiking': ['hiking', 'nature'],
  'Surfing': ['beach', 'adventure'],
  'Temple Tours': ['culture', 'history'],
  'Scuba Diving': ['beach', 'adventure'],
  'Photography': ['photography', 'culture', 'nature'],
  'Food Tours': ['food', 'culture'],
  'Wildlife Safari': ['nature', 'adventure']
};

export default function DestinationList({ filters = {}, searchQuery = '' }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Applying filters:', filters);
      console.log('Search query:', searchQuery);

      // Always get all destinations first
      let data = await getAllDestinations();
      console.log('Total destinations loaded:', data.length);
      
      // Apply text search if there's a search query
      if (searchQuery && searchQuery.trim() !== '') {
        const lowerQuery = searchQuery.toLowerCase().trim();
        console.log('Applying text search for:', lowerQuery);
        data = data.filter(d => 
          d.name?.toLowerCase().includes(lowerQuery) ||
          d.country?.toLowerCase().includes(lowerQuery) ||
          d.description?.toLowerCase().includes(lowerQuery) ||
          d.continent?.toLowerCase().includes(lowerQuery) ||
          (d.interests && d.interests.some(i => i.toLowerCase().includes(lowerQuery)))
        );
        console.log('After text search:', data.length);
      }
      
      // Apply filters locally
      if (filters.type) {
        // Map filter type to database interests
        const requiredInterests = TYPE_TO_INTERESTS[filters.type] || [];
        console.log('Filtering by type:', filters.type, '-> interests:', requiredInterests);
        data = data.filter(d => 
          d.interests && requiredInterests.some(reqInterest =>
            d.interests.some(interest => interest.toLowerCase() === reqInterest.toLowerCase())
          )
        );
        console.log('After type filter:', data.length);
      }
      
      if (filters.minBudget && filters.minBudget !== '') {
        console.log('Filtering by min budget:', filters.minBudget);
        data = data.filter(d => d.avg_daily_cost >= parseFloat(filters.minBudget));
        console.log('After min budget filter:', data.length);
      }
      
      if (filters.maxBudget && filters.maxBudget !== '') {
        console.log('Filtering by max budget:', filters.maxBudget);
        data = data.filter(d => d.avg_daily_cost <= parseFloat(filters.maxBudget));
        console.log('After max budget filter:', data.length);
      }
      
      if (filters.activities && filters.activities.length > 0) {
        console.log('Filtering by activities:', filters.activities);
        data = data.filter(d => {
          if (!d.interests) return false;
          
          // For each selected activity, get its mapped interests
          return filters.activities.some(activity => {
            const activityInterests = ACTIVITY_TO_INTERESTS[activity] || [];
            // Check if destination has any of the interests for this activity
            return activityInterests.some(reqInterest =>
              d.interests.some(interest => interest.toLowerCase() === reqInterest.toLowerCase())
            );
          });
        });
        console.log('After activities filter:', data.length);
      }

      console.log('Final filtered destinations:', data.length);
      setDestinations(data);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError(err.message || 'Failed to load destinations');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters.type, filters.minBudget, filters.maxBudget, JSON.stringify(filters.activities)]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  if (loading) return <Loading />;
  
  if (error) return <ErrorDisplay message={error} onRetry={fetchDestinations} />;

  if (destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No destinations found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Search & Filters Summary */}
      {(searchQuery || filters.type || filters.minBudget || filters.maxBudget || (filters.activities && filters.activities.length > 0)) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">
            {searchQuery ? 'Search Results & Filters:' : 'Active Filters:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                Search: "{searchQuery}"
              </span>
            )}
            {filters.type && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Type: {filters.type}
              </span>
            )}
            {filters.minBudget && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Min: ${filters.minBudget}
              </span>
            )}
            {filters.maxBudget && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Max: ${filters.maxBudget}
              </span>
            )}
            {filters.activities && filters.activities.map(activity => (
              <span key={activity} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Found <span className="font-semibold">{destinations.length}</span> {destinations.length === 1 ? 'destination' : 'destinations'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </div>
  );
}
