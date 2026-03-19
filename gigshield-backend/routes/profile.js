const express = require('express');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/profile
router.get('/', async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, phone, location, created_at')
    .eq('id', req.userId)
    .single();

  if (error) return res.status(404).json({ error: 'User not found' });

  const { data: healthStats } = await supabase
    .from('health_stats')
    .select('safety_score')
    .eq('user_id', req.userId)
    .single();

  const securityRating = healthStats?.safety_score || 85;

  const documents = [
    { icon: 'badge', title: "Driver's License", subtitle: 'Expires Oct 2026', color: '#6C63FF' },
    { icon: 'article', title: 'Tax Return 2023', subtitle: 'Verified Mar 2024', color: '#00D988' },
    { icon: 'shield', title: 'Liability Policy', subtitle: 'Active • Renewal 2025', color: '#FFB800' },
  ];

  res.json({
    ...user,
    securityRating,
    documents
  });
});

// PUT /api/profile
router.put('/', async (req, res) => {
  const { name, phone, location } = req.body;

  const { data, error } = await supabase
    .from('users')
    .update({ name, phone, location })
    .eq('id', req.userId)
    .select('id, name, email, phone, location, created_at')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
