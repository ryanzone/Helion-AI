const express = require('express');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/health
router.get('/', async (req, res) => {
  const userId = req.userId;

  const [
    { data: stats },
    { data: appointments },
    { data: coverage },
  ] = await Promise.all([
    supabase.from('health_stats').select('*').eq('user_id', userId).single(),
    supabase.from('appointments').select('*').eq('user_id', userId),
    supabase.from('coverage').select('*').eq('user_id', userId),
  ]);

  res.json({
    stats: stats || { heart_rate: 0, steps: 0, safety_score: 0 },
    appointments: appointments || [],
    coverage: coverage || [],
  });
});

module.exports = router;
