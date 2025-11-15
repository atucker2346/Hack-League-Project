import axios from 'axios';

const API_URL = '/api/settlements';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const settlementService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}`, getAuthHeaders());
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  }
};

