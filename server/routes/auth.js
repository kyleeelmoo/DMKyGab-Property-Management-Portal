const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const emailService = require('../utils/emailService');
const { emailVerificationLimiter, loginLimiter, registrationLimiter, generalLimiter } = require('../middleware/rateLimiter');

// Generate random 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification code
router.post('/send-verification-code', emailVerificationLimiter, async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user already exists for registration
    if (type === 'registration') {
      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiryMinutes = parseInt(process.env.VERIFICATION_CODE_EXPIRY) || 15;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Store verification code
    await db.run(
      'INSERT INTO verification_codes (email, code, type, expires_at) VALUES (?, ?, ?, ?)',
      [email, code, type || 'registration', expiresAt.toISOString()]
    );

    // Send email
    await emailService.sendVerificationCode(email, code, type);

    res.json({ 
      success: true, 
      message: 'Verification code sent to your email',
      expiresIn: expiryMinutes
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Verify code
router.post('/verify-code', emailVerificationLimiter, async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    // Find valid verification code
    const verification = await db.get(
      `SELECT * FROM verification_codes 
       WHERE email = ? AND code = ? AND used = 0 
       ORDER BY created_at DESC LIMIT 1`,
      [email, code]
    );

    if (!verification) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Check if expired
    if (new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Mark as used
    await db.run(
      'UPDATE verification_codes SET used = 1 WHERE id = ?',
      [verification.id]
    );

    res.json({ 
      success: true, 
      message: 'Code verified successfully',
      type: verification.type
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

// Register user
router.post('/register', registrationLimiter, async (req, res) => {
  try {
    const { name, email, phone, password, role, verificationCode } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify the verification code first
    const verification = await db.get(
      `SELECT * FROM verification_codes 
       WHERE email = ? AND code = ? AND used = 1 AND type = 'registration'
       ORDER BY created_at DESC LIMIT 1`,
      [email, verificationCode]
    );

    if (!verification) {
      return res.status(400).json({ error: 'Please verify your email first' });
    }

    // Check if verification was recent (within last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (new Date(verification.created_at) < thirtyMinutesAgo) {
      return res.status(400).json({ error: 'Verification code is too old. Please request a new one.' });
    }

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must include uppercase, lowercase, number, and special character' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user with pending status
    const result = await db.run(
      `INSERT INTO users (name, email, phone, password_hash, role, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [name, email, phone, passwordHash, role]
    );

    // Send notification to admin
    await emailService.sendAdminNotification({
      name,
      email,
      phone,
      role
    });

    // Send confirmation to user
    await emailService.sendApprovalNotification(email, false);

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Your account is pending admin approval.',
      userId: result.id
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password, verificationCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is approved
    if (user.status === 'pending') {
      return res.status(403).json({ 
        error: 'Your account is pending admin approval',
        status: 'pending'
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ 
        error: 'Your account registration was not approved',
        status: 'rejected'
      });
    }

    // If verification code is required and provided, verify it
    if (verificationCode) {
      const verification = await db.get(
        `SELECT * FROM verification_codes 
         WHERE email = ? AND code = ? AND used = 1 AND type = 'login'
         ORDER BY created_at DESC LIMIT 1`,
        [email, verificationCode]
      );

      if (!verification) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      // Check if verification was recent
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (new Date(verification.created_at) < thirtyMinutesAgo) {
        return res.status(400).json({ error: 'Verification code expired' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log login
    await db.run(
      'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
      [user.id, req.ip, req.headers['user-agent']]
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Check authentication status
router.get('/me', generalLimiter, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await db.get(
      'SELECT id, email, name, role, phone, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
