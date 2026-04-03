const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// If you're using Node < 18, install node-fetch
// npm install node-fetch
const fetch = global.fetch || require('node-fetch');

// ==============================
// SUBSCRIBE ROUTE
// ==============================
router.post('/subscribe', async (req, res) => {
  const userId = req.userId;
  const { plan_id, city_pool } = req.body;

  if (!plan_id || !city_pool) {
    return res.status(400).json({ error: 'plan_id and city_pool required' });
  }

  try {
    // -----------------------------
    // UNDERWRITING
    // -----------------------------
    const { data: activity } = await supabase
      .from('worker_active_days_30')
      .select('active_days, eligible')
      .eq('user_id', userId)
      .single();

    const eligible = activity?.eligible ?? false;
    const activeDays = activity?.active_days ?? 0;

    // -----------------------------
    // CALL ML SERVICE
    // -----------------------------
    let risk = 0.3;
    let weather = {};

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: city_pool,
          month: new Date().getMonth() + 1
        })
      });

      const data = await response.json();

      risk = data.risk_probability ?? 0.3;
      weather = data.weather ?? {};
    } catch (err) {
      console.log("ML service error, using fallback:", err.message);
    }

    // -----------------------------
    // DYNAMIC PRICING
    // -----------------------------
    const incomeLoss = 500;
    const exposureDays = 3;

    let dynamicPremium = risk * incomeLoss * exposureDays;

    // Clamp ₹20–₹50
    dynamicPremium = Math.max(20, Math.min(dynamicPremium, 50));

    // -----------------------------
    // CANCEL EXISTING SUB
    // -----------------------------
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', userId)
      .eq('status', 'active');

    // -----------------------------
    // CREATE NEW SUB
    // -----------------------------
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + 7);

    const { data: sub, error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        plan_id,
        city_pool,
        underwriting_passed: eligible,
        status: 'active',
        premium: dynamicPremium,
        risk_score: risk
      }])
      .select('*, plans(name, weekly_price, payout_amount)')
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // -----------------------------
    // EXPLAINABILITY
    // -----------------------------
    let reason = "Low environmental risk";

    if (risk > 0.5) {
      reason = "High risk due to weather conditions";
    }

    // -----------------------------
    // RESPONSE
    // -----------------------------
    res.status(201).json({
      subscription: sub,
      underwritingPassed: eligible,
      activeDays,
      premium: dynamicPremium,
      riskScore: risk,
      weather,
      reason,
      warning: !eligible
        ? `Only ${activeDays}/7 required active days. Cover starts when threshold is met.`
        : null,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// EXPORT
// ==============================
module.exports = router;