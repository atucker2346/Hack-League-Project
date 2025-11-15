import axios from 'axios';

const API_URL = '/api/subscription';

// Mock subscription tiers for showcase
const MOCK_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'View up to 3 settlements',
      'Basic auto-fill assistance',
      'Manual form review'
    ],
    limitations: [
      'Limited to 3 settlements per month',
      'No receipt scanning',
      'No email integration',
      'No access to Partnered Law Firms'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'Unlimited settlements',
      'Advanced auto-fill',
      'Receipt scanning',
      'Email integration',
      'Priority support',
      'Export claim data',
      'Access to Partnered Law Firms',
      'Direct attorney support',
      'Priority claim processing',
      'Higher payout opportunities',
      'Settlement updates from law firms',
      'Access to claim administrators'
    ],
    limitations: []
  }
];

// Add token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Helper to get subscription status from user
const getMockStatus = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        tier: user.subscriptionTier || 'free',
        features: {
          maxSettlements: user.subscriptionTier === 'premium' ? -1 : 3,
          receiptScanning: user.subscriptionTier === 'premium',
          emailIntegration: user.subscriptionTier === 'premium',
          exportData: user.subscriptionTier === 'premium',
          lawFirmAccess: user.subscriptionTier === 'premium'
        }
      };
    }
  } catch (e) {
    // Fallback
  }
  return {
    tier: 'free',
    features: {
      maxSettlements: 3,
      receiptScanning: false,
      emailIntegration: false,
      exportData: false,
      lawFirmAccess: false
    }
  };
};

export const subscriptionService = {
  getStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/status`, getAuthHeaders());
      return response.data;
    } catch (error) {
      // Return mock status based on current user
      return getMockStatus();
    }
  },

  getTiers: async () => {
    // For showcase: always return mock tiers immediately, no API needed
    // Try API first, but always fallback to mock data
    try {
      const response = await axios.get(`${API_URL}/tiers`, { timeout: 2000 });
      // If API works, ensure it's an array
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (error) {
      // API failed, use mock data
    }
    // Always return mock tiers for showcase
    return MOCK_TIERS;
  },

  subscribe: async (tier) => {
    try {
      const response = await axios.post(
        `${API_URL}/subscribe`,
        { tier },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      // Update user in localStorage for showcase
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.subscriptionTier = tier;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (e) {
        // Ignore
      }
      // Return mock subscription update
      return {
        tier,
        features: {
          maxSettlements: tier === 'premium' ? -1 : 3,
          receiptScanning: tier === 'premium',
          emailIntegration: tier === 'premium',
          exportData: tier === 'premium',
          lawFirmAccess: tier === 'premium'
        },
        message: 'Subscription updated successfully (demo mode)'
      };
    }
  }
};

