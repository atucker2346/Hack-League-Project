import axios from 'axios';

const API_URL = '/api/questionnaire';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const questionnaireService = {
  submit: async (answers) => {
    const response = await axios.post(
      `${API_URL}/submit`,
      { answers },
      getAuthHeaders()
    );
    return response.data;
  },

  getMatches: async () => {
    const response = await axios.get(`${API_URL}/matches`, getAuthHeaders());
    return response.data;
  }
};

