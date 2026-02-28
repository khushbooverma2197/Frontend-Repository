// Journal service - API calls for travel journals
import api from './api';

export const journalService = {
  // Get all public journals
  getAllJournals: async () => {
    const response = await api.get('/journals');
    return response.data;
  },

  // Get journals by user
  getJournalsByUser: async (userId) => {
    const response = await api.get(`/journals/user/${userId}`);
    return response.data;
  },

  // Get journal by ID
  getJournalById: async (id) => {
    const response = await api.get(`/journals/${id}`);
    return response.data;
  },

  // Create a new journal entry
  createJournal: async (journalData) => {
    const response = await api.post('/journals', journalData);
    return response.data;
  },

  // Update journal entry
  updateJournal: async (id, journalData) => {
    const response = await api.put(`/journals/${id}`, journalData);
    return response.data;
  },

  // Delete journal entry
  deleteJournal: async (id) => {
    const response = await api.delete(`/journals/${id}`);
    return response.data;
  }
};

export default journalService;
