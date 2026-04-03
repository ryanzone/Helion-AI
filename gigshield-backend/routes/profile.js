const express = require('express');
const multer = require('multer');
const supabase = require('../db/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save document metadata to database
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert([{
        user_id: req.userId,
        name: req.file.originalname,
        status: 'Uploaded'
      }])
      .select()
      .single();

    if (docError) return res.status(500).json({ error: docError.message });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const userId = req.userId;

    const [
      userRes,
      healthRes,
      subRes,
      activityRes,
      docsRes,
    ] = await Promise.all([
      supabase.from('users').select('id, name, email, phone, location, created_at').eq('id', userId).single(),
      supabase.from('health_stats').select('safety_score, heart_rate, steps').eq('user_id', userId).single(),
      supabase.from('subscriptions').select('status, city_pool, underwriting_passed, plans(name, weekly_price)').eq('user_id', userId).eq('status', 'active').single(),
      supabase.from('worker_active_days_30').select('active_days, eligible').eq('user_id', userId).single(),
      supabase.from('documents').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    const { data: user, error } = userRes;
    const { data: healthStats } = healthRes;
    const { data: subscription } = subRes;
    const { data: activityRow } = activityRes;
    const { data: documents } = docsRes;

  if (error) return res.status(404).json({ error: 'User not found' });

  res.json({
    ...user,
    securityRating: healthStats?.safety_score ?? 0,
    healthStats: healthStats ?? {},
    activePlan: subscription?.plans?.name ?? 'None',
    weeklyPremium: subscription?.plans?.weekly_price ?? 0,
    cityPool: subscription?.city_pool ?? null,
    underwritingPassed: subscription?.underwriting_passed ?? false,
    activeDays: activityRow?.active_days ?? 0,
    eligible: activityRow?.eligible ?? false,
    documents: (documents && documents.length > 0) ? documents : [
      { id: '1', name: "Driver's License", status: 'Verified' },
      { id: '2', name: 'Tax Return 2023', status: 'Verified' },
      { id: '3', name: 'Liability Policy', status: 'Verified' },
    ],
  });
});

router.put('/', async (req, res) => {
  const { name, phone, location } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (location) updates.location = location;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.userId)
    .select('id, name, email, phone, location, created_at')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;