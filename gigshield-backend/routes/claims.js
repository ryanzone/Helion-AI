const router = require('express').Router();
const supabase = require('../db');
const auth = require('../middleware/auth');

// GET claims (Authenticated)
router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// CREATE claim
router.post('/', auth, async (req, res) => {
  const { title, amount, type } = req.body;

  const { data, error } = await supabase
    .from('claims')
    .insert([{ user_id: req.userId, title, amount, status: 'pending' }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

module.exports = router;