const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const settlements = require('../data/mockSettlements');

const router = express.Router();

// Get all settlements
router.get('/', authenticateToken, (req, res) => {
  res.json(settlements);
});

// Get settlement by ID
router.get('/:id', authenticateToken, (req, res) => {
  const settlement = settlements.find(s => s.id === parseInt(req.params.id));
  if (!settlement) {
    return res.status(404).json({ error: 'Settlement not found' });
  }
  res.json(settlement);
});

module.exports = router;

