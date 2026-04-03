const express = require('express');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Thresholds
const THRESHOLDS = { aqi: 300, rain: 50, flood: 1 };

// GET /api/triggers — fired triggers for user's city pool
router.get('/', async (req, res) => {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('city_pool')
    .eq('user_id', req.userId)
    .eq('status', 'active')
    .single();

  if (!sub) return res.json([]);

  const { data, error } = await supabase
    .from('triggers')
    .select('*')
    .eq('city_pool', sub.city_pool)
    .order('triggered_at', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/triggers/check — run trigger check (call from cron or manually)
router.post('/check', async (req, res) => {
  const userId = req.userId;
  const { peril_type, metric_value, city_pool, data_source = 'mock' } = req.body;

  if (!peril_type || metric_value == null || !city_pool)
    return res.status(400).json({ error: 'peril_type, metric_value, city_pool required' });

  const threshold = THRESHOLDS[peril_type];
  if (threshold == null) return res.status(400).json({ error: 'Unknown peril_type' });

  const fired = metric_value > threshold;
  if (!fired) return res.json({ fired: false, message: 'Threshold not met, no payout' });

  // Write trigger
  const { data: trigger, error: tErr } = await supabase
    .from('triggers')
    .insert([{ id: uuidv4(), city_pool, peril_type, metric_value, threshold_value: threshold, data_source, status: 'fired' }])
    .select().single();

  if (tErr) return res.status(500).json({ error: tErr.message });

  // Find all active subscribers in this city pool who passed underwriting
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, plans(payout_amount)')
    .eq('city_pool', city_pool)
    .eq('status', 'active')
    .eq('underwriting_passed', true);

  if (!subs?.length) return res.json({ fired: true, trigger, payouts: 0 });

  const now = new Date().toISOString().split('T')[0];
  const payoutRows = subs.map(s => ({
    id: uuidv4(),
    user_id: s.user_id,
    type: `${peril_type.toUpperCase()} Parametric Payout`,
    amount: s.plans?.payout_amount ?? 0,
    date: now,
    status: 'Completed',
    icon: peril_type === 'aqi' ? '🌫️' : peril_type === 'rain' ? '🌧️' : '🌊',
  }));

  const claimRows = subs.map(s => ({
    id: uuidv4(),
    user_id: s.user_id,
    title: `Auto: ${peril_type.toUpperCase()} Trigger Payout`,
    icon: peril_type === 'aqi' ? '🌫️' : peril_type === 'rain' ? '🌧️' : '🌊',
    date: now,
    status: 'Approved',
    amount: s.plans?.payout_amount ?? 0,
    trigger_id: trigger.id,
    is_auto: true,
  }));

  await Promise.all([
    supabase.from('payouts').insert(payoutRows),
    supabase.from('claims').insert(claimRows),
    supabase.from('triggers').update({ status: 'processed' }).eq('id', trigger.id),
  ]);

  res.json({ fired: true, trigger, payoutsIssued: payoutRows.length });
});

module.exports = router;