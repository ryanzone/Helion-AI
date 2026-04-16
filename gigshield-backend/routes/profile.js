const router = require('express').Router();
const supabase = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.userId)
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/', auth, async (req, res) => {
  const { name, phone, city } = req.body;
  const { data, error } = await supabase
    .from('users')
    .update({ name, phone, city })
    .eq('id', req.userId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;