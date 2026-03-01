import { useState } from 'react';

export default function FilterPanel({ onFilterChange }) {
  const [filters, setFilters] = useState({
    type: '',
    minBudget: '',
    maxBudget: '',
    activities: []
  });

  const destinationTypes = [
    'Beach Paradise',
    'Mountain Retreat', 
    'Cultural Hub',
    'Adventure Zone',
    'Relaxation Haven'
  ];

  const popularActivities = [
    'Hiking',
    'Surfing',
    'Temple Tours',
    'Scuba Diving',
    'Photography',
    'Food Tours',
    'Wildlife Safari'
  ];

  const handleTypeChange = (type) => {
    const newFilters = { ...filters, type: filters.type === type ? '' : type };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleActivityToggle = (activity) => {
    const newActivities = filters.activities.includes(activity)
      ? filters.activities.filter(a => a !== activity)
      : [...filters.activities, activity];
    
    const newFilters = { ...filters, activities: newActivities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBudgetChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    // Trigger filter change immediately, even if value is empty
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { type: '', minBudget: '', maxBudget: '', activities: [] };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      {/* Destination Type */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Destination Type</h4>
        <div className="space-y-2">
          {destinationTypes.map((type) => (
            <label key={type} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.type === type}
                onChange={() => handleTypeChange(type)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Budget Range (USD)</h4>
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min Budget"
            value={filters.minBudget}
            onChange={(e) => handleBudgetChange('minBudget', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Max Budget"
            value={filters.maxBudget}
            onChange={(e) => handleBudgetChange('maxBudget', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Activities */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Activities</h4>
        <div className="flex flex-wrap gap-2">
          {popularActivities.map((activity) => (
            <button
              key={activity}
              onClick={() => handleActivityToggle(activity)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                filters.activities.includes(activity)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {activity}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
