# Travel Inspiration Platform - Complete Project Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
4. [Project Architecture](#project-architecture)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Application Workflow](#application-workflow)
8. [Key Features Explained](#key-features-explained)

---

## 🎯 Project Overview

**Travel Inspiration Platform** is a full-stack web application that helps users:
- Discover travel destinations worldwide
- Plan multi-destination trips with itinerary builder
- Track travel budgets and costs
- Write and share travel journals
- Get personalized recommendations
- Find exclusive travel deals
- Connect with travel community

### Project Structure
```
Project/
├── Backend-Repository/          # Node.js + Express API
│   ├── server.js               # Main server file
│   ├── config/                 # Configuration files
│   ├── controllers/            # Business logic
│   ├── middleware/             # Auth & error handling
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   └── utils/                  # Helper functions
│
└── Frontend-Repository/         # React + Vite application
    └── src/
        ├── App.jsx             # Main app component
        ├── components/         # Reusable UI components
        ├── pages/              # Page components
        ├── services/           # API & localStorage services
        ├── context/            # React Context API
        ├── hooks/              # Custom React hooks
        └── utils/              # Helper functions
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js v24.12.0
- **Framework**: Express.js 4.18.2
- **Database**: PostgreSQL (via Supabase)
- **CORS**: For cross-origin requests
- **Deployment**: Render.com

### Frontend
- **Library**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.20.0
- **Styling**: Tailwind CSS 3.3.6
- **HTTP Client**: Axios 1.6.2
- **Deployment**: Vercel

### Database
- **Provider**: Supabase (PostgreSQL)
- **Tables**: destinations, users, reviews, journals
- **Naming Convention**: snake_case

---

## 📝 Step-by-Step Setup Guide

### Phase 1: Initial Setup (Day 1)

#### Step 1: Create Project Structure
```bash
# Create main project folder
mkdir Travel-Platform
cd Travel-Platform

# Create backend
mkdir Backend-Repository
cd Backend-Repository
npm init -y

# Create frontend
cd ..
mkdir Frontend-Repository
cd Frontend-Repository
npm create vite@latest . -- --template react
```

#### Step 2: Install Backend Dependencies
```bash
cd Backend-Repository
npm install express cors dotenv @supabase/supabase-js
npm install --save-dev nodemon
```

#### Step 3: Install Frontend Dependencies
```bash
cd Frontend-Repository
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Step 4: Setup Supabase Database
1. Go to https://supabase.com
2. Create new project
3. Create tables with SQL:

```sql
-- Destinations Table
CREATE TABLE destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  continent VARCHAR(100),
  description TEXT,
  images TEXT[],
  best_seasons TEXT[],
  avg_daily_cost DECIMAL(10,2),
  interests TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  destination_id INTEGER REFERENCES destinations(id),
  user_id INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Journals Table
CREATE TABLE journals (
  id SERIAL PRIMARY KEY,
  destination_id INTEGER REFERENCES destinations(id),
  user_id INTEGER,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  photos TEXT[],
  highlights TEXT[],
  rating INTEGER,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

5. Get your Supabase URL and API Key from Project Settings

### Phase 2: Backend Development (Day 2-3)

#### Step 5: Create Backend Configuration

**File: Backend-Repository/.env**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=5000
```

**File: Backend-Repository/config/supabase.js**
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
```

#### Step 6: Create Utility Functions

**File: Backend-Repository/utils/formatDestination.js**
```javascript
// Converts snake_case from database to camelCase for frontend
const formatDestination = (destination) => {
  if (!destination) return null;
  
  return {
    id: destination.id,
    name: destination.name,
    country: destination.country,
    continent: destination.continent,
    description: destination.description,
    images: destination.images || [],
    bestSeasons: destination.best_seasons || [],
    avgDailyCost: destination.avg_daily_cost,
    interests: destination.interests || [],
    createdAt: destination.created_at,
    updatedAt: destination.updated_at
  };
};

module.exports = formatDestination;
```

#### Step 7: Create Models

**File: Backend-Repository/models/destination.model.js**
```javascript
const supabase = require('../config/supabase');

class DestinationModel {
  // Get all destinations with optional filters
  static async getAll(filters = {}) {
    let query = supabase.from('destinations').select('*');
    
    // Apply filters if provided
    if (filters.continent) {
      query = query.eq('continent', filters.continent);
    }
    if (filters.minCost) {
      query = query.gte('avg_daily_cost', filters.minCost);
    }
    if (filters.maxCost) {
      query = query.lte('avg_daily_cost', filters.maxCost);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Get single destination by ID
  static async getById(id) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Search destinations
  static async search(searchTerm) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    
    if (error) throw error;
    return data;
  }
}

module.exports = DestinationModel;
```

#### Step 8: Create Controllers

**File: Backend-Repository/controllers/destination.controller.js**
```javascript
const DestinationModel = require('../models/destination.model');
const formatDestination = require('../utils/formatDestination');
const cache = require('../utils/cache');

// Cache TTL: 10 minutes
const CACHE_TTL = 10 * 60 * 1000;

class DestinationController {
  // Get all destinations
  static async getAll(req, res, next) {
    try {
      const cacheKey = 'destinations:all';
      const cached = cache.get(cacheKey);
      
      if (cached) {
        return res.json(cached);
      }

      const destinations = await DestinationModel.getAll(req.query);
      const formatted = destinations.map(formatDestination);
      
      cache.set(cacheKey, formatted, CACHE_TTL);
      res.json(formatted);
    } catch (error) {
      next(error);
    }
  }

  // Get destination by ID
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const cacheKey = `destination:${id}`;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        return res.json(cached);
      }

      const destination = await DestinationModel.getById(id);
      if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
      }
      
      const formatted = formatDestination(destination);
      cache.set(cacheKey, formatted, CACHE_TTL);
      res.json(formatted);
    } catch (error) {
      next(error);
    }
  }

  // Search destinations
  static async search(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Search query required' });
      }

      const destinations = await DestinationModel.search(q);
      const formatted = destinations.map(formatDestination);
      res.json(formatted);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DestinationController;
```

#### Step 9: Create Routes

**File: Backend-Repository/routes/destination.routes.js**
```javascript
const express = require('express');
const router = express.Router();
const DestinationController = require('../controllers/destination.controller');

// GET /api/destinations - Get all destinations
router.get('/', DestinationController.getAll);

// GET /api/destinations/search - Search destinations
router.get('/search', DestinationController.search);

// GET /api/destinations/:id - Get single destination
router.get('/:id', DestinationController.getById);

module.exports = router;
```

#### Step 10: Create Middleware

**File: Backend-Repository/middleware/error.middleware.js**
```javascript
// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Supabase errors
  if (err.code) {
    return res.status(400).json({
      error: 'Database error',
      message: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
```

#### Step 11: Create Main Server File

**File: Backend-Repository/server.js**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const destinationRoutes = require('./routes/destination.routes');
const reviewRoutes = require('./routes/review.routes');
const journalRoutes = require('./routes/journal.routes');

// Import middleware
const errorHandler = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/journals', journalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

#### Step 12: Update package.json Scripts

**File: Backend-Repository/package.json**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Phase 3: Frontend Development (Day 4-7)

#### Step 13: Setup Tailwind CSS

**File: Frontend-Repository/tailwind.config.js**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**File: Frontend-Repository/src/index.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Step 14: Create API Service

**File: Frontend-Repository/src/services/api.js**
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
```

#### Step 15: Create Destination Service

**File: Frontend-Repository/src/services/destinationService.js**
```javascript
import api from './api';

export const getAllDestinations = async () => {
  const response = await api.get('/destinations');
  return response.data;
};

export const getDestinationById = async (id) => {
  const response = await api.get(`/destinations/${id}`);
  return response.data;
};

export const searchDestinations = async (query) => {
  const response = await api.get('/destinations/search', {
    params: { q: query }
  });
  return response.data;
};
```

#### Step 16: Create localStorage Services

**File: Frontend-Repository/src/services/favoritesService.js**
```javascript
const FAVORITES_KEY = 'travelFavorites';

export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const addToFavorites = (destination) => {
  const favorites = getFavorites();
  if (!favorites.find(fav => fav.id === destination.id)) {
    favorites.push({
      id: destination.id,
      name: destination.name,
      country: destination.country,
      images: destination.images,
      avg_daily_cost: destination.avg_daily_cost,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
};

export const removeFromFavorites = (destinationId) => {
  const favorites = getFavorites();
  const updated = favorites.filter(fav => fav.id !== destinationId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};

export const isFavorite = (destinationId) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === destinationId);
};
```

#### Step 17: Create Reusable Components

**File: Frontend-Repository/src/components/DestinationCard.jsx**
```javascript
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isFavorite, addToFavorites, removeFromFavorites } from '../services/favoritesService';

export default function DestinationCard({ destination }) {
  const [imageError, setImageError] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(destination.id));
  }, [destination.id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(destination.id);
      setFavorite(false);
    } else {
      addToFavorites(destination);
      setFavorite(true);
    }
  };

  const imageUrl = destination.images?.[0] || 'fallback-image-url';

  return (
    <Link to={`/destination/${destination.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        {/* Image with favorite button */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageError ? 'fallback-url' : imageUrl}
            alt={destination.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
          >
            <span className={`text-2xl ${favorite ? 'text-red-500' : 'text-gray-400'}`}>
              {favorite ? '❤️' : '🤍'}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800">{destination.name}</h3>
          <p className="text-sm text-gray-500">{destination.country}</p>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {destination.description}
          </p>
          <p className="text-lg font-bold text-blue-600 mt-3">
            ${Math.round(destination.avgDailyCost)}/day
          </p>
        </div>
      </div>
    </Link>
  );
}
```

#### Step 18: Create Page Components

**File: Frontend-Repository/src/pages/HomePage.jsx**
```javascript
import { useState, useEffect } from 'react';
import { getAllDestinations } from '../services/destinationService';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import DestinationList from '../components/DestinationList';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl text-center mb-8">
            Explore breathtaking destinations worldwide
          </p>
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <FilterPanel onFilterChange={setFilters} />
          <div className="lg:col-span-3">
            <DestinationList filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Step 19: Setup Routing

**File: Frontend-Repository/src/App.jsx**
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import TripPlannerPage from './pages/TripPlannerPage';
import MyTripsPage from './pages/MyTripsPage';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import JournalsPage from './pages/JournalsPage';
import PreferencesPage from './pages/PreferencesPage';
import DealsPage from './pages/DealsPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destination/:id" element={<DestinationDetailPage />} />
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

export default App;
```

### Phase 4: Deployment (Day 8)

#### Step 20: Deploy Backend to Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: travel-platform-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
```

2. Push to GitHub
3. Connect to Render.com
4. Add environment variables
5. Deploy!

#### Step 21: Deploy Frontend to Vercel

1. Create `.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

2. Push to GitHub
3. Connect to Vercel
4. Deploy!

---

## 🏗️ Project Architecture

### Data Flow

```
User Browser
    ↓
React Components (UI)
    ↓
Services Layer (API calls)
    ↓
Axios HTTP Client
    ↓
Backend API (Express)
    ↓
Controllers (Business Logic)
    ↓
Models (Database Queries)
    ↓
Supabase (PostgreSQL)
```

### State Management

1. **Server State**: API data (destinations, reviews, journals)
2. **Client State**: React useState/useEffect
3. **Persistent State**: localStorage (favorites, trips, preferences)
4. **URL State**: React Router (current page, destination ID)

---

## 📊 Database Schema

### destinations
- **id**: Primary key
- **name**: Destination name
- **country**: Country name
- **continent**: Continent
- **description**: Long description
- **images**: Array of image URLs
- **best_seasons**: Array of seasons
- **avg_daily_cost**: Average daily cost
- **interests**: Array of interest tags

### reviews
- **id**: Primary key
- **destination_id**: Foreign key to destinations
- **user_id**: User who wrote review
- **rating**: 1-5 stars
- **content**: Review text
- **created_at**: Timestamp

### journals
- **id**: Primary key
- **destination_id**: Foreign key to destinations
- **user_id**: User who wrote journal
- **title**: Journal title
- **content**: Journal text
- **photos**: Array of photo URLs
- **highlights**: Array of highlights
- **rating**: 1-5 stars
- **is_public**: Boolean

---

## 🔌 API Endpoints

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get single destination
- `GET /api/destinations/search?q=term` - Search destinations

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/destination/:id` - Get reviews for destination
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Journals
- `GET /api/journals` - Get all journals
- `GET /api/journals/public` - Get public journals
- `GET /api/journals/:id` - Get single journal
- `POST /api/journals` - Create journal
- `PUT /api/journals/:id` - Update journal
- `DELETE /api/journals/:id` - Delete journal

---

This guide covers the foundation. See the next file for detailed workflow and feature explanations!
