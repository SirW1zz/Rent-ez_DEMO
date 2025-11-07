const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All match routes require authentication
router.use(protect);

// @route   GET /api/matches
// @desc    Get user's matches
// @access  Private
router.get('/', async (req, res) => {
  res.json({ success: true, data: { matches: [] } });
});

module.exports = router;