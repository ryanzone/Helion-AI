const express = require('express');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// POST /api/admin/seed
// Populate account with demo data for presentation
router.post('/seed', async (req, res) => {
  const userId = req.userId;

  try {
    // 1. Health & Safety
    await supabase.from('health_stats').upsert({
      user_id: userId,
      safety_score: 92, // High score for the demo
      heart_rate: 68,
      steps: 10420,
      updated_at: new Date().toISOString()
    });

    // 2. Comprehensive Coverage
    await supabase.from('coverage').delete().eq('user_id', userId);
    await supabase.from('coverage').insert([
      { id: uuidv4(), user_id: userId, label: 'Accidental Disability', value: '₹5,00,000' },
      { id: uuidv4(), user_id: userId, label: 'Income Protection', value: '70% of avg earnings' },
      { id: uuidv4(), user_id: userId, label: 'Emergency medical', value: '₹50,000' },
      { id: uuidv4(), user_id: userId, label: 'Life Cover', value: '₹10,00,000' }
    ]);

    // 3. Appointments
    await supabase.from('appointments').delete().eq('user_id', userId);
    await supabase.from('appointments').insert([
      { id: uuidv4(), user_id: userId, title: 'Annual Wellness Check', date: 'Tomorrow, 10:00 AM', location: 'City Medical Center', icon: '🏥' },
      { id: uuidv4(), user_id: userId, title: 'Physio Session', date: 'Oct 15, 2:30 PM', location: 'Rehab Expert Studio', icon: '🏥' }
    ]);

    // 4. Claims History
    await supabase.from('claims').delete().eq('user_id', userId);
    await supabase.from('claims').insert([
      { id: uuidv4(), user_id: userId, title: 'Rain Interruption - Aug 12', amount: 450, status: 'Approved', date: '2026-08-12', is_auto: true },
      { id: uuidv4(), user_id: userId, title: 'Bike Repair Reimbursement', amount: 3200, status: 'Pending', date: '2026-09-02', is_auto: false },
      { id: uuidv4(), user_id: userId, title: 'Medical OPD', amount: 1200, status: 'Approved', date: '2026-08-25', is_auto: false }
    ]);

    // 5. Worker Activity (to pass underwriting)
    await supabase.from('worker_active_days_30').upsert({
      user_id: userId,
      active_days: 22,
      eligible: true,
      last_updated: new Date().toISOString()
    });

    // 6. Recent Earnings (7 day history)
    await supabase.from('earnings').delete().eq('user_id', userId);
    const now = new Date();
    const earnings = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      earnings.push({
        id: uuidv4(),
        user_id: userId,
        amount: 850 + Math.floor(Math.random() * 500),
        platform: i % 2 === 0 ? 'Swiggy' : 'Zomato',
        created_at: d.toISOString()
      });
    }
    await supabase.from('earnings').insert(earnings);

    res.json({ 
      message: 'Presentation pack seeded!', 
      details: {
        safetyScore: 92,
        eligible: true,
        claims: 3,
        earningsCount: 7
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
