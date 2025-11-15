const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { users } = require('../data/mockUsers');
const settlements = require('../data/mockSettlements');

const router = express.Router();

// Get total earnings and statistics
router.get('/total', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Mock earnings data - in real app, this would come from a database
  // Calculate potential earnings from all settlements user may qualify for
  const mockEarnings = {
    totalEarnings: 275.50, // Mock: total money received from completed claims
    pendingClaims: 2, // Number of claims in progress
    completedClaims: 3, // Number of successfully submitted claims
    potentialEarnings: 850, // Estimated potential from pending claims
    recentEarnings: [
      {
        settlementName: 'TechCorp Data Breach Settlement',
        amount: 150.00,
        date: '2024-01-15',
        status: 'completed'
      },
      {
        settlementName: 'RetailGiant Price Fixing',
        amount: 75.50,
        date: '2024-02-20',
        status: 'completed'
      },
      {
        settlementName: 'AutoParts Warranty Settlement',
        amount: 50.00,
        date: '2024-03-10',
        status: 'completed'
      }
    ]
  };

  res.json(mockEarnings);
});

module.exports = router;

