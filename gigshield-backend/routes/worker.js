const router = require('express').Router();
const supabase = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('coverage')
    .select('*')
    .eq('user_id', req.userId);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

module.exports = router;