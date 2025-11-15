import axios from 'axios';

const API_URL = '/api/subscription';

// Add token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const subscriptionService = {
  getStatus: async () => {
    const response = await axios.get(`${API_URL}/status`, getAuthHeaders());
    return response.data;
  },

  getTiers: async () => {
    const response = await axios.get(`${API_URL}/tiers`);
    return response.data;
  },

  subscribe: async (tier) => {
    const response = await axios.post(
      `${API_URL}/subscribe`,
      { tier },
      getAuthHeaders()
    );
    return response.data;
  }
};

