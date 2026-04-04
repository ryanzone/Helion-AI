const express = require('express');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const userId = req.userId;

  const [
    { data: payouts },
    { data: earnings },
    { data: claims },
    { data: healthStats },
    { data: coverageRows },
    { data: subscription },
  ] = await Promise.all([
    supabase.from('payouts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
    supabase.from('earnings').select('amount').eq('user_id', userId),
    supabase.from('claims').select('status').eq('user_id', userId),
    supabase.from('health_stats').select('safety_score').eq('user_id', userId).single(),
    supabase.from('coverage').select('label, value').eq('user_id', userId),
    supabase.from('subscriptions').select('status, city_pool, plans(name, weekly_price, payout_amount)').eq('user_id', userId).eq('status', 'active').single(),
  ]);

  res.json({
    stats: {
      totalEarnings: (earnings || []).reduce((sum, e) => sum + e.amount, 0),
      activeClaims: (claims || []).filter(c => c.status === 'Pending').length,
      safetyScore: healthStats?.safety_score ?? 0,
      activePlan: subscription?.plans?.name ?? 'None',
      weeklyPremium: subscription?.plans?.weekly_price ?? 0,
      cityPool: subscription?.city_pool ?? null,
    },
    recentPayouts: payouts || [],
    coverage: coverageRows || [],
  });
});

module.exports = router;