const router = require('express').Router();
const supabase = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plans(*)')
    .eq('user_id', req.userId);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

router.post('/subscribe', auth, async (req, res) => {
  const { plan_id } = req.body;
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{ user_id: req.userId, plan_id, status: 'active' }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

module.exports = router;