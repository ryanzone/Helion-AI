const router = require('express').Router();
const supabase = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret';

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, phone, city } = req.body;

  try {
    // 1. Create User
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ name, email, phone, city }])
      .select();

    if (userError) throw userError;
    const user = userData[0];

    // 2. SEED DEMO DATA
    await Promise.all([
      // Earnings
      supabase.from('earnings').insert([
        { user_id: user.id, amount: 286000, platform: 'Swiggy', created_at: new Date(Date.now() - 30 * 86400000) },
        { user_id: user.id, amount: 318720, platform: 'Zomato', created_at: new Date() }
      ]),
      // Health Stats
      supabase.from('health_stats').insert([
        { user_id: user.id, safety_score: 94, heart_rate: 72, steps: 8400 }
      ]),
      // Claims
      supabase.from('claims').insert([
        { user_id: user.id, title: 'Vehicle Incident', amount: 37350, status: 'approved' }
      ]),
      // Appointments
      supabase.from('appointments').insert([
        { user_id: user.id, title: 'Annual Health Check', date: 'Next Tuesday', location: 'Apollo Hospital', icon: '🏥' }
      ]),
      // Coverage
      supabase.from('coverage').insert([
        { user_id: user.id, label: 'Accident Cover', value: '₹5,00,000' },
        { user_id: user.id, label: 'Income Protection', value: '₹30,000/mo' }
      ])
    ]);

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email } = req.body;
  try {
    const { data, error } = await supabase.from('users').select('*').eq('email', email);
    if (error) throw error;
    if (!data || !data.length) return res.status(404).json({ error: "User not found" });

    const user = data[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;