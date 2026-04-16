const router = require('express').Router();
const supabase = require('../db');

router.get('/stats', async (req, res) => {
  try {
    const { count: users } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: claims } = await supabase.from('claims').select('*', { count: 'exact', head: true });
    const { data: earningsData } = await supabase.from('earnings').select('amount');
    const earnings = earningsData ? earningsData.reduce((sum, e) => sum + (e.amount || 0), 0) : 0;
    
    res.json({
      users: users || 0,
      claims: claims || 0,
      earnings: earnings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;