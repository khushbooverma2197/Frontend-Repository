# React Components - Detailed Explanation

## 🎨 Component Files Explained

### 13. src/pages/HomePage.jsx - Main Landing Page

```javascript
// Lines 1-7: Imports
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import DestinationList from '../components/DestinationList';
import DestinationCard from '../components/DestinationCard';
import { getAllDestinations } from '../services/destinationService';

// Line 9: Define HomePage component
export default function HomePage() {
  // Lines 11-14: State variables
  const [searchQuery, setSearchQuery] = useState('');      // Current search text
  const [filters, setFilters] = useState({});              // Active filters
  const [showFilters, setShowFilters] = useState(false);   // Mobile filter visibility
  const [recommendations, setRecommendations] = useState([]); // Personalized destinations
  const [userPreferences, setUserPreferences] = useState(null); // User's travel preferences

  // Lines 16-60: Load personalized recommendations
  useEffect(() => {
    // Line 17: Get saved preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    
    // Line 18: If preferences exist
    if (savedPreferences) {
      // Line 19: Parse JSON string to object
      const prefs = JSON.parse(savedPreferences);
      setUserPreferences(prefs);
      
      // Line 22: Function to fetch and filter destinations
      const fetchRecommendations = async () => {
        try {
          // Line 24: Get all destinations from API
          const allDestinations = await getAllDestinations();
          
          // Lines 26-32: Filter destinations that match user interests
          const matching = allDestinations.filter(dest => {
            // Skip if no interests data
            if (!dest.interests || !prefs.interests) return false;
            
            // Check if destination has at least one matching interest
            // Example: User likes "beach", destination has ["beach", "diving"]
            return prefs.interests.some(userInterest => 
              dest.interests.includes(userInterest)
            );
          });
          
          // Lines 34-49: Further filter by budget if specified
          if (prefs.budgetRange) {
            const budgetFiltered = matching.filter(dest => {
              // Skip if no cost data
              if (!dest.avg_daily_cost) return true;
              
              // Check budget range
              switch (prefs.budgetRange) {
                case 'budget':
                  return dest.avg_daily_cost < 100;   // Under $100/day
                case 'moderate':
                  return dest.avg_daily_cost >= 100 && dest.avg_daily_cost <= 200; // $100-200
                case 'luxury':
                  return dest.avg_daily_cost > 200;   // Over $200/day
                default:
                  return true;
              }
            });
            
            // Take top 6 matching destinations
            setRecommendations(budgetFiltered.slice(0, 6));
          } else {
            setRecommendations(matching.slice(0, 6));
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      };
      
      // Line 56: Execute the fetch function
      fetchRecommendations();
    }
  }, []); // Empty dependency array = run once on mount

  // Lines 62-65: Event handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Lines 67+: Render JSX
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* HERO SECTION */}
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

      {/* PERSONALIZED RECOMMENDATIONS SECTION */}
      {/* Only show if user has preferences and we found recommendations */}
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
              {/* Link to update preferences */}
              <Link 
                to="/preferences"
                className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition font-medium"
              >
                ⚙️ Update Preferences
              </Link>
            </div>
            
            {/* Grid of recommended destinations */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(destination => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop filter sidebar - always visible on large screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <FilterPanel onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Mobile filter toggle */}
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
            
            {/* Show filters when toggled */}
            {showFilters && (
              <div className="mt-4">
                <FilterPanel onFilterChange={handleFilterChange} />
              </div>
            )}
          </div>

          {/* Destinations grid - takes 3 columns on desktop */}
          <div className="lg:col-span-3">
            <DestinationList filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Key Concepts**:

1. **useState**: Creates state variable that triggers re-render when changed
```javascript
const [value, setValue] = useState(initialValue);
setValue(newValue); // Updates value and re-renders component
```

2. **useEffect**: Runs side effects (API calls, subscriptions, etc)
```javascript
useEffect(() => {
  // Code here runs after component renders
  fetchData();
}, [dependency]); // Re-runs when dependency changes
```

3. **Conditional Rendering**: Show/hide elements based on state
```javascript
{condition && <Element />}  // Shows Element if condition is true
{condition ? <A /> : <B />} // Shows A if true, B if false
```

---

### 14. src/components/DestinationCard.jsx - Destination Display Card

```javascript
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isFavorite, addToFavorites, removeFromFavorites } from '../services/favoritesService';

export default function DestinationCard({ destination }) {
  // Line 5: Destructure destination properties
  const {
    id,
    name,
    country,
    description,
    images,
    avg_daily_cost,
    best_seasons,
    interests
  } = destination;

  // Lines 22-23: State for image error and favorite status
  const [imageError, setImageError] = useState(false);
  const [favorite, setFavorite] = useState(false);

  // Lines 25-27: Check if favorited when component mounts or ID changes
  useEffect(() => {
    setFavorite(isFavorite(id));
  }, [id]);

  // Lines 29-39: Toggle favorite status
  const toggleFavorite = (e) => {
    // Line 30: Prevent navigation when clicking heart
    e.preventDefault();
    // Line 31: Stop event from bubbling to parent Link
    e.stopPropagation();
    
    if (favorite) {
      // Remove from favorites
      removeFromFavorites(id);
      setFavorite(false);
    } else {
      // Add to favorites - pass full destination object
      addToFavorites(destination);
      setFavorite(true);
    }
  };

  // Lines 41-45: Image URLs with fallback
  const imageUrl = (images && images.length > 0) ? images[0] : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
  const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
  const bestTimeToVisit = best_seasons?.join(', ') || null;
  const popularActivities = interests || [];

  // Lines 47-50: Handle image load error
  const handleImageError = () => {
    console.error('Image failed to load for', name, '- URL:', imageUrl);
    setImageError(true);
  };

  // Lines 52+: Render JSX
  return (
    // Link makes entire card clickable
    <Link to={`/destination/${id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        
        {/* IMAGE SECTION */}
        <div className="relative h-56 overflow-hidden bg-gray-200">
          <img
            src={imageError ? fallbackImage : imageUrl}  // Use fallback if error
            alt={name}
            onError={handleImageError}  // Triggered if image fails to load
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"  // Lazy load images for performance
          />
          
          {/* FAVORITE BUTTON - positioned absolute in top-right */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className={`text-2xl ${favorite ? 'text-red-500' : 'text-gray-400'}`}>
              {favorite ? '❤️' : '🤍'}
            </span>
          </button>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-5">
          {/* Title and country */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                {name}
              </h3>
              <p className="text-sm text-gray-500">{country}</p>
            </div>
            {/* Price badge */}
            <div className="text-right">
              <p className="text-sm text-gray-500">from</p>
              <p className="text-lg font-bold text-blue-600">
                ${avg_daily_cost ? Math.round(avg_daily_cost) : 'N/A'}/day
              </p>
            </div>
          </div>

          {/* Description - line-clamp-2 limits to 2 lines */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Best time to visit */}
          {bestTimeToVisit && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="capitalize">Best: {bestTimeToVisit}</span>
            </div>
          )}

          {/* Interest tags */}
          {popularActivities && popularActivities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {/* Show first 3 interests */}
              {popularActivities.slice(0, 3).map((activity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize"
                >
                  {activity}
                </span>
              ))}
              {/* Show count if more than 3 */}
              {popularActivities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{popularActivities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
```

**Important Concepts**:

1. **Props**: Data passed from parent to child component
```javascript
// Parent passes data:
<DestinationCard destination={myDestination} />

// Child receives via props:
function DestinationCard({ destination }) { ... }
```

2. **Event Handling**:
```javascript
onClick={handleClick}     // Pass function reference
onClick={() => func()}    // Arrow function
onClick={(e) => func(e)}  // Pass event object
```

3. **Conditional Classes**:
```javascript
className={`base-class ${condition ? 'class-if-true' : 'class-if-false'}`}
```

---

### 15. src/components/SearchBar.jsx - Search Input Component

```javascript
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  // Line 4: Local state for input value
  const [query, setQuery] = useState('');

  // Lines 6-9: Handle input changes
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);        // Update local state (input value)
    onSearch(value);        // Call parent's callback (trigger search)
  };

  // Lines 11-14: Clear search
  const handleClear = () => {
    setQuery('');           // Clear input
    onSearch('');           // Clear search results
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={query}                    // Controlled input
        onChange={handleChange}          // Handle typing
        placeholder="Search destinations, countries, activities..."
        className="w-full pl-12 pr-12 py-4 rounded-full border-2 border-transparent focus:border-blue-300 focus:outline-none bg-white text-gray-900 shadow-lg"
      />

      {/* Clear Button - only show if there's text */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
```

**Controlled vs Uncontrolled Inputs**:

```javascript
// CONTROLLED (recommended)
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />
// React controls the input value

// UNCONTROLLED (not used here)
<input defaultValue="initial" ref={inputRef} />
// DOM controls the input value
```

---

### 16. src/components/FilterPanel.jsx - Filter Sidebar

```javascript
import { useState } from 'react';

export default function FilterPanel({ onFilterChange }) {
  // Lines 4-8: State for all filter options
  const [selectedType, setSelectedType] = useState('');
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 1000 });
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState('');

  // Lines 10-17: Update parent when any filter changes
  const updateFilters = (updates) => {
    const newFilters = {
      type: selectedType,
      budgetRange,
      activities: selectedActivities,
      continent: selectedContinent,
      ...updates  // Merge in new updates
    };
    onFilterChange(newFilters);  // Notify parent
  };

  // Lines 19-23: Handle destination type change
  const handleTypeChange = (type) => {
    setSelectedType(type);
    updateFilters({ type });
  };

  // Lines 25-29: Handle budget change
  const handleBudgetChange = (min, max) => {
    const range = { min, max };
    setBudgetRange(range);
    updateFilters({ budgetRange: range });
  };

  // Lines 31-41: Handle activity toggle
  const handleActivityToggle = (activity) => {
    let updated;
    if (selectedActivities.includes(activity)) {
      // Remove if already selected
      updated = selectedActivities.filter(a => a !== activity);
    } else {
      // Add if not selected
      updated = [...selectedActivities, activity];
    }
    setSelectedActivities(updated);
    updateFilters({ activities: updated });
  };

  // Lines 43-60: Clear all filters
  const handleClearAll = () => {
    setSelectedType('');
    setBudgetRange({ min: 0, max: 1000 });
    setSelectedActivities([]);
    setSelectedContinent('');
    onFilterChange({});  // Send empty filters to parent
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Filters</h3>
        <button
          onClick={handleClearAll}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Clear all
        </button>
      </div>

      {/* DESTINATION TYPE FILTER */}
      <div>
        <h4 className="font-semibold mb-3">Destination Type</h4>
        <div className="space-y-2">
          {['Beach Paradise', 'Mountain Retreat', 'City Adventure', 'Cultural Heritage'].map(type => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="type"
                value={type}
                checked={selectedType === type}
                onChange={() => handleTypeChange(type)}
                className="mr-2"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* BUDGET FILTER */}
      <div>
        <h4 className="font-semibold mb-3">Daily Budget</h4>
        <div className="space-y-2">
          <button
            onClick={() => handleBudgetChange(0, 100)}
            className={`w-full py-2 px-4 rounded ${budgetRange.max === 100 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Under $100
          </button>
          <button
            onClick={() => handleBudgetChange(100, 200)}
            className={`w-full py-2 px-4 rounded ${budgetRange.min === 100 && budgetRange.max === 200 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            $100 - $200
          </button>
          <button
            onClick={() => handleBudgetChange(200, 1000)}
            className={`w-full py-2 px-4 rounded ${budgetRange.min === 200 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Over $200
          </button>
        </div>
      </div>

      {/* ACTIVITIES FILTER */}
      <div>
        <h4 className="font-semibold mb-3">Activities</h4>
        <div className="space-y-2">
          {['Hiking', 'Beach', 'Culture', 'Food', 'Photography', 'Shopping', 'Nightlife'].map(activity => (
            <label key={activity} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedActivities.includes(activity.toLowerCase())}
                onChange={() => handleActivityToggle(activity.toLowerCase())}
                className="mr-2"
              />
              <span className="text-sm">{activity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Key Patterns**:

1. **Radio Buttons** (single selection):
```javascript
<input
  type="radio"
  name="group"           // Same name = only one can be selected
  checked={value === option}
  onChange={() => setValue(option)}
/>
```

2. **Checkboxes** (multiple selection):
```javascript
<input
  type="checkbox"
  checked={array.includes(item)}
  onChange={() => toggleItem(item)}
/>
```

3. **Lifting State Up**:
```javascript
// Child component doesn't store final state
// It calls parent's callback to update parent's state
onFilterChange(newFilters);  // Parent decides what to do
```

---

Continued in next file for more components...
