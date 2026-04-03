const express = require('express');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// City risk adjustments (±₹)
const CITY_ADJUSTMENTS = {
  mumbai_rain: 3,
  delhi_aqi: 5,
  all: 2,
};

// Historical trigger probabilities per pool
const TRIGGER_PROB = {
  mumbai_rain: 0.18,
  delhi_aqi: 0.22,
  all: 0.15,
};

// GET /api/premium/calculate
router.get('/calculate', async (req, res) => {
  const userId = req.userId;

  const [
    { data: sub },
    { data: activity },
  ] = await Promise.all([
    supabase.from('subscriptions').select('id, city_pool, plans(weekly_price, payout_amount)').eq('user_id', userId).eq('status', 'active').single(),
    supabase.from('worker_active_days_30').select('active_days').eq('user_id', userId).single(),
  ]);

  if (!sub) return res.status(404).json({ error: 'No active subscription' });

  const city_pool = sub.city_pool;
  const avg_income_lost = 600; // ₹600/day avg gig income
  const days_exposed = Math.min(activity?.active_days ?? 5, 7);
  const trigger_prob = TRIGGER_PROB[city_pool] ?? 0.15;
  const base_premium = parseFloat((trigger_prob * avg_income_lost * days_exposed / 7 * 7).toFixed(2));

  const city_adjustment = CITY_ADJUSTMENTS[city_pool] ?? 0;

  // Activity discount: > 6 active days → -₹2
  const activity_adjustment = (activity?.active_days ?? 0) >= 6 ? -2 : 0;

  const final_premium = Math.max(20, parseFloat((base_premium + city_adjustment + activity_adjustment).toFixed(2)));

  // Log it
  await supabase.from('premium_calculation_log').insert([{
    id: uuidv4(),
    user_id: userId,
    subscription_id: sub.id,
    base_premium,
    city_adjustment,
    activity_adjustment,
    final_premium,
    trigger_probability: trigger_prob,
    avg_income_lost,
    days_exposed,
  }]);

  res.json({ base_premium, city_adjustment, activity_adjustment, final_premium, trigger_probability: trigger_prob, days_exposed, city_pool });
});

module.exports = router;