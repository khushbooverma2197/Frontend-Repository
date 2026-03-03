import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFavorites, removeFromFavorites } from '../services/favoritesService';
import { getDestinationById } from '../services/destinationService';
import { calculateBudget } from '../services/destinationService';
import { saveTrip } from '../services/tripsService';
import PrimaryButton from '../components/PrimaryButton';
import Loading from '../components/Loading';

export default function TripPlannerPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [itinerary, setItinerary] = useState(() => {
    const saved = localStorage.getItem('tripItinerary');
    return saved ? JSON.parse(saved) : {
      name: 'My Trip',
      destinations: [],
      startDate: '',
      endDate: '',
      notes: ''
    };
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [accommodationType, setAccommodationType] = useState('mid-range');
  const [tripBudgetData, setTripBudgetData] = useState(null);
  const [budgetCalculating, setBudgetCalculating] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  // Recalculate budget whenever destinations or people count changes
  useEffect(() => {
    if (itinerary.destinations.length === 0) {
      setTripBudgetData(null);
      return;
    }
    const recalculate = async () => {
      setBudgetCalculating(true);
      try {
        let total = 0;
        const destBudgets = {};
        for (let i = 0; i < itinerary.destinations.length; i++) {
          const dest = itinerary.destinations[i];
          try {
            const result = await calculateBudget({
              destinationId: dest.id,
              days: dest.days || 3,
              people: numberOfPeople,
              accommodationType: accommodationType,
              includeFlight: i === 0, // actual flight cost from DB for first destination only
            });
            destBudgets[dest.id] = result;
            total += result.total || 0;
          } catch {
            const fallback = Math.round((dest.avg_daily_cost || 100) * (dest.days || 3) * numberOfPeople);
            destBudgets[dest.id] = { total: fallback, breakdown: {} };
            total += fallback;
          }
        }
        // Add inter-destination transport (regional flights/trains between destinations)
        const interDestTransport =
          itinerary.destinations.length > 1
            ? (itinerary.destinations.length - 1) * 250 * numberOfPeople
            : 0;
        total += interDestTransport;
        setTripBudgetData({
          total: Math.round(total),
          perPerson: Math.round(total / numberOfPeople),
          interDestTransport,
          destBudgets,
        });
      } finally {
        setBudgetCalculating(false);
      }
    };
    recalculate();
  }, [itinerary.destinations, numberOfPeople, accommodationType]);

  const loadFavorites = async () => {
    try {
      const favoritesList = getFavorites();
      // Favorites now store full destination data, but we'll still fetch fresh data
      const destinationsData = [];
      
      for (const fav of favoritesList) {
        try {
          // fav already has destination data, but fetch fresh data if needed
          if (fav.id) {
            const dest = await getDestinationById(fav.id);
            destinationsData.push(dest);
          }
        } catch (err) {
          console.error(`Failed to load destination ${fav.id}:`, err);
          // If fetch fails, use the stored favorite data
          if (fav.id && fav.name) {
            destinationsData.push(fav);
          }
        }
      }
      
      setFavorites(destinationsData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (destinationId) => {
    removeFromFavorites(destinationId);
    setFavorites(favorites.filter(d => d.id !== destinationId));
  };

  const addToItinerary = (destination) => {
    if (!itinerary.destinations.find(d => d.id === destination.id)) {
      const updated = {
        ...itinerary,
        destinations: [...itinerary.destinations, {
          id: destination.id,
          name: destination.name,
          country: destination.country,
          avg_daily_cost: destination.avg_daily_cost || destination.avgDailyCost || 0,
          days: 3,
          order: itinerary.destinations.length
        }]
      };
      setItinerary(updated);
      localStorage.setItem('tripItinerary', JSON.stringify(updated));
    }
  };

  const removeFromItinerary = (destinationId) => {
    const updated = {
      ...itinerary,
      destinations: itinerary.destinations.filter(d => d.id !== destinationId)
    };
    setItinerary(updated);
    localStorage.setItem('tripItinerary', JSON.stringify(updated));
  };

  const updateItineraryDays = (destinationId, days) => {
    const updated = {
      ...itinerary,
      destinations: itinerary.destinations.map(d =>
        d.id === destinationId ? { ...d, days: parseInt(days) || 1 } : d
      )
    };
    setItinerary(updated);
    localStorage.setItem('tripItinerary', JSON.stringify(updated));
  };

  const calculateTotalDays = () => {
    return itinerary.destinations.reduce((sum, d) => sum + (d.days || 0), 0);
  };

  const handleSaveTrip = async () => {
    if (itinerary.destinations.length === 0) {
      alert('Please add destinations to your trip before saving!');
      return;
    }

    setSaving(true);
    try {
      // Ensure all destinations have cost data before saving
      const enrichedItinerary = {
        ...itinerary,
        destinations: itinerary.destinations.map(dest => {
          const fullDest = favorites.find(f => f.id === dest.id);
          return {
            ...dest,
            avg_daily_cost: dest.avg_daily_cost || fullDest?.avg_daily_cost || 0
          };
        })
      };
      
      const savedTrip = saveTrip(enrichedItinerary);
      alert(`Trip "${savedTrip.name}" saved successfully!`);
      
      // Navigate to My Trips (keep itinerary in localStorage for now)
      navigate('/my-trips');
      
      // Clear itinerary after navigation
      setTimeout(() => {
        localStorage.removeItem('tripItinerary');
      }, 100);
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Trip Planner</h1>
          <p className="text-gray-600">Plan your perfect multi-destination adventure</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Favorites List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">💖 Saved Destinations</h2>
              
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No saved destinations yet</p>
                  <Link to="/">
                    <PrimaryButton>Explore Destinations</PrimaryButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {favorites.map(destination => {
                    const imageUrl = (destination.images && destination.images.length > 0) 
                      ? destination.images[0] 
                      : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
                    const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
                    
                    return (
                      <div key={destination.id} className="border rounded-lg p-3 hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={imageUrl}
                            alt={destination.name}
                            onError={(e) => {
                              console.error(`Image failed to load for ${destination.name}`);
                              e.target.src = fallbackImage;
                            }}
                            className="w-16 h-16 object-cover rounded bg-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{destination.name}</h3>
                            <p className="text-xs text-gray-500">{destination.country}</p>
                            <p className="text-xs text-blue-600 font-medium">
                              ${Math.round(destination.avg_daily_cost)}/day
                            </p>
                          </div>
                        </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToItinerary(destination)}
                          className="flex-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 transition"
                        >
                          + Add to Trip
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(destination.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded hover:bg-red-100 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Itinerary Builder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  {editMode ? (
                    <input
                      type="text"
                      value={itinerary.name}
                      onChange={(e) => {
                        const updated = { ...itinerary, name: e.target.value };
                        setItinerary(updated);
                        localStorage.setItem('tripItinerary', JSON.stringify(updated));
                      }}
                      className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold">{itinerary.name}</h2>
                  )}
                </div>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {editMode ? 'Done' : 'Edit'}
                </button>
              </div>

              {itinerary.destinations.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No destinations in your itinerary</h3>
                  <p className="text-gray-500">Add destinations from your favorites to start planning</p>
                </div>
              ) : (
                <>
                  {/* Trip Summary */}
                  <div className="grid md:grid-cols-4 gap-4 mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Destinations</p>
                      <p className="text-2xl font-bold text-blue-600">{itinerary.destinations.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Days</p>
                      <p className="text-2xl font-bold text-purple-600">{calculateTotalDays()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Est. Cost</p>
                      <p className="text-2xl font-bold text-green-600">
                        {budgetCalculating ? '…' : `$${(tripBudgetData?.total || 0).toLocaleString()}`}
                      </p>
                      {tripBudgetData && (
                        <p className="text-xs text-gray-500">${tripBudgetData.perPerson.toLocaleString()}/person</p>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">People</p>
                      <input
                        type="number"
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        max="20"
                        className="w-16 text-center text-xl font-bold text-orange-600 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Accommodation type selector */}
                  <div className="mb-6 flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Accommodation:</label>
                    <select
                      value={accommodationType}
                      onChange={(e) => setAccommodationType(e.target.value)}
                      className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="budget">Budget (Hostels)</option>
                      <option value="mid-range">Mid-range (3-star)</option>
                      <option value="luxury">Luxury (4-5 star)</option>
                    </select>
                    {budgetCalculating && (
                      <span className="text-xs text-blue-600 animate-pulse">Recalculating…</span>
                    )}
                  </div>

                  {/* Itinerary Items */}
                  <div className="space-y-4">
                    {itinerary.destinations.map((dest, index) => {
                      const fullDest = favorites.find(f => f.id === dest.id);
                      return (
                        <div key={dest.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                              </span>
                              <div>
                                <h3 className="font-bold text-lg">{dest.name}</h3>
                                <p className="text-sm text-gray-600">{dest.country}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromItinerary(dest.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">Days:</label>
                              <input
                                type="number"
                                value={dest.days}
                                onChange={(e) => updateItineraryDays(dest.id, e.target.value)}
                                min="1"
                                max="30"
                                className="w-16 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            {fullDest && (
                              <p className="text-sm text-gray-600">
                                Est. cost: <span className="font-semibold text-green-600">
                                  {tripBudgetData?.destBudgets?.[dest.id]
                                    ? `$${tripBudgetData.destBudgets[dest.id].total.toLocaleString()}`
                                    : `$${Math.round((fullDest.avg_daily_cost || 0) * dest.days).toLocaleString()}`}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Trip Dates */}
                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={itinerary.startDate}
                        onChange={(e) => {
                          const updated = { ...itinerary, startDate: e.target.value };
                          setItinerary(updated);
                          localStorage.setItem('tripItinerary', JSON.stringify(updated));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={itinerary.endDate}
                        onChange={(e) => {
                          const updated = { ...itinerary, endDate: e.target.value };
                          setItinerary(updated);
                          localStorage.setItem('tripItinerary', JSON.stringify(updated));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trip Notes</label>
                    <textarea
                      value={itinerary.notes}
                      onChange={(e) => {
                        const updated = { ...itinerary, notes: e.target.value };
                        setItinerary(updated);
                        localStorage.setItem('tripItinerary', JSON.stringify(updated));
                      }}
                      rows="3"
                      placeholder="Add notes about your trip..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleSaveTrip}
                      disabled={saving || itinerary.destinations.length === 0}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : '💾 Save Trip to My Trips'}
                    </button>
                    <Link to={`/budget?people=${numberOfPeople}&accommodationType=${accommodationType}`} className="flex-1">
                      <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition">
                        💰 Calculate Detailed Budget
                      </button>
                    </Link>
                  </div>

                  {/* View Saved Trips */}
                  <div className="mt-4 text-center">
                    <Link to="/my-trips" className="text-blue-600 hover:text-blue-700 font-medium">
                      📋 View All My Saved Trips →
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
