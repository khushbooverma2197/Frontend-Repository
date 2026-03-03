import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTrips, deleteTrip } from '../services/tripsService';
import Loading from '../components/Loading';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripToDelete, setTripToDelete] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    try {
      const allTrips = getAllTrips();
      setTrips(allTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = (tripId, tripName) => {
    setTripToDelete({ id: tripId, name: tripName });
  };

  const confirmDelete = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete.id);
      setTrips(trips.filter(t => t.id !== tripToDelete.id));
      setTripToDelete(null);
    }
  };

  const calculateTotalDays = (destinations) => {
    return destinations?.reduce((sum, d) => sum + (d.days || 0), 0) || 0;
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Delete Confirmation Modal */}
        {tripToDelete && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Trip?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-800">"{tripToDelete.name}"</span>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTripToDelete(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">My Trips</h1>
            <p className="text-gray-500 text-sm">View and manage your saved trip plans</p>
          </div>
          <Link to="/trip-planner">
            <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm">
              + Create New Trip
            </button>
          </Link>
        </div>

        {/* Trips List */}
        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No saved trips yet</h3>
            <p className="text-gray-500 mb-6">Start planning your next adventure!</p>
            <Link to="/trip-planner">
              <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                Create Your First Trip
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <div key={trip.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-200">
                {/* Trip Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                  <h2 className="text-xl font-bold mb-1">{trip.name}</h2>
                  <p className="text-sm text-blue-100">
                    {trip.destinations?.length || 0} destinations • {calculateTotalDays(trip.destinations)} days
                  </p>
                </div>

                {/* Trip Content */}
                <div className="p-4">
                  {/* Dates */}
                  {trip.startDate && trip.endDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Destinations */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Destinations:</h3>
                    <div className="space-y-1">
                      {trip.destinations?.slice(0, 3).map((dest, index) => (
                        <div key={dest.id} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{dest.name}</span>
                          <span className="text-gray-500 text-xs">({dest.days}d)</span>
                        </div>
                      ))}
                      {trip.destinations?.length > 3 && (
                        <p className="text-xs text-gray-500 ml-7">
                          +{trip.destinations.length - 3} more destinations
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes Preview */}
                  {trip.notes && (
                    <div className="mb-4 p-2 bg-gray-50 rounded text-xs text-gray-600 line-clamp-2">
                      📝 {trip.notes}
                    </div>
                  )}

                  {/* Trip Info */}
                  <div className="text-xs text-gray-500 mb-4">
                    Created: {new Date(trip.createdAt).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        localStorage.setItem('tripItinerary', JSON.stringify(trip));
                        navigate('/trip-planner');
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip.id, trip.name)}
                      className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition border border-red-100"
                      title="Delete trip"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      // Load this trip into localStorage for budget calculation
                      localStorage.setItem('tripItinerary', JSON.stringify(trip));
                      navigate('/budget');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    💰 View Budget
                  </button>
                  <span className="text-gray-500">
                    Last updated: {new Date(trip.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {trips.length > 0 && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <div className="text-3xl font-bold text-blue-600">{trips.length}</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="text-4xl mb-2">📍</div>
              <div className="text-3xl font-bold text-purple-600">
                {trips.reduce((sum, trip) => sum + (trip.destinations?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Destinations to Visit</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="text-4xl mb-2">📅</div>
              <div className="text-3xl font-bold text-green-600">
                {trips.reduce((sum, trip) => sum + calculateTotalDays(trip.destinations), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Days Planned</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
