import axios from 'axios';

const API_URL = '/api/auth';

export const authService = {
  register: async (email, password, name) => {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      password,
      name
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return response.data;
  }
};

