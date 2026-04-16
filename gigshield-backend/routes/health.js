const router = require('express').Router();
const supabase = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { data: stats, error: statsError } = await supabase
      .from('health_stats')
      .select('*')
      .eq('user_id', req.userId)
      .maybeSingle();

    const { data: appointments, error: appError } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', req.userId);

    if (statsError || appError) throw statsError || appError;

    res.json({
      stats: stats || { safety_score: 85, heart_rate: 70, steps: 0 },
      appointments: appointments || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;