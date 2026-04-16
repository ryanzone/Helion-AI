const router = require('express').Router();
const supabase = require('../db');

router.get('/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, plans!inner(name, price)')
      .eq('user_id', req.params.userId);
      
    if (error) {
       // fallback manual join
       const subs = await supabase.from('subscriptions').select('*').eq('user_id', req.params.userId);
       const p = await supabase.from('plans').select('*');
       if(subs.data && p.data) {
           return res.json(subs.data.map(s => {
               const pl = p.data.find(x => x.id === s.plan_id);
               return {...s, name: pl?.name, price: pl?.price};
           }));
       }
       return res.json([]);
    }
    
    // flatten
    const result = data.map(s => ({
      ...s,
      name: s.plans?.name,
      price: s.plans?.price
    }));
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;