const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// @route   GET /api/chat/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', async (req, res) => {
  res.json({ success: true, data: { conversations: [] } });
});

module.exports = router;