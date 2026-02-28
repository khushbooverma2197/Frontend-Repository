import { useState, useEffect, useCallback } from 'react';
import DestinationCard from './DestinationCard';
import Loading from './Loading';
import ErrorDisplay from './ErrorDisplay';
import { getAllDestinations, searchDestinations } from '../services/destinationService';

export default function DestinationList({ filters = {}, searchQuery = '' }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (searchQuery) {
        // Use search API if there's a search query
        data = await searchDestinations({ query: searchQuery, ...filters });
      } else {
        // Otherwise get all destinations
        data = await getAllDestinations();
        
        // Apply filters locally
        if (filters.type) {
          data = data.filter(d => d.type === filters.type);
        }
        if (filters.minBudget) {
          data = data.filter(d => d.averageCost >= parseInt(filters.minBudget));
        }
        if (filters.maxBudget) {
          data = data.filter(d => d.averageCost <= parseInt(filters.maxBudget));
        }
        if (filters.activities && filters.activities.length > 0) {
          data = data.filter(d => 
            d.popularActivities && 
            filters.activities.some(activity => d.popularActivities.includes(activity))
          );
        }
      }

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
