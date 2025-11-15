const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { users, userReceipts } = require('../data/mockUsers');
const settlements = require('../data/mockSettlements');

const router = express.Router();

// Detect user eligibility for a settlement
router.post('/detect', authenticateToken, (req, res) => {
  const { settlementId } = req.body;
  const user = users.find(u => u.id === req.user.id);
  const settlement = settlements.find(s => s.id === parseInt(settlementId));

  if (!settlement) {
    return res.status(404).json({ error: 'Settlement not found' });
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Mock eligibility detection based on purchase history
  const receipts = userReceipts[user.id] || [];
  const hasRelevantPurchases = receipts.some(receipt => {
    // Simple mock logic - in reality, this would be more sophisticated
    if (settlement.category === 'Electronics' && receipt.category === 'Electronics') {
      return true;
    }
    if (settlement.category === 'Consumer Protection' && receipt.merchant === 'RetailGiant') {
      return true;
    }
    return false;
  });

  res.json({
    settlementId: settlement.id,
    settlementName: settlement.name,
    mayQualify: hasRelevantPurchases,
    confidence: hasRelevantPurchases ? 'medium' : 'low',
    message: hasRelevantPurchases 
      ? 'You may qualify based on detected purchases' 
      : 'No matching purchases detected',
    detectedPurchases: hasRelevantPurchases ? receipts.filter(r => {
      if (settlement.category === 'Electronics' && r.category === 'Electronics') return true;
      if (settlement.category === 'Consumer Protection' && r.merchant === 'RetailGiant') return true;
      return false;
    }) : []
  });
});

// Generate auto-fill suggestions
router.post('/autofill', authenticateToken, (req, res) => {
  const { settlementId } = req.body;
  const user = users.find(u => u.id === req.user.id);
  const settlement = settlements.find(s => s.id === parseInt(settlementId));

  if (!settlement || !user) {
    return res.status(404).json({ error: 'Settlement or user not found' });
  }

  const receipts = userReceipts[user.id] || [];
  const relevantReceipts = receipts.filter(r => {
    if (settlement.category === 'Electronics' && r.category === 'Electronics') return true;
    if (settlement.category === 'Consumer Protection' && r.merchant === 'RetailGiant') return true;
    return false;
  });

  // Generate auto-fill suggestions
  const autofillData = {
    personalInfo: {
      fullName: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone
    },
    settlementInfo: {
      settlementId: settlement.id,
      settlementName: settlement.name
    },
    purchaseHistory: relevantReceipts.map(r => ({
      date: r.date,
      merchant: r.merchant,
      amount: r.amount,
      product: r.product
    })),
    suggestedAnswers: {
      // These are suggestions only - user must confirm
      purchasePeriod: relevantReceipts.length > 0 ? 'Yes' : 'No',
      receivedNotification: 'Unknown', // User must answer
      amountSpent: relevantReceipts.reduce((sum, r) => sum + r.amount, 0)
    }
  };

  res.json({
    autofillData,
    requiresConfirmation: true,
    message: 'Auto-fill suggestions generated. Please review and confirm each field.'
  });
});

// Preview filled form (after user confirmation)
router.post('/preview', authenticateToken, (req, res) => {
  const { confirmedData } = req.body;

  if (!confirmedData) {
    return res.status(400).json({ error: 'Confirmed data required' });
  }

  // Return preview of what will be submitted (but don't actually submit)
  res.json({
    preview: confirmedData,
    readyForSubmission: true,
    disclaimer: 'This is a preview only. You will be redirected to the official claim site to submit.',
    officialSite: confirmedData.settlementInfo?.officialSite || ''
  });
});

module.exports = router;

