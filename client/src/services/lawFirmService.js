import axios from 'axios';

const API_URL = '/api/lawfirms';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const lawFirmService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}`, getAuthHeaders());
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  getBySettlement: async (settlementId) => {
    const response = await axios.get(`${API_URL}/settlement/${settlementId}`, getAuthHeaders());
    return response.data;
  },

  getUpdates: async (lawFirmId) => {
    const response = await axios.get(`${API_URL}/${lawFirmId}/updates`, getAuthHeaders());
    return response.data;
  },

  contact: async (lawFirmId, subject, message, settlementId) => {
    const response = await axios.post(
      `${API_URL}/${lawFirmId}/contact`,
      { subject, message, settlementId },
      getAuthHeaders()
    );
    return response.data;
  },

  checkPartnership: async (settlementId) => {
    const response = await axios.get(`${API_URL}/settlement/${settlementId}/check`, getAuthHeaders());
    return response.data;
  }
};

