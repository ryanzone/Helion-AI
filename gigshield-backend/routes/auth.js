const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../db/supabase');

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user)
    return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid)
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken(user.id);
  const { password_hash, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone, location } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password required' });

  const password_hash = await bcrypt.hash(password, 10);
  const id = uuidv4();

  const { data: user, error } = await supabase
    .from('users')
    .insert([{ id, name, email, phone, location, password_hash }])
    .select('id, name, email, phone, location, created_at')
    .single();

  if (error) {
    if (error.code === '23505')
      return res.status(409).json({ error: 'Email already in use' });
    return res.status(500).json({ error: error.message });
  }

  const token = signToken(user.id);
  res.status(201).json({ token, user });
});

module.exports = router;
