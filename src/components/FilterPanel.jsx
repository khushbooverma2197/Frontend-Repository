import { useState } from 'react';

export default function FilterPanel({ onFilterChange }) {
  const [filters, setFilters] = useState({
    type: [],
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
    const newTypes = filters.type.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];
    const newFilters = { ...filters, type: newTypes };
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
    const clearedFilters = { type: [], minBudget: '', maxBudget: '', activities: [] };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition"
        >
          Clear all
        </button>
      </div>

      {/* Destination Type */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Type</h4>
        <div className="space-y-0.5">
          {destinationTypes.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 px-2 py-2 rounded-lg transition group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition flex-shrink-0
                  ${filters.type.includes(type) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}
              >
                {filters.type.includes(type) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={filters.type.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="sr-only"
              />
              <span className="text-sm text-gray-700 select-none">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Budget Range */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Budget / Day (USD)</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minBudget}
            onChange={(e) => handleBudgetChange('minBudget', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxBudget}
            onChange={(e) => handleBudgetChange('maxBudget', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Activities */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Activities</h4>
        <div className="flex flex-wrap gap-1.5">
          {popularActivities.map((activity) => (
            <button
              key={activity}
              onClick={() => handleActivityToggle(activity)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                filters.activities.includes(activity)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
