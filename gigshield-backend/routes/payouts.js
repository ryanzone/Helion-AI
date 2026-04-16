const router = require('express').Router();
const supabase = require('../db');

// GET payouts (reuse claims = payouts for now)
router.get('/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('claims')
      .select('id, amount, status, created_at')
      .eq('user_id', req.params.userId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;