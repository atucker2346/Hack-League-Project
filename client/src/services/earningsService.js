import axios from 'axios';

const API_URL = '/api/earnings';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const earningsService = {
  getTotalEarnings: async () => {
    try {
      const response = await axios.get(`${API_URL}/total`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Failed to load earnings:', error);
      // Return default values if endpoint fails
      return {
        totalEarnings: 0,
        pendingClaims: 0,
        completedClaims: 0,
        potentialEarnings: 0,
        recentEarnings: []
      };
    }
  }
};

