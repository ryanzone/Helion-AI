const router = require('express').Router();
const supabase = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const userId = req.userId;

  try {
    const { data: earningsData } = await supabase
      .from('earnings')
      .select('amount')
      .eq('user_id', userId);
    
    let totalEarnings = 0;
    if (earningsData) totalEarnings = earningsData.reduce((s, e) => s + (Number(e.amount) || 0), 0);

    const { count: claims } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: approved } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'approved');

    // Fetch Health stats for safety score
    const { data: healthData } = await supabase
      .from('health_stats')
      .select('safety_score')
      .eq('user_id', userId)
      .maybeSingle();

    const total = claims || 0;

    res.json({
      stats: {
        totalEarnings,
        totalProtected: totalEarnings * 10, // Mock logic for demo
        safetyScore: healthData ? healthData.safety_score : 85,
        activeClaims: total
      },
      earningsChart: [
        { month: 'Jan', value: totalEarnings * 0.8 },
        { month: 'Feb', value: totalEarnings * 0.9 },
        { month: 'Mar', value: totalEarnings }
      ]
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;