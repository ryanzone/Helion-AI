const express = require('express');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/earnings
router.get('/', async (req, res) => {
  const userId = req.userId;

  const { data: earnings, error } = await supabase
    .from('earnings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const total = earnings.reduce((sum, e) => sum + e.amount, 0);
  const thisWeek = earnings.slice(0, 3).reduce((sum, e) => sum + e.amount, 0);

  res.json({ earnings, summary: { total, thisWeek } });
});

module.exports = router;
