// Journal service - API calls for travel journals
import api from './api';
import apiCache from '../utils/cache';

// Get all public journals
export const getAllJournals = async () => {
  const cacheKey = apiCache.generateKey('/journals');
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const response = await api.get('/journals');
  
  // Cache journals for 2 minutes (they change more frequently)
  apiCache.set(cacheKey, response.data, 2 * 60 * 1000);
  
  return response.data;
};

// Get journals by user
export const getJournalsByUser = async (userId) => {
  const response = await api.get(`/journals/user/${userId}`);
  return response.data;
};

// Get journal by ID
export const getJournalById = async (id) => {
  const cacheKey = apiCache.generateKey(`/journals/${id}`);
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const response = await api.get(`/journals/${id}`);
  
  // Cache individual journal for 5 minutes
  apiCache.set(cacheKey, response.data, 5 * 60 * 1000);
  
  return response.data;
};

// Create a new journal entry
export const createJournal = async (journalData) => {
  const response = await api.post('/journals', journalData);
  
  // Invalidate journal caches when new journal is created
  apiCache.invalidatePattern('/journals');
  
  return response.data;
};

// Update journal entry
export const updateJournal = async (id, journalData) => {
  const response = await api.put(`/journals/${id}`, journalData);
  
  // Invalidate journal caches when journal is updated
  apiCache.invalidatePattern('/journals');
  
  return response.data;
};

// Delete journal entry
export const deleteJournal = async (id) => {
  const response = await api.delete(`/journals/${id}`);
  
  // Invalidate journal caches when journal is deleted
  apiCache.invalidatePattern('/journals');
  
  return response.data;
};
