const router = require('express').Router();
const supabase = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  // Use claims history to simulate triggers for demo
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('user_id', req.userId)
    .limit(5);

  if (error) return res.status(500).json({ error: error.message });

  const triggers = (data || []).map(c => ({
    id: c.id,
    type: 'AI_DETECTION',
    message: `Triggered by ${c.title}`,
    date: c.created_at,
    status: 'Logged'
  }));

  res.json(triggers);
});

module.exports = router;