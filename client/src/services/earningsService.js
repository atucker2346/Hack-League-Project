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
    // For showcase: always return mock earnings immediately, no API needed
    // Try API first, but always fallback to mock data
    try {
      const response = await axios.get(`${API_URL}/total`, {
        headers: getAuthHeaders().headers,
        timeout: 2000
      });
      // If API works and has valid data, use it
      if (response.data && typeof response.data === 'object' && response.data.totalEarnings !== undefined) {
        return response.data;
      }
    } catch (error) {
      // API failed, use mock data
    }
    // Always return mock earnings for showcase
    return MOCK_EARNINGS;
  }
};

