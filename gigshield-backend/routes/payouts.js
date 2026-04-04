const express = require('express');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/payouts
router.get('/', async (req, res) => {
  const { data: payouts, error } = await supabase
    .from('payouts')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const total = payouts.reduce((sum, p) => sum + p.amount, 0);
  res.json({ payouts, total });
});

module.exports = router;
