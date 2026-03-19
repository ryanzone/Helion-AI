const express = require('express');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/dashboard
router.get('/', async (req, res) => {
  const userId = req.userId;

  const [
    { data: payouts },
    { data: earnings },
    { data: claims },
    { data: healthStats },
    { data: coverageRows },
  ] = await Promise.all([
    supabase.from('payouts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
    supabase.from('earnings').select('amount').eq('user_id', userId),
    supabase.from('claims').select('status').eq('user_id', userId),
    supabase.from('health_stats').select('safety_score').eq('user_id', userId).single(),
    supabase.from('coverage').select('label, value').eq('user_id', userId),
  ]);

  const totalEarnings = (earnings || []).reduce((sum, e) => sum + e.amount, 0);
  const activeClaims = (claims || []).filter(c => c.status === 'Pending').length;
  const safetyScore = healthStats?.safety_score ?? 0;

  res.json({
    stats: {
      totalEarnings,
      activeClaims,
      safetyScore,
      activePlan: 'Pro Shield',
    },
    recentPayouts: payouts || [],
    coverage: coverageRows || [],
  });
});

module.exports = router;
