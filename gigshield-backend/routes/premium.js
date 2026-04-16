const router = require('express').Router();
const auth = require('../middleware/auth');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5005';

router.post('/calculate', auth, async (req, res) => {
  const { income, city, month } = req.body;

  try {
    // Call the real ML service using native fetch
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: city || "Chennai",
        month: month || 7,
        base_income: income || 50000,
        historical_claims: 2
      })
    });

    if (!response.ok) throw new Error(`ML Service returned ${response.status}`);
    const data = await response.json();

    res.json({
      premium: data.dynamic_premium,
      risk_score: data.risk_score,
      breakdown: {
        base: (income || 50000) * 0.05,
        ml_adjustment: data.dynamic_premium - ((income || 50000) * 0.05)
      }
    });

  } catch (err) {
    console.error('Premium Calc Error:', err.message);
    res.status(500).json({ error: 'ML Service unavailable' });
  }
});

module.exports = router;