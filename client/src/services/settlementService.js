import axios from 'axios';

const API_URL = '/api/settlements';

// Mock settlements data for showcase
const MOCK_SETTLEMENTS = [
  {
    id: 1,
    name: 'TechCorp Data Breach Settlement',
    description: 'Settlement regarding unauthorized data access affecting customers who made purchases between 2020-2023.',
    deadline: '2024-12-31',
    potentialAmount: { min: 50, max: 500 },
    category: 'Data Privacy',
    company: 'TechCorp Inc.',
    eligibilityCriteria: ['Made purchases between 2020-2023', 'Received data breach notification'],
    officialSite: 'https://techcorpsettlement.com',
    partneredLawFirm: 1
  },
  {
    id: 2,
    name: 'RetailGiant Price Fixing Class Action',
    description: 'Settlement for customers who purchased electronics from RetailGiant between 2021-2024.',
    deadline: '2025-03-15',
    potentialAmount: { min: 25, max: 200 },
    category: 'Consumer Protection',
    company: 'RetailGiant',
    eligibilityCriteria: ['Purchased electronics between 2021-2024', 'Resides in affected states'],
    officialSite: 'https://retailgiantsettlement.org',
    partneredLawFirm: 1
  },
  {
    id: 3,
    name: 'AutoParts Warranty Settlement',
    description: 'Settlement for consumers who purchased extended warranties on auto parts that were misrepresented.',
    deadline: '2024-11-30',
    potentialAmount: { min: 100, max: 1000 },
    category: 'Consumer Fraud',
    company: 'AutoParts Co.',
    eligibilityCriteria: ['Purchased extended warranty', 'Between 2019-2023'],
    officialSite: 'https://autopartssettlement.net',
    partneredLawFirm: 2
  },
  {
    id: 4,
    name: 'FoodBrand Labeling Settlement',
    description: 'Settlement regarding misleading product labeling on organic food products.',
    deadline: '2025-01-20',
    potentialAmount: { min: 15, max: 75 },
    category: 'False Advertising',
    company: 'FoodBrand LLC',
    eligibilityCriteria: ['Purchased organic products', 'Between 2022-2024'],
    officialSite: 'https://foodbrandsettlement.com',
    partneredLawFirm: null
  }
];

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
    // For showcase: always return mock settlements, no API needed
    // Try API first, but always fallback to mock data
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: getAuthHeaders().headers,
        timeout: 2000
      });
      // If API works and returns valid array, use it
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (error) {
      // API failed, use mock data
    }
    // Always return mock settlements for showcase
    return MOCK_SETTLEMENTS;
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      // Return mock settlement by ID
      return MOCK_SETTLEMENTS.find(s => s.id === parseInt(id)) || null;
    }
  }
};

