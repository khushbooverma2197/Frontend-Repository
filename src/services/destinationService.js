// Destination service - API calls for destinations
import api from './api';
import apiCache from '../utils/cache';

// Get all destinations
export const getAllDestinations = async () => {
  const cacheKey = apiCache.generateKey('/destinations');
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Fetch from API
  const response = await api.get('/destinations');
  
  // Cache the result for 5 minutes
  apiCache.set(cacheKey, response.data, 5 * 60 * 1000);
  
  return response.data;
};

// Search destinations with filters
export const searchDestinations = async (filters) => {
  const cacheKey = apiCache.generateKey('/destinations/search', filters);
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const params = new URLSearchParams();
  if (filters.query) params.append('query', filters.query);
  if (filters.interests) params.append('interests', filters.interests);
  if (filters.climate) params.append('climate', filters.climate);
  if (filters.season) params.append('season', filters.season);
  if (filters.budget) params.append('budget', filters.budget);
  if (filters.offTheBeatenPath) params.append('offTheBeatenPath', 'true');
  
  const response = await api.get(`/destinations/search?${params.toString()}`);
  
  // Cache search results for 3 minutes
  apiCache.set(cacheKey, response.data, 3 * 60 * 1000);
  
  return response.data;
};

// Get personalized recommendations
export const getRecommendations = async (interests) => {
  const response = await api.post('/destinations/recommendations', { interests });
  return response.data;
};

// Get destination by ID
export const getDestinationById = async (id) => {
  const cacheKey = apiCache.generateKey(`/destinations/${id}`);
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const response = await api.get(`/destinations/${id}`);
  
  // Cache destination details for 10 minutes
  apiCache.set(cacheKey, response.data, 10 * 60 * 1000);
  
  return response.data;
};

// Get budget estimate
export const calculateBudget = async ({ destinationId, days, people, accommodationType, includeFlight }) => {
  const cacheKey = apiCache.generateKey(`/destinations/${destinationId}/budget`, {
    days, people, accommodationType, includeFlight
  });
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const params = new URLSearchParams();
  if (days) params.append('days', days);
  if (people) params.append('people', people);
  if (accommodationType) params.append('accommodationType', accommodationType);
  if (includeFlight !== undefined) params.append('includeFlight', includeFlight);
  
  const response = await api.get(`/destinations/${destinationId}/budget?${params.toString()}`);
  
  // Cache budget calculations for 15 minutes (they rarely change)
  apiCache.set(cacheKey, response.data, 15 * 60 * 1000);
  
  return response.data;
};

// Create destination (admin)
export const createDestination = async (destinationData, token) => {
  const response = await api.post('/destinations', destinationData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update destination (admin)
export const updateDestination = async (id, destinationData, token) => {
  const response = await api.put(`/destinations/${id}`, destinationData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Delete destination (admin)
export const deleteDestination = async (id, token) => {
  const response = await api.delete(`/destinations/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
