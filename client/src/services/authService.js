import axios from 'axios';

const API_URL = '/api/auth';

// Demo credentials fallback for when API is not available
const DEMO_USER = {
  email: 'demo@example.com',
  password: 'password',
  user: {
    id: 1,
    email: 'demo@example.com',
    name: 'Kennedy',
    subscriptionTier: 'premium'
  },
  token: 'demo-token-' + Date.now()
};

export const authService = {
  register: async (email, password, name) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        name
      });
      return response.data;
    } catch (error) {
      // If API fails, allow demo registration as fallback
      if (error.code === 'ERR_NETWORK' || !error.response) {
        return {
          user: {
            id: Date.now(),
            email,
            name,
            subscriptionTier: 'free'
          },
          token: 'demo-token-' + Date.now()
        };
      }
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      // If API fails or is unavailable, allow demo login as fallback
      if ((error.code === 'ERR_NETWORK' || !error.response) && 
          email === DEMO_USER.email && 
          password === DEMO_USER.password) {
        return DEMO_USER;
      }
      // If API is available but credentials are wrong, throw the error
      if (error.response) {
        throw error;
      }
      // If network error and not demo credentials, throw
      throw new Error('Network error. Please check your connection.');
    }
  }
};

