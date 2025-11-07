const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', async (req, res) => {
  res.json({ success: true, data: { users: [] } });
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

module.exports = router;