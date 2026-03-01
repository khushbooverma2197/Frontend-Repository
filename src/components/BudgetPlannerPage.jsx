import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllDestinations, calculateBudget } from '../services/destinationService';
import PrimaryButton from '../components/PrimaryButton';
import Loading from '../components/Loading';

export default function BudgetPlannerPage() {
  const [searchParams] = useSearchParams();
  const preselectedDestinationId = searchParams.get('destination');

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    destinationId: preselectedDestinationId || '',
    numberOfPeople: 2,
    numberOfDays: 7,
    accommodationType: 'mid-range',
    includeFlight: true
  });

  const [budgetEstimate, setBudgetEstimate] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getAllDestinations();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

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
      
      setBudgetEstimate(estimate);
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
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Trip Details</h2>
            
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a destination</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name}, {dest.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of People */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers
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
              </div>

              {/* Number of Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Duration (days)
                </label>
                <input
                  type="number"
                  name="numberOfDays"
                  value={formData.numberOfDays}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Accommodation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accommodation Type
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
              </div>

              {/* Include Flight */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="includeFlight"
                  checked={formData.includeFlight}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="ml-3 text-gray-700">
                  Include international flight costs
                </label>
              </div>

              <PrimaryButton 
                type="submit" 
                fullWidth 
                size="lg"
                disabled={calculating}
              >
                {calculating ? 'Calculating...' : 'Calculate Budget'}
              </PrimaryButton>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Budget Estimate</h2>
            
            {!budgetEstimate ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">Fill out the form to see your estimate</p>
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
          <div className="grid md:grid-cols-3 gap-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}
