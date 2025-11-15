const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const settlements = require('../data/mockSettlements');

const router = express.Router();

// Submit questionnaire and get AI matches
router.post('/submit', authenticateToken, (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: 'Answers are required' });
  }

  // AI matching logic based on questionnaire answers
  const matches = findMatchingSettlements(answers);

  res.json({
    matches,
    totalMatches: matches.length,
    answers,
    timestamp: new Date().toISOString()
  });
});

// Get previously matched settlements
router.get('/matches', authenticateToken, (req, res) => {
  // In a real app, this would fetch from user's stored matches
  // For now, return empty or use session storage on frontend
  res.json({
    matches: [],
    message: 'No previous matches found. Please complete the questionnaire.'
  });
});

function findMatchingSettlements(answers) {
  const matches = [];
  const scores = {};

  settlements.forEach(settlement => {
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

module.exports = router;

