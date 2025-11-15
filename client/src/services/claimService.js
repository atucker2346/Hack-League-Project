import axios from 'axios';

const API_URL = '/api/claims';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const claimService = {
  detectEligibility: async (settlementId) => {
    const response = await axios.post(
      `${API_URL}/detect`,
      { settlementId },
      getAuthHeaders()
    );
    return response.data;
  },

  getAutofill: async (settlementId) => {
    const response = await axios.post(
      `${API_URL}/autofill`,
      { settlementId },
      getAuthHeaders()
    );
    return response.data;
  },

  previewClaim: async (confirmedData) => {
    const response = await axios.post(
      `${API_URL}/preview`,
      { confirmedData },
      getAuthHeaders()
    );
    return response.data;
  }
};

