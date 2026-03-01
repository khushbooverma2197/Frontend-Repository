# Code Explanation - File by File

## 📁 Backend Files Explained

### 1. server.js - Main Server Entry Point

```javascript
// Line 1: Load environment variables from .env file
require('dotenv').config();

// Lines 2-3: Import Express framework and CORS middleware
const express = require('express');
const cors = require('cors');

// Lines 5-7: Import route files
const destinationRoutes = require('./routes/destination.routes');
const reviewRoutes = require('./routes/review.routes');
const journalRoutes = require('./routes/journal.routes');

// Line 9: Import error handling middleware
const errorHandler = require('./middleware/error.middleware');

// Line 11: Create Express application instance
const app = express();

// Line 12: Set port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Line 15: Enable CORS - allows frontend to make requests from different origin
app.use(cors());

// Line 16: Parse JSON request bodies - converts JSON strings to JavaScript objects
app.use(express.json());

// Lines 19-21: Mount route handlers at specific paths
// When request comes to /api/destinations, use destinationRoutes
app.use('/api/destinations', destinationRoutes);
// When request comes to /api/reviews, use reviewRoutes
app.use('/api/reviews', reviewRoutes);
// When request comes to /api/journals, use journalRoutes
app.use('/api/journals', journalRoutes);

// Lines 24-26: Health check endpoint - returns server status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Line 29: Error handler middleware - must be registered last
// Catches all errors from routes and controllers
app.use(errorHandler);

// Lines 32-34: Start server and listen on specified port
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

**What this file does**:
- Sets up Express web server
- Configures middleware (CORS, JSON parsing)
- Connects route handlers
- Starts server listening on port

---

### 2. config/supabase.js - Database Connection

```javascript
// Line 1: Import Supabase client library
const { createClient } = require('@supabase/supabase-js');

// Lines 3-4: Get connection details from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Line 6: Create Supabase client instance
// This object will be used to make all database queries
const supabase = createClient(supabaseUrl, supabaseKey);

// Line 8: Export so other files can import and use
module.exports = supabase;
```

**What this file does**:
- Connects to Supabase database
- Provides database client to entire application
- Configured once, used everywhere

**How to use in other files**:
```javascript
const supabase = require('./config/supabase');
const { data, error } = await supabase.from('destinations').select('*');
```

---

### 3. models/destination.model.js - Database Queries

```javascript
// Line 1: Import database client
const supabase = require('../config/supabase');

// Line 3: Define DestinationModel class
class DestinationModel {
  
  // Line 5: Static method to get all destinations
  // 'static' means you call it on the class, not an instance
  // DestinationModel.getAll() not new DestinationModel().getAll()
  static async getAll(filters = {}) {
    // Line 7: Start building query - select all columns from destinations table
    let query = supabase.from('destinations').select('*');
    
    // Lines 9-18: Apply optional filters
    // If filter.continent exists, add WHERE clause
    if (filters.continent) {
      query = query.eq('continent', filters.continent);
      // eq = equals, generates: WHERE continent = 'Asia'
    }
    
    if (filters.minCost) {
      query = query.gte('avg_daily_cost', filters.minCost);
      // gte = greater than or equal, WHERE avg_daily_cost >= 50
    }
    
    if (filters.maxCost) {
      query = query.lte('avg_daily_cost', filters.maxCost);
      // lte = less than or equal, WHERE avg_daily_cost <= 200
    }
    
    // Line 20: Execute query
    const { data, error } = await query;
    
    // Line 21: If error, throw it (will be caught by controller)
    if (error) throw error;
    
    // Line 22: Return data array
    return data;
  }

  // Line 26: Get single destination by ID
  static async getById(id) {
    // Line 27-30: Query with WHERE id = ? and expect single result
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single(); // single() means expect exactly one row
    
    if (error) throw error;
    return data;
  }

  // Line 36: Search destinations by keyword
  static async search(searchTerm) {
    // Line 37-39: Search in multiple columns using OR
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      // ilike = case-insensitive LIKE, %term% = contains
      .or(`name.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    
    if (error) throw error;
    return data;
  }
}

// Line 47: Export class
module.exports = DestinationModel;
```

**What this file does**:
- Defines all database queries for destinations
- Separates database logic from business logic
- Returns raw database results (snake_case)

---

### 4. utils/formatDestination.js - Data Transformation

```javascript
// Line 1: Function to convert database format to API format
const formatDestination = (destination) => {
  // Line 2: Guard clause - if null/undefined, return null
  if (!destination) return null;
  
  // Lines 4-15: Create new object with camelCase keys
  return {
    id: destination.id,                    // Keep same
    name: destination.name,                // Keep same
    country: destination.country,          // Keep same
    continent: destination.continent,      // Keep same
    description: destination.description,  // Keep same
    images: destination.images || [],      // Convert null to empty array
    bestSeasons: destination.best_seasons || [],  // snake_case → camelCase
    avgDailyCost: destination.avg_daily_cost,     // snake_case → camelCase
    interests: destination.interests || [],
    createdAt: destination.created_at,      // snake_case → camelCase
    updatedAt: destination.updated_at       // snake_case → camelCase
  };
};

// Line 18: Export function
module.exports = formatDestination;
```

**Why this is needed**:
- Database uses `snake_case` (SQL standard)
- JavaScript uses `camelCase` (JS standard)
- Frontend expects `avgDailyCost` not `avg_daily_cost`
- This function converts between the two

**Example transformation**:
```javascript
// Database returns:
{
  id: 1,
  name: "Bali",
  avg_daily_cost: 75,
  best_seasons: ["summer", "fall"]
}

// formatDestination() converts to:
{
  id: 1,
  name: "Bali",
  avgDailyCost: 75,
  bestSeasons: ["summer", "fall"]
}
```

---

### 5. utils/cache.js - In-Memory Caching

```javascript
// Line 1: Create Map to store cached data
const cache = new Map();

// Lines 3-13: Get item from cache
const get = (key) => {
  // Line 4: Try to retrieve item
  const item = cache.get(key);
  
  // Line 5-6: If not found, return null
  if (!item) return null;
  
  // Line 8-11: Check if expired
  if (Date.now() > item.expiry) {
    // If expired, delete from cache
    cache.delete(key);
    return null;
  }
  
  // Line 13: Return cached data
  return item.data;
};

// Lines 15-21: Save item to cache
const set = (key, data, ttl) => {
  cache.set(key, {
    data: data,                    // The actual data
    expiry: Date.now() + ttl       // Expiry timestamp (now + time-to-live)
  });
};

// Lines 23-25: Clear specific item
const clear = (key) => {
  cache.delete(key);
};

// Lines 27-29: Clear all items
const clearAll = () => {
  cache.clear();
};

// Line 31: Export functions
module.exports = { get, set, clear, clearAll };
```

**How it works**:
```javascript
// Save to cache (10 minutes)
cache.set('destinations:all', data, 10 * 60 * 1000);

// Get from cache (later)
const cached = cache.get('destinations:all');
if (cached) {
  return cached; // Fast! No database query
}
// If not cached or expired, query database
```

**Benefits**:
- First request: Slow (database query)
- Next requests: Fast (returns cached data)
- After 10 minutes: Expired, queries database again
- Reduces database load significantly

---

### 6. controllers/destination.controller.js - Business Logic

```javascript
// Lines 1-3: Import dependencies
const DestinationModel = require('../models/destination.model');
const formatDestination = require('../utils/formatDestination');
const cache = require('../utils/cache');

// Line 5: Cache Time-To-Live = 10 minutes in milliseconds
const CACHE_TTL = 10 * 60 * 1000;

// Line 7: Define controller class
class DestinationController {
  
  // Line 9: Get all destinations handler
  // req = request object (contains query params, body, etc)
  // res = response object (use to send data back)
  // next = function to call next middleware (for errors)
  static async getAll(req, res, next) {
    try {
      // Line 11: Create cache key
      const cacheKey = 'destinations:all';
      
      // Line 12: Try to get from cache
      const cached = cache.get(cacheKey);
      
      // Line 14-16: If cache hit, return immediately
      if (cached) {
        return res.json(cached);
      }

      // Line 18: Cache miss - query database
      // req.query = URL parameters like ?continent=Asia&minCost=50
      const destinations = await DestinationModel.getAll(req.query);
      
      // Line 19: Convert each destination to camelCase
      const formatted = destinations.map(formatDestination);
      
      // Line 21: Save to cache for next time
      cache.set(cacheKey, formatted, CACHE_TTL);
      
      // Line 22: Send JSON response
      res.json(formatted);
    } catch (error) {
      // Line 24: Pass error to error middleware
      next(error);
    }
  }

  // Line 28: Get single destination by ID
  static async getById(req, res, next) {
    try {
      // Line 30: Get ID from URL parameter (/api/destinations/123)
      const { id } = req.params;
      
      // Line 31: Create unique cache key for this destination
      const cacheKey = `destination:${id}`;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        return res.json(cached);
      }

      // Line 38: Query database
      const destination = await DestinationModel.getById(id);
      
      // Line 39-41: If not found, return 404
      if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
      }
      
      // Line 43: Format and cache
      const formatted = formatDestination(destination);
      cache.set(cacheKey, formatted, CACHE_TTL);
      
      // Line 45: Return destination
      res.json(formatted);
    } catch (error) {
      next(error);
    }
  }

  // Line 51: Search destinations
  static async search(req, res, next) {
    try {
      // Line 53: Get search query from URL (?q=bali)
      const { q } = req.query;
      
      // Line 54-56: Validate query exists
      if (!q) {
        return res.status(400).json({ error: 'Search query required' });
      }

      // Line 58: Search database (no cache - always fresh)
      const destinations = await DestinationModel.search(q);
      const formatted = destinations.map(formatDestination);
      res.json(formatted);
    } catch (error) {
      next(error);
    }
  }
}

// Line 67: Export controller
module.exports = DestinationController;
```

**Request/Response Flow**:
```
Client → GET /api/destinations
        ↓
server.js routes to destinationRoutes
        ↓
destinationRoutes calls DestinationController.getAll()
        ↓
Controller checks cache
        ↓
If cached: return cached data
If not: query database → format → cache → return
        ↓
Client receives JSON array of destinations
```

---

### 7. routes/destination.routes.js - API Routes

```javascript
// Lines 1-2: Import Express Router and controller
const express = require('express');
const router = express.Router();
const DestinationController = require('../controllers/destination.controller');

// Line 6: Define GET route at base path
// Full path: /api/destinations
// Calls: DestinationController.getAll()
router.get('/', DestinationController.getAll);

// Line 9: Define search route
// Full path: /api/destinations/search?q=bali
// Must be BEFORE /:id route (otherwise 'search' matches as ID)
router.get('/search', DestinationController.search);

// Line 12: Define GET by ID route
// Full path: /api/destinations/123
// :id is a parameter, accessible via req.params.id
router.get('/:id', DestinationController.getById);

// Line 15: Export router
module.exports = router;
```

**Route Order Matters**:
```javascript
// CORRECT order:
router.get('/search', ...);  // Specific route first
router.get('/:id', ...);     // Dynamic route second

// WRONG order:
router.get('/:id', ...);     // This would match '/search' as id='search'
router.get('/search', ...);  // This would never be reached
```

---

### 8. middleware/error.middleware.js - Error Handling

```javascript
// Lines 1-2: Define error handler function
// Has 4 parameters (err, req, res, next) - Express recognizes as error handler
const errorHandler = (err, req, res, next) => {
  // Line 3: Log error to console for debugging
  console.error('Error:', err);

  // Lines 5-10: Check if Supabase error (has error code)
  if (err.code) {
    return res.status(400).json({
      error: 'Database error',
      message: err.message
    });
  }

  // Lines 12-15: Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

// Line 18: Export error handler
module.exports = errorHandler;
```

**How error handling works**:
```javascript
// In controller:
try {
  const data = await Model.getData();
  res.json(data);
} catch (error) {
  next(error);  // Passes to error middleware
}

// Error middleware catches it:
errorHandler(error, req, res, next)
// Logs error
// Sends appropriate response to client
```

---

## 📁 Frontend Files Explained

### 9. src/App.jsx - Main Application Component

```javascript
// Lines 1-2: Import React Router components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lines 3-13: Import all page components
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DestinationDetailPage from './pages/DestinationDetailPage';
// ... more imports

// Line 15: Define main App component
function App() {
  // Line 16: Return JSX
  return (
    // Line 17: Router wraps everything - enables routing
    <Router>
      {/* Line 18: Main container */}
      <div className="min-h-screen bg-gray-50">
        {/* Line 19: Navigation appears on all pages */}
        <Navigation />
        
        {/* Line 20: Routes container - only one route shown at a time */}
        <Routes>
          {/* Line 21: Home route - exact match "/" */}
          <Route path="/" element={<HomePage />} />
          
          {/* Line 22: Dynamic route - :id is parameter */}
          <Route path="/destination/:id" element={<DestinationDetailPage />} />
          
          {/* Line 23-30: More routes... */}
          <Route path="/trip-planner" element={<TripPlannerPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/budget" element={<BudgetPlannerPage />} />
          <Route path="/journals" element={<JournalsPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Line 35: Export App component
export default App;
```

**How routing works**:
- User visits `/` → HomePage renders
- User visits `/destination/123` → DestinationDetailPage renders with id=123
- User visits `/trip-planner` → TripPlannerPage renders
- Navigation stays visible, only content area changes

---

### 10. src/services/api.js - API Client Setup

```javascript
// Line 1: Import axios HTTP library
import axios from 'axios';

// Lines 3-4: Get API URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Lines 5-11: Create configured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,           // Prefix all requests with this
  timeout: 10000,                  // Fail after 10 seconds
  headers: {
    'Content-Type': 'application/json'  // Send JSON by default
  }
});

// Lines 13-22: Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;  // Must return config
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Lines 24-33: Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    // Success - just return response
    return response;
  },
  (error) => {
    // Log errors
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);  // Pass error up
  }
);

// Line 35: Export configured API client
export default api;
```

**How to use**:
```javascript
import api from './api';

// GET request
const response = await api.get('/destinations');
// Actual URL: http://localhost:5000/api/destinations

// POST request
const response = await api.post('/reviews', { rating: 5, content: 'Great!' });
// Sends JSON automatically
```

---

### 11. src/services/destinationService.js - Destination API Calls

```javascript
// Line 1: Import configured API client
import api from './api';

// Lines 3-6: Get all destinations
export const getAllDestinations = async () => {
  // Make GET request
  const response = await api.get('/destinations');
  // Return just the data, not the full response object
  return response.data;
};

// Lines 8-11: Get single destination by ID
export const getDestinationById = async (id) => {
  const response = await api.get(`/destinations/${id}`);
  return response.data;
};

// Lines 13-18: Search destinations
export const searchDestinations = async (query) => {
  const response = await api.get('/destinations/search', {
    params: { q: query }  // Adds ?q=query to URL
  });
  return response.data;
};
```

**Usage in components**:
```javascript
import { getAllDestinations, getDestinationById } from './services/destinationService';

// In component:
const destinations = await getAllDestinations();
// Returns array: [{ id: 1, name: 'Bali', ... }, ...]

const destination = await getDestinationById(123);
// Returns object: { id: 123, name: 'Bali', ... }
```

---

### 12. src/services/favoritesService.js - LocalStorage for Favorites

```javascript
// Line 1: Define localStorage key constant
const FAVORITES_KEY = 'travelFavorites';

// Lines 3-6: Get favorites from localStorage
export const getFavorites = () => {
  // Get string from localStorage
  const favorites = localStorage.getItem(FAVORITES_KEY);
  // Parse JSON string to array, or return empty array if null
  return favorites ? JSON.parse(favorites) : [];
};

// Lines 8-23: Add destination to favorites
export const addToFavorites = (destination) => {
  // Line 9: Get current favorites
  const favorites = getFavorites();
  
  // Line 10-19: Check if already in favorites
  if (!favorites.find(fav => fav.id === destination.id)) {
    // Not in favorites - add it
    favorites.push({
      id: destination.id,
      name: destination.name,
      country: destination.country,
      images: destination.images,
      avg_daily_cost: destination.avg_daily_cost,
      addedAt: new Date().toISOString()  // Add timestamp
    });
    // Save updated array back to localStorage
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
};

// Lines 25-30: Remove from favorites
export const removeFromFavorites = (destinationId) => {
  const favorites = getFavorites();
  // Filter out the destination with matching ID
  const updated = favorites.filter(fav => fav.id !== destinationId);
  // Save updated array
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};

// Lines 32-36: Check if destination is favorited
export const isFavorite = (destinationId) => {
  const favorites = getFavorites();
  // Return true if found, false if not
  return favorites.some(fav => fav.id === destinationId);
};
```

**LocalStorage Explained**:
```javascript
// Saving data
localStorage.setItem('key', 'value');  // value must be string

// Getting data
const value = localStorage.getItem('key');  // Returns string or null

// For objects/arrays - use JSON
localStorage.setItem('favorites', JSON.stringify([1, 2, 3]));  // "[1,2,3]"
const data = JSON.parse(localStorage.getItem('favorites'));    // [1, 2, 3]
```

**Benefits**:
- Data persists between sessions
- Works offline
- No server needed
- Instant access

---

Continued in next file...
