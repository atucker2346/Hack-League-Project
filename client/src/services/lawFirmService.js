import axios from 'axios';

const API_URL = '/api/lawfirms';

// Mock law firms data for showcase
const MOCK_LAW_FIRMS = [
  {
    id: 1,
    name: 'Smith & Associates Class Action Law',
    email: 'support@smithlaw.com',
    phone: '1-800-555-0100',
    website: 'https://smithlaw.com',
    specialties: ['Data Privacy', 'Consumer Protection'],
    settlements: [1, 2],
    benefits: [
      'Direct attorney support',
      'Priority claim processing',
      'Higher payout opportunities',
      'Regular settlement updates',
      'Access to claim administrators',
      'Expert legal guidance'
    ],
    description: 'Leading class action law firm specializing in data privacy and consumer protection cases. We have successfully represented thousands of clients in major settlements.',
    logo: '/law-firm-logo.jpg'
  },
  {
    id: 2,
    name: 'Consumer Rights Legal Group',
    email: 'info@consumerrightslaw.com',
    phone: '1-800-555-0200',
    website: 'https://consumerrightslaw.com',
    specialties: ['Consumer Fraud', 'False Advertising'],
    settlements: [3],
    benefits: [
      'Direct attorney support',
      'Priority claim processing',
      'Higher payout opportunities',
      'Regular settlement updates',
      'Access to claim administrators',
      'Expert legal guidance'
    ],
    description: 'Dedicated to protecting consumer rights through class action litigation. Our team has recovered millions in settlements for consumers nationwide.',
    logo: '/law-firm-logo.jpg'
  }
];

const MOCK_UPDATES = {
  1: [
    {
      id: 1,
      settlementId: 1,
      title: 'Important Deadline Reminder',
      content: 'The deadline for the TechCorp Data Breach Settlement is approaching. Please submit your claim by December 31, 2024 to ensure eligibility.',
      date: '2024-11-15',
      type: 'deadline'
    },
    {
      id: 2,
      settlementId: 1,
      title: 'Payout Information Update',
      content: 'We have received confirmation that payouts for approved claims will begin processing in Q1 2025. Estimated amounts range from $50-$500 based on individual circumstances.',
      date: '2024-11-10',
      type: 'payout'
    }
  ],
  2: [
    {
      id: 4,
      settlementId: 3,
      title: 'Extended Warranty Settlement Update',
      content: 'We are pleased to announce that the AutoParts Warranty Settlement has been approved. Claim submissions are now being processed.',
      date: '2024-11-12',
      type: 'status'
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

export const lawFirmService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return MOCK_LAW_FIRMS;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return MOCK_LAW_FIRMS.find(f => f.id === parseInt(id)) || null;
    }
  },

  getBySettlement: async (settlementId) => {
    try {
      const response = await axios.get(`${API_URL}/settlement/${settlementId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      // Find law firm that handles this settlement
      return MOCK_LAW_FIRMS.find(f => f.settlements.includes(parseInt(settlementId))) || null;
    }
  },

  getUpdates: async (lawFirmId) => {
    try {
      const response = await axios.get(`${API_URL}/${lawFirmId}/updates`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return MOCK_UPDATES[parseInt(lawFirmId)] || [];
    }
  },

  contact: async (lawFirmId, subject, message, settlementId) => {
    try {
      const response = await axios.post(
        `${API_URL}/${lawFirmId}/contact`,
        { subject, message, settlementId },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      // Return success for showcase
      return { success: true, message: 'Message sent successfully (demo mode)' };
    }
  },

  checkPartnership: async (settlementId) => {
    try {
      const response = await axios.get(`${API_URL}/settlement/${settlementId}/check`, getAuthHeaders());
      return response.data;
    } catch (error) {
      // Check if any law firm handles this settlement
      const hasPartnership = MOCK_LAW_FIRMS.some(f => f.settlements.includes(parseInt(settlementId)));
      return { hasPartnership, lawFirmId: hasPartnership ? MOCK_LAW_FIRMS.find(f => f.settlements.includes(parseInt(settlementId)))?.id : null };
    }
  }
};

