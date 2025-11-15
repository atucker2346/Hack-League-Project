import axios from 'axios';

const API_URL = '/api/questionnaire';

// Mock settlements for matching (same as settlementService)
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

// Client-side matching logic (same as server)
function findMatchingSettlements(answers) {
  const matches = [];
  const scores = {};

  MOCK_SETTLEMENTS.forEach(settlement => {
    let score = 0;
    let reasons = [];

    // Check purchase categories
    if (answers.purchaseCategories) {
      const categories = Array.isArray(answers.purchaseCategories) 
        ? answers.purchaseCategories 
        : [answers.purchaseCategories];
      
      if (settlement.category === 'Data Privacy' && 
          categories.some(c => c.includes('Electronics') || c.includes('Software'))) {
        score += 30;
        reasons.push('Matches your purchase categories');
      }
      
      if (settlement.category === 'Consumer Protection' && 
          categories.some(c => c.includes('Electronics'))) {
        score += 25;
        reasons.push('Matches your purchase categories');
      }
      
      if (settlement.category === 'Consumer Fraud' && 
          categories.some(c => c.includes('Automotive'))) {
        score += 30;
        reasons.push('Matches your purchase categories');
      }
      
      if (settlement.category === 'False Advertising' && 
          categories.some(c => c.includes('Food'))) {
        score += 25;
        reasons.push('Matches your purchase categories');
      }
    }

    // Check data breach notifications
    if (answers.dataBreach === 'Yes' && settlement.category === 'Data Privacy') {
      score += 40;
      reasons.push('You reported receiving data breach notifications');
    }

    // Check purchase period
    if (answers.purchasePeriod) {
      const period = answers.purchasePeriod;
      if (settlement.name.includes('2020-2023') && period.includes('2020')) {
        score += 20;
        reasons.push('Matches your purchase timeline');
      }
      if (settlement.name.includes('2021-2024') && (period.includes('2022') || period.includes('2024'))) {
        score += 20;
        reasons.push('Matches your purchase timeline');
      }
    }

    // Check companies
    if (answers.companies) {
      const companies = Array.isArray(answers.companies) 
        ? answers.companies 
        : [answers.companies];
      
      if (settlement.company === 'TechCorp Inc.' && 
          companies.some(c => c.includes('Tech'))) {
        score += 25;
        reasons.push('Matches companies you purchased from');
      }
      
      if (settlement.company === 'RetailGiant' && 
          companies.some(c => c.includes('retailer') || c.includes('Amazon') || c.includes('Target'))) {
        score += 25;
        reasons.push('Matches companies you purchased from');
      }
    }

    // Check issues experienced
    if (answers.issues) {
      const issues = Array.isArray(answers.issues) 
        ? answers.issues 
        : [answers.issues];
      
      if (settlement.category === 'False Advertising' && 
          issues.some(i => i.includes('Misleading') || i.includes('False'))) {
        score += 30;
        reasons.push('Matches issues you experienced');
      }
      
      if (settlement.category === 'Consumer Fraud' && 
          issues.some(i => i.includes('Warranty'))) {
        score += 30;
        reasons.push('Matches issues you experienced');
      }
    }

    // Check settlement notifications
    if (answers.notifications && 
        (answers.notifications.includes('Yes') || answers.notifications.includes('Not sure')) &&
        settlement.category === 'Data Privacy') {
      score += 15;
      reasons.push('You may have received notifications for this settlement');
    }

    // Always include at least some matches (for showcase)
    if (score === 0) {
      score = 10; // Low confidence match
      reasons.push('May be relevant based on your profile');
    }

    if (score > 0) {
      scores[settlement.id] = { score, reasons, settlement };
    }
  });

  // Sort by score and return top matches
  const sortedMatches = Object.values(scores)
    .sort((a, b) => b.score - a.score)
    .map(item => ({
      ...item.settlement,
      matchScore: item.score,
      matchReasons: item.reasons,
      confidence: item.score >= 60 ? 'high' : item.score >= 40 ? 'medium' : 'low'
    }));

  return sortedMatches;
}

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
    // For showcase: generate matches client-side, no API needed
    try {
      const response = await axios.post(
        `${API_URL}/submit`,
        { answers },
        {
          headers: getAuthHeaders().headers,
          timeout: 2000
        }
      );
      // If API works, use it
      if (response.data && response.data.matches) {
        return response.data;
      }
    } catch (error) {
      // API failed, generate matches client-side
    }
    
    // Generate matches client-side
    const matches = findMatchingSettlements(answers);
    
    return {
      matches,
      totalMatches: matches.length,
      answers,
      timestamp: new Date().toISOString()
    };
  },

  getMatches: async () => {
    try {
      const response = await axios.get(`${API_URL}/matches`, {
        headers: getAuthHeaders().headers,
        timeout: 2000
      });
      return response.data;
    } catch (error) {
      // Return empty matches if API fails
      return { matches: [] };
    }
  }
};

