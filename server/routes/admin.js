const express = require('express');
const router = express.Router();
const db = require('../config/database');
const emailService = require('../utils/emailService');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

// Get all pending users (admin only)
router.get('/pending-users', adminLimiter, authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE status = ? ORDER BY created_at DESC',
      ['pending']
    );
    res.json({ users });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
});

// Get all users (admin only)
router.get('/users', adminLimiter, authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT id, name, email, phone, role, status, created_at FROM users';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const users = await db.query(query, params);
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Approve user (admin only)
router.post('/approve-user/:userId', adminLimiter, authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user details
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({ error: 'User is not pending approval' });
    }

    // Update user status to approved
    await db.run(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['approved', userId]
    );

    // Send approval notification to user
    await emailService.sendApprovalNotification(user.email, true);

    res.json({ 
      success: true, 
      message: 'User approved successfully' 
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

// Reject user (admin only)
router.post('/reject-user/:userId', adminLimiter, authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user details
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({ error: 'User is not pending approval' });
    }

    // Update user status to rejected
    await db.run(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['rejected', userId]
    );

    res.json({ 
      success: true, 
      message: 'User rejected successfully' 
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
});

// Get user details (admin only)
router.get('/user/:userId', adminLimiter, authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await db.get(
      'SELECT id, name, email, phone, role, status, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get login history
    const loginHistory = await db.query(
      'SELECT ip_address, user_agent, login_at FROM login_history WHERE user_id = ? ORDER BY login_at DESC LIMIT 10',
      [userId]
    );

    res.json({ 
      user,
      loginHistory
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

module.exports = router;
