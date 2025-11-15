import axios from 'axios';

const API_URL = '/api/earnings';

// Mock earnings data for showcase
const MOCK_EARNINGS = {
  totalEarnings: 1250.50,
  pendingClaims: 3,
  completedClaims: 2,
  potentialEarnings: 850.00,
  recentEarnings: [
    {
      id: 1,
      settlementName: 'TechCorp Data Breach Settlement',
      amount: 250.00,
      date: '2024-10-15',
      status: 'completed'
    },
    {
      id: 2,
      settlementName: 'RetailGiant Price Fixing',
      amount: 1000.50,
      date: '2024-09-20',
      status: 'completed'
    },
    {
      id: 3,
      settlementName: 'AutoParts Warranty Settlement',
      amount: 500.00,
      date: '2024-11-01',
      status: 'pending'
    }
  ]
};

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
      // Return mock earnings data for showcase - no API needed
      return MOCK_EARNINGS;
    }
  }
};

