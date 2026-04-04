
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../db/supabase');

const router = express.Router();

// ==============================
// JWT SIGN FUNCTION
// ==============================
const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ==============================
// AUTH MIDDLEWARE
// ==============================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ==============================
// REGISTER
// ==============================
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, phone, city } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required'
      });
    }

    // Normalize email
    email = email.toLowerCase();

    // Password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const id = uuidv4();

    // Insert user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          id,
          name,
          email,
          phone,
          city,
          password_hash
        }
      ])
      .select('id, name, email, phone, city, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Email already in use'
        });
      }
      return res.status(500).json({
        error: error.message
      });
    }

    // Generate token
    const token = signToken(user.id);

    return res.status(201).json({
      token,
      user
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Server error during registration'
    });
  }
});

// ==============================
// LOGIN
// ==============================
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required'
      });
    }

    email = email.toLowerCase();

    // Fetch user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = signToken(user.id);

    // Remove sensitive field
    delete user.password_hash;

    return res.json({
      token,
      user
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Server error during login'
    });
  }
});

// ==============================
// GET CURRENT USER (PROTECTED)
// ==============================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, city, created_at')
      .eq('id', req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    return res.json(user);

  } catch (err) {
    return res.status(500).json({
      error: 'Server error fetching user'
    });
  }
});

module.exports = router;
