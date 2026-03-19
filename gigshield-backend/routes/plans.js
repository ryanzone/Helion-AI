const express = require('express');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/plans
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('plans').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/plans/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Plan not found' });
  res.json(data);
});

module.exports = router;
