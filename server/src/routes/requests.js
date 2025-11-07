const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/requests
// @desc    Get rental requests
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  res.json({ success: true, data: { requests: [] } });
});

// @route   POST /api/requests
// @desc    Create new rental request
// @access  Private
router.post('/', protect, async (req, res) => {
  res.json({ success: true, data: { request: null } });
});

module.exports = router;