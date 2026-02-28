// Destination service - API calls for destinations
import api from './api';

export const destinationService = {
  // Get all destinations
  getAllDestinations: async () => {
    const response = await api.get('/destinations');
    return response.data;
  },

  // Search destinations with filters
  searchDestinations: async (filters) => {
    const params = new URLSearchParams();
    if (filters.interests) params.append('interests', filters.interests);
    if (filters.climate) params.append('climate', filters.climate);
    if (filters.season) params.append('season', filters.season);
    if (filters.budget) params.append('budget', filters.budget);
    if (filters.offTheBeatenPath) params.append('offTheBeatenPath', 'true');
    
    const response = await api.get(`/destinations/search?${params.toString()}`);
    return response.data;
  },

  // Get personalized recommendations
  getRecommendations: async (interests) => {
    const response = await api.post('/destinations/recommendations', { interests });
    return response.data;
  },

  // Get destination by ID
  getDestinationById: async (id) => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },

  // Get budget estimate
  getBudgetEstimate: async (destinationId, duration = 7, travelers = 1) => {
    const response = await api.get(
      `/destinations/${destinationId}/budget?duration=${duration}&travelers=${travelers}`
    );
    return response.data;
  },

  // Create destination (admin)
  createDestination: async (destinationData, token) => {
    const response = await api.post('/destinations', destinationData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update destination (admin)
  updateDestination: async (id, destinationData, token) => {
    const response = await api.put(`/destinations/${id}`, destinationData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Delete destination (admin)
  deleteDestination: async (id, token) => {
    const response = await api.delete(`/destinations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default destinationService;
