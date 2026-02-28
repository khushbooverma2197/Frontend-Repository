// User service - API calls for user management
import api from './api';

export const userService = {
  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Create a new user
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Get user preferences
  getUserPreferences: async (userId) => {
    const response = await api.get(`/users/${userId}/preferences`);
    return response.data;
  },

  // Update user preferences
  updateUserPreferences: async (userId, preferences) => {
    const response = await api.put(`/users/${userId}/preferences`, preferences);
    return response.data;
  }
};

export default userService;
