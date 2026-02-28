// Review service - API calls for reviews
import api from './api';
import apiCache from '../utils/cache';

// Get all reviews
export const getAllReviews = async () => {
  const cacheKey = apiCache.generateKey('/reviews');
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const response = await api.get('/reviews');
  
  // Cache reviews for 3 minutes
  apiCache.set(cacheKey, response.data, 3 * 60 * 1000);
  
  return response.data;
};

// Get reviews for a specific destination
export const getReviewsByDestination = async (destinationId) => {
  const cacheKey = apiCache.generateKey(`/reviews/destination/${destinationId}`);
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const response = await api.get(`/reviews/destination/${destinationId}`);
  
  // Cache destination reviews for 5 minutes
  apiCache.set(cacheKey, response.data, 5 * 60 * 1000);
  
  return response.data;
};

// Create a new review
export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  
  // Invalidate review caches when new review is created
  apiCache.invalidatePattern('/reviews');
  
  return response.data;
};

// Update a review
export const updateReview = async (id, reviewData) => {
  const response = await api.put(`/reviews/${id}`, reviewData);
  
  // Invalidate review caches when review is updated
  apiCache.invalidatePattern('/reviews');
  
  return response.data;
};

// Delete a review
export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  
  // Invalidate review caches when review is deleted
  apiCache.invalidatePattern('/reviews');
  
  return response.data;
};
