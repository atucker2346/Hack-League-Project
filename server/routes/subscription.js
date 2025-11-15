const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { users } = require('../data/mockUsers');

const router = express.Router();

// Get subscription status
router.get('/status', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    tier: user.subscriptionTier,
    features: getFeaturesForTier(user.subscriptionTier)
  });
});

// Subscribe/upgrade
router.post('/subscribe', authenticateToken, (req, res) => {
  const { tier } = req.body;
  const validTiers = ['free', 'premium'];

  if (!tier || !validTiers.includes(tier)) {
    return res.status(400).json({ error: 'Valid tier required (free or premium)' });
  }

  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.subscriptionTier = tier;

  res.json({
    message: 'Subscription updated successfully',
    tier: user.subscriptionTier,
    features: getFeaturesForTier(tier)
  });
});

// Get subscription tiers info
router.get('/tiers', (req, res) => {
  res.json([
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
  ]);
});

function getFeaturesForTier(tier) {
  const tiers = {
    free: {
      maxSettlements: 3,
      receiptScanning: false,
      emailIntegration: false,
      exportData: false,
      lawFirmAccess: false
    },
    premium: {
      maxSettlements: -1, // unlimited
      receiptScanning: true,
      emailIntegration: true,
      exportData: true,
      lawFirmAccess: true
    }
  };
  return tiers[tier] || tiers.free;
}

module.exports = router;

