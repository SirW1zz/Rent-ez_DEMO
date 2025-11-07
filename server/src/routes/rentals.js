const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/rentals
// @desc    Get available rentals
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  res.json({ success: true, data: { rentals: [] } });
});

// @route   POST /api/rentals
// @desc    Create new rental listing
// @access  Private
router.post('/', protect, async (req, res) => {
  res.json({ success: true, data: { rental: null } });
});

module.exports = router;