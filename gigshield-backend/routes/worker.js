const express = require('express');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// POST /api/worker/activity — log a delivery day
router.post('/activity', async (req, res) => {
  const { activity_date, hours_active, deliveries_count, city, platform } = req.body;
  if (!activity_date) return res.status(400).json({ error: 'activity_date required' });

  const { data, error } = await supabase
    .from('worker_activity')
    .upsert([{ user_id: req.userId, activity_date, hours_active, deliveries_count, city, platform }], { onConflict: 'user_id,activity_date' })
    .select().single();

  if (error) return res.status(500).json({ error: error.message });

  // Check if underwriting now passes and update subscription
  const { data: activityRow } = await supabase
    .from('worker_active_days_30')
    .select('eligible')
    .eq('user_id', req.userId)
    .single();

  if (activityRow?.eligible) {
    await supabase.from('subscriptions').update({ underwriting_passed: true }).eq('user_id', req.userId).eq('status', 'active');
  }

  res.status(201).json({ activity: data, underwritingPassed: activityRow?.eligible ?? false });
});

// GET /api/worker/activity
router.get('/activity', async (req, res) => {
  const { data, error } = await supabase
    .from('worker_activity')
    .select('*')
    .eq('user_id', req.userId)
    .order('activity_date', { ascending: false })
    .limit(30);

  if (error) return res.status(500).json({ error: error.message });

  const { data: summary } = await supabase
    .from('worker_active_days_30')
    .select('active_days, eligible')
    .eq('user_id', req.userId)
    .single();

  res.json({ activity: data, summary: summary ?? { active_days: 0, eligible: false } });
});

module.exports = router;