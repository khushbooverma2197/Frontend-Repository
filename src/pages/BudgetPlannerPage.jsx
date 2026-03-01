import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllDestinations, calculateBudget } from '../services/destinationService';
import PrimaryButton from '../components/PrimaryButton';
import Loading from '../components/Loading';

export default function BudgetPlannerPage() {
  const [searchParams] = useSearchParams();
  const preselectedDestinationId = searchParams.get('destination');
  const isInitialMount = useRef(true);

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripItinerary, setTripItinerary] = useState(null);
  
  const [formData, setFormData] = useState({
    destinationId: preselectedDestinationId || '',
    numberOfPeople: 2,
    numberOfDays: 7,
    accommodationType: 'mid-range',
    includeFlight: true
  });

  const [budgetEstimate, setBudgetEstimate] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const calculateTripBudget = async (itinerary, accommodationType = 'mid-range', numberOfPeople = 1) => {
    // Calculate accurate budget for multi-destination trip using the same API as single destination
    setCalculating(true);
    
    try {
      let totalCost = 0;
      let totalDays = 0;
      const breakdown = {
        accommodation: 0,
        food: 0,
        activities: 0,
        transportation: 0,
        flights: 0
      };

      // Calculate budget for each destination using the API
      for (const dest of itinerary.destinations) {
        const days = dest.days || 1;
        totalDays += days;
        
        try {
          // Use the actual calculateBudget API for accurate pricing
          const destBudget = await calculateBudget({
            destinationId: dest.id,
            days: days,
            people: numberOfPeople,
            accommodationType: accommodationType,
            includeFlight: false // We'll add flights separately for multi-destination
          });

          totalCost += destBudget.total || 0;
          
          // Add to breakdown
          if (destBudget.breakdown) {
            breakdown.accommodation += destBudget.breakdown.accommodation || 0;
            breakdown.food += destBudget.breakdown.food || 0;
            breakdown.activities += destBudget.breakdown.activities || 0;
            breakdown.transportation += destBudget.breakdown.transportation || 0;
          }
          
          // Add daily local transportation (taxis, buses, metro) per destination
          // Average $12-15 per day for local transport within a city
          const localTransportPerDay = 12;
          const localTransportCost = localTransportPerDay * days * numberOfPeople;
          breakdown.transportation += localTransportCost;
          totalCost += localTransportCost;
          
        } catch (error) {
          console.error(`Failed to calculate budget for ${dest.name}:`, error);
          // Fallback to simple calculation if API fails
          const dailyCost = dest.avg_daily_cost || dest.avgDailyCost || 120;
          const destTotal = dailyCost * days;
          totalCost += destTotal;
          breakdown.accommodation += destTotal * 0.35;
          breakdown.food += destTotal * 0.30;
          breakdown.activities += destTotal * 0.25;
          breakdown.transportation += destTotal * 0.10;
        }
      }

      // Add international flights for multi-destination trip
      // Assume one international flight to first destination (per person)
      const flightCost = 800 * numberOfPeople; // Average international flight
      breakdown.flights = flightCost;
      totalCost += flightCost;

      // Add inter-destination transportation (flights/trains between destinations)
      if (itinerary.destinations.length > 1) {
        const interDestTransport = (itinerary.destinations.length - 1) * 250 * numberOfPeople; // Domestic/regional flights
        breakdown.transportation += interDestTransport;
        totalCost += interDestTransport;
      }

      // Round everything
      Object.keys(breakdown).forEach(key => {
        breakdown[key] = Math.round(breakdown[key]);
      });

      setBudgetEstimate({
        total: Math.round(totalCost),
        perPerson: Math.round(totalCost / numberOfPeople),
        breakdown,
        recommendations: [
          `Book accommodations ${totalDays > 7 ? '2-3' : '1-2'} months in advance for better rates`,
          'Book flights early to save 20-40% on international travel',
          `Budget includes $12/day for local transport (metro, buses, taxis)`,
          'Use public transportation instead of private taxis to save money',
          'Eat at local restaurants for authentic and affordable meals',
          itinerary.destinations.length > 1 ? `Consider regional flight passes for ${itinerary.destinations.length} destinations` : '',
          `Travel insurance is recommended for ${totalDays}-day trips`
        ].filter(Boolean)
      });
    } catch (error) {
      console.error('Error calculating trip budget:', error);
      alert('Failed to calculate trip budget. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getAllDestinations();
        setDestinations(data);
        
        // Check if there's a trip itinerary in localStorage
        const savedItinerary = localStorage.getItem('tripItinerary');
        if (savedItinerary) {
          const itinerary = JSON.parse(savedItinerary);
          if (itinerary.destinations && itinerary.destinations.length > 0) {
            // Clear previous budget estimate when loading new trip
            setBudgetEstimate(null);
            setTripItinerary(itinerary);
            // Auto-calculate accurate budget for the trip
            await calculateTripBudget(itinerary, formData.accommodationType, formData.numberOfPeople);
          }
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Recalculate trip budget when accommodation type or number of people changes
  useEffect(() => {
    // Skip on initial mount (budget already calculated in first useEffect)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (tripItinerary && tripItinerary.destinations && tripItinerary.destinations.length > 0) {
      console.log('Recalculating budget with:', formData.accommodationType, formData.numberOfPeople);
      calculateTripBudget(tripItinerary, formData.accommodationType, formData.numberOfPeople);
    }
  }, [formData.accommodationType, formData.numberOfPeople]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setCalculating(true);
    
    try {
      const estimate = await calculateBudget({
        destinationId: formData.destinationId,
        days: parseInt(formData.numberOfDays),
        people: parseInt(formData.numberOfPeople),
        accommodationType: formData.accommodationType,
        includeFlight: formData.includeFlight
      });
      
      // Add daily local transportation cost if not included or too low
      const days = parseInt(formData.numberOfDays);
      const people = parseInt(formData.numberOfPeople);
      const localTransportPerDay = 12; // Average daily local transport cost per person
      const localTransportCost = localTransportPerDay * days * people;
      
      // Create a new estimate object with updated values (don't mutate original)
      const updatedEstimate = {
        ...estimate,
        breakdown: {
          ...(estimate.breakdown || {}),
          transportation: (estimate.breakdown?.transportation || 0) + localTransportCost
        },
        total: (estimate.total || 0) + localTransportCost,
        perPerson: Math.round(((estimate.total || 0) + localTransportCost) / people)
      };
      
      setBudgetEstimate(updatedEstimate);
    } catch (error) {
      console.error('Error calculating budget:', error);
      alert('Failed to calculate budget. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Budget Planner
          </h1>
          <p className="text-xl text-gray-600">
            Get an accurate estimate for your dream vacation
          </p>
          {tripItinerary && (
            <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              💰 Showing budget for: <strong>{tripItinerary.name}</strong> ({tripItinerary.destinations?.length} destinations, {tripItinerary.destinations?.reduce((sum, d) => sum + (d.days || 0), 0)} days)
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Trip Details</h2>
              {tripItinerary && (
                <button
                  onClick={() => {
                    localStorage.removeItem('tripItinerary');
                    setTripItinerary(null);
                    setBudgetEstimate(null);
                    setCalculating(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Calculate Custom Budget
                </button>
              )}
            </div>
            
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <select
                  name="destinationId"
                  value={formData.destinationId}
                  onChange={handleInputChange}
                  required
                  disabled={!!tripItinerary}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a destination</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name}, {dest.country}
                    </option>
                  ))}
                </select>
                {tripItinerary && (
                  <p className="text-xs text-gray-500 mt-1">Destinations set by your trip itinerary ({tripItinerary.destinations?.length} locations)</p>
                )}
              </div>

              {/* Number of People */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers
                  {tripItinerary && <span className="text-blue-600 text-xs ml-2">⚡ Auto-updating budget</span>}
                </label>
                <input
                  type="number"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {tripItinerary && (
                  <p className="text-xs text-gray-500 mt-1">Adjust travelers to recalculate total budget</p>
                )}
              </div>

              {/* Number of Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Duration (days)
                </label>
                <input
                  type="number"
                  name="numberOfDays"
                  value={tripItinerary ? tripItinerary.destinations?.reduce((sum, d) => sum + (d.days || 0), 0) : formData.numberOfDays}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  required
                  disabled={!!tripItinerary}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {tripItinerary && (
                  <p className="text-xs text-gray-500 mt-1">Duration set by your trip itinerary</p>
                )}
              </div>

              {/* Accommodation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accommodation Type
                  {tripItinerary && <span className="text-blue-600 text-xs ml-2">⚡ Auto-updating budget</span>}
                </label>
                <select
                  name="accommodationType"
                  value={formData.accommodationType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="budget">Budget (Hostels, Budget Hotels)</option>
                  <option value="mid-range">Mid-range (3-star Hotels)</option>
                  <option value="luxury">Luxury (4-5 star Hotels, Resorts)</option>
                </select>
                {tripItinerary && (
                  <p className="text-xs text-gray-500 mt-1">Change accommodation type to see updated costs</p>
                )}
              </div>

              {/* Include Flight */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="includeFlight"
                  checked={formData.includeFlight}
                  onChange={handleInputChange}
                  disabled={!!tripItinerary}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label className="ml-3 text-gray-700">
                  Include international flight costs
                  {tripItinerary && <span className="text-xs text-gray-500 ml-2">(Always included for trip itinerary)</span>}
                </label>
              </div>

              {!tripItinerary && (
                <PrimaryButton 
                  type="submit" 
                  fullWidth 
                  size="lg"
                  disabled={calculating}
                >
                  {calculating ? 'Calculating...' : 'Calculate Budget'}
                </PrimaryButton>
              )}
              
              {tripItinerary && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Adjust "Number of Travelers" or "Accommodation Type" above to see how they affect your total budget.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">
              {tripItinerary ? '💼 Your Trip Budget' : 'Budget Estimate'}
            </h2>
            
            {tripItinerary && budgetEstimate && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2">📍 Destinations in Your Trip:</h3>
                <div className="space-y-1">
                  {tripItinerary.destinations.map((dest, index) => (
                    <div key={dest.id} className="flex justify-between text-sm">
                      <span>
                        {index + 1}. {dest.name}, {dest.country}
                      </span>
                      <span className="text-gray-600">
                        {dest.days} days × ${Math.round(dest.avg_daily_cost || dest.avgDailyCost || 0)}/day
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!budgetEstimate ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                {calculating ? (
                  <>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-lg text-gray-600">Calculating your budget...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a moment for multi-destination trips</p>
                  </>
                ) : (
                  <>
                    <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg">Fill out the form to see your estimate</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 text-center">
                  <p className="text-sm opacity-90 mb-2">Total Estimated Cost</p>
                  <p className="text-5xl font-bold">
                    ${budgetEstimate.total?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-sm opacity-90 mt-2">
                    ${budgetEstimate.perPerson?.toLocaleString() || Math.round((budgetEstimate.total || 0) / formData.numberOfPeople).toLocaleString()} per person
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Cost Breakdown</h3>
                  
                  {budgetEstimate.breakdown && Object.entries(budgetEstimate.breakdown).map(([category, amount], index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-gray-700 capitalize">{category}</span>
                      </div>
                      <span className="font-semibold">${amount?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {budgetEstimate.recommendations && budgetEstimate.recommendations.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Money-Saving Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {budgetEstimate.recommendations.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-4">What's Included?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold mb-1">Accommodation</h4>
                <p className="text-sm text-gray-600">Hotel or hostel costs for your entire stay</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold mb-1">Meals</h4>
                <p className="text-sm text-gray-600">Daily food and dining expenses</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold mb-1">Activities</h4>
                <p className="text-sm text-gray-600">Tours, attractions, and entertainment</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold mb-1">Flights & Transport</h4>
                <p className="text-sm text-gray-600">International flights, daily local transport (metro, buses, taxis - ~$12/day)</p>
              </div>
            </div>
          </div>
          {tripItinerary && tripItinerary.destinations && tripItinerary.destinations.length > 1 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>✈️ Multi-Destination Trip:</strong> This budget includes international flights to your first destination, daily local transport in each city (~$12/day), and transportation between all {tripItinerary.destinations.length} destinations in your itinerary.
              </p>
            </div>
          )}
          {tripItinerary && tripItinerary.destinations && tripItinerary.destinations.length === 1 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>🚕 Local Transportation:</strong> Budget includes daily local transport (~$12/day) for taxis, metro, buses, and ride-sharing services within the city.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
