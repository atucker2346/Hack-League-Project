const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { users } = require('../data/mockUsers');
const { lawFirms, lawFirmUpdates } = require('../data/mockLawFirms');
const settlements = require('../data/mockSettlements');

const router = express.Router();

// Check if user has premium subscription
const checkPremium = (req, res, next) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user || user.subscriptionTier !== 'premium') {
    return res.status(403).json({ 
      error: 'Premium subscription required',
      requiresPremium: true 
    });
  }
  next();
};

// Get all partnered law firms (premium only)
router.get('/', authenticateToken, checkPremium, (req, res) => {
  res.json(lawFirms);
});

// Get law firm by ID (premium only)
router.get('/:id', authenticateToken, checkPremium, (req, res) => {
  const lawFirm = lawFirms.find(lf => lf.id === parseInt(req.params.id));
  if (!lawFirm) {
    return res.status(404).json({ error: 'Law firm not found' });
  }
  res.json(lawFirm);
});

// Get law firm for specific settlement (premium only)
router.get('/settlement/:settlementId', authenticateToken, checkPremium, (req, res) => {
  const settlement = settlements.find(s => s.id === parseInt(req.params.settlementId));
  if (!settlement) {
    return res.status(404).json({ error: 'Settlement not found' });
  }

  if (!settlement.partneredLawFirm) {
    return res.status(404).json({ error: 'No partnered law firm for this settlement' });
  }

  const lawFirm = lawFirms.find(lf => lf.id === settlement.partneredLawFirm);
  if (!lawFirm) {
    return res.status(404).json({ error: 'Law firm not found' });
  }

  res.json(lawFirm);
});

// Get updates from law firm (premium only)
router.get('/:id/updates', authenticateToken, checkPremium, (req, res) => {
  const lawFirm = lawFirms.find(lf => lf.id === parseInt(req.params.id));
  if (!lawFirm) {
    return res.status(404).json({ error: 'Law firm not found' });
  }

  const updates = lawFirmUpdates[req.params.id] || [];
  res.json(updates);
});

// Contact law firm (premium only)
router.post('/:id/contact', authenticateToken, checkPremium, (req, res) => {
  const { subject, message, settlementId } = req.body;
  const lawFirm = lawFirms.find(lf => lf.id === parseInt(req.params.id));
  
  if (!lawFirm) {
    return res.status(404).json({ error: 'Law firm not found' });
  }

  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required' });
  }

  // In a real app, this would send an email or create a ticket
  // For now, just return success
  res.json({
    success: true,
    message: 'Your message has been sent to the law firm. They will contact you shortly.',
    lawFirmName: lawFirm.name,
    contactEmail: lawFirm.email
  });
});

// Check if settlement has partnered law firm (public endpoint)
router.get('/settlement/:settlementId/check', authenticateToken, (req, res) => {
  const settlement = settlements.find(s => s.id === parseInt(req.params.settlementId));
  if (!settlement) {
    return res.status(404).json({ error: 'Settlement not found' });
  }

  const user = users.find(u => u.id === req.user.id);
  const hasPremium = user && user.subscriptionTier === 'premium';

  res.json({
    hasPartneredLawFirm: !!settlement.partneredLawFirm,
    lawFirmId: settlement.partneredLawFirm,
    hasAccess: hasPremium && !!settlement.partneredLawFirm
  });
});

module.exports = router;

