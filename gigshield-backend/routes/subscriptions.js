const express = require('express');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plans(name, weekly_price, payout_amount, peril_type, city_pool)')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch('/:id/cancel', async (req, res) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;