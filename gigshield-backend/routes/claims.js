const express = require('express');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { status } = req.query;
  let query = supabase.from('claims').select('*').eq('user_id', req.userId).order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);

  const { data: claims, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json({
    claims,
    summary: {
      total: claims.reduce((sum, c) => sum + (c.amount || 0), 0),
      approved: claims.filter(c => c.status === 'Approved').length,
      pending: claims.filter(c => c.status === 'Pending').length,
      auto: claims.filter(c => c.is_auto).length,
    },
  });
});

router.post('/', async (req, res) => {
  const { title, icon, date, amount, trigger_id } = req.body;
  if (!title || !amount) return res.status(400).json({ error: 'title and amount required' });

  const { data, error } = await supabase
    .from('claims')
    .insert([{ id: uuidv4(), user_id: req.userId, title, icon, date, amount, status: 'Pending', trigger_id: trigger_id || null, is_auto: !!trigger_id }])
    .select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status required' });

  const { data, error } = await supabase
    .from('claims')
    .update({ status })
    .eq('id', req.params.id)
    .select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;