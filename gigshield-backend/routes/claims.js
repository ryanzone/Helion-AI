const express = require('express');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/claims?status=Approved
router.get('/', async (req, res) => {
  const userId = req.userId;
  const { status } = req.query;

  let query = supabase
    .from('claims')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data: claims, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  const total = claims.reduce((sum, c) => sum + c.amount, 0);
  const approved = claims.filter(c => c.status === 'Approved').length;
  const pending = claims.filter(c => c.status === 'Pending').length;

  res.json({ claims, summary: { total, approved, pending } });
});

// POST /api/claims
router.post('/', async (req, res) => {
  const userId = req.userId;
  const { title, icon, date, amount } = req.body;

  if (!title || !amount)
    return res.status(400).json({ error: 'title and amount required' });

  const { data, error } = await supabase
    .from('claims')
    .insert([{ id: uuidv4(), user_id: userId, title, icon, date, amount, status: 'Pending' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;
