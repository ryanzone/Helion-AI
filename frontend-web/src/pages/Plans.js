import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Plans.css';
import { API_BASE } from "../api";

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    cost: 20,
    payout: 200,
    color: '#38bdf8',
    features: [
      'Rainfall > 50mm trigger',
      'Weekly payouts',
      'Basic fraud protection',
      'In-app wallet',
    ],
    badge: null,
  },
  {
    id: 'standard',
    name: 'Standard',
    cost: 40,
    payout: 500,
    color: '#2563ff',
    features: [
      'All Basic features',
      'AQI > 300 trigger',
      'Priority payout processing',
      'Advanced fraud shield',
      'Income trend reports',
    ],
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    cost: 60,
    payout: 800,
    color: '#f59e0b',
    features: [
      'All Standard features',
      'Government flood alert trigger',
      'Instant payout (< 60s)',
      'Multi-signal trust score',
      'Priority support',
      'Zone risk heatmap access',
    ],
    badge: 'Best Value',
  },
];

export default function Plans() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('standard');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('helion_user') || '{}');

  const handleBuy = async () => {
    const plan = PLANS.find(p => p.id === selected);
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/policy/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan: plan.id, cost: plan.cost })
      });
    } catch {}
    // Update local state
    const updated = { ...user, plan: plan.id, planCost: plan.cost, planPayout: plan.payout, policyActive: true };
    localStorage.setItem('helion_user', JSON.stringify(updated));
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="plans">
      <div className="plans__container">
        <div className="plans__header">
          <div className="plans__label">Choose Your Plan</div>
          <h1 className="plans__title">
            Income protection that<br />
            <span>fits your earning.</span>
          </h1>
          <p className="plans__sub">
            All plans include automatic payouts — no forms, no calls, no delays.
          </p>
        </div>

        {/* Trigger banner */}
        <div className="plans__triggers-banner">
          <div className="plans__trigger">
            <span>🌧️</span>
            <div>
              <div className="plans__trigger-label">Rainfall Trigger</div>
              <div className="plans__trigger-val">&gt; 50mm</div>
            </div>
          </div>
          <div className="plans__trigger-div" />
          <div className="plans__trigger">
            <span>🌫️</span>
            <div>
              <div className="plans__trigger-label">AQI Trigger</div>
              <div className="plans__trigger-val">&gt; 300</div>
            </div>
          </div>
          <div className="plans__trigger-div" />
          <div className="plans__trigger">
            <span>🌊</span>
            <div>
              <div className="plans__trigger-label">Flood Alert</div>
              <div className="plans__trigger-val">Govt. Notice</div>
            </div>
          </div>
        </div>

        {/* Plan cards */}
        <div className="plans__cards">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`plans__card ${selected === plan.id ? 'plans__card--selected' : ''}`}
              style={{ '--plan-c': plan.color }}
              onClick={() => setSelected(plan.id)}
            >
              {plan.badge && (
                <div className="plans__card-badge">{plan.badge}</div>
              )}
              <div className="plans__card-name">{plan.name}</div>
              <div className="plans__card-cost">
                ₹{plan.cost}
                <span>/week</span>
              </div>
              <div className="plans__card-payout-row">
                <span className="plans__card-payout-label">Auto payout</span>
                <span className="plans__card-payout-val">₹{plan.payout}</span>
              </div>
              <div className="plans__card-divider" />
              <ul className="plans__card-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <span className="plans__check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className={`plans__card-select ${selected === plan.id ? 'selected' : ''}`}>
                {selected === plan.id ? '✓ Selected' : 'Select Plan'}
              </div>
            </div>
          ))}
        </div>

        {/* Summary + CTA */}
        {selected && (
          <div className="plans__summary animate-fadeInUp">
            <div className="plans__summary-left">
              <div className="plans__summary-label">Selected Plan</div>
              <div className="plans__summary-plan">{PLANS.find(p => p.id === selected)?.name} Plan</div>
              <div className="plans__summary-detail">
                ₹{PLANS.find(p => p.id === selected)?.cost}/week · Payout up to ₹{PLANS.find(p => p.id === selected)?.payout}
              </div>
            </div>
            <button
              className={`plans__buy-btn ${loading ? 'loading' : ''}`}
              onClick={handleBuy}
              disabled={loading}
            >
              {loading ? (
                <><span className="register__spinner" /> Activating Policy...</>
              ) : (
                'Activate Protection →'
              )}
            </button>
          </div>
        )}

        {/* FAQ */}
        <div className="plans__faq">
          {[
            { q: 'When does my coverage start?', a: 'Immediately after subscribing. You are covered from the next rainfall or AQI check.' },
            { q: 'How are payouts delivered?', a: 'Payouts are credited to your Helion wallet within minutes of a trigger event. You can withdraw via UPI.' },
            { q: 'What if I miss a week?', a: 'Coverage pauses and resumes when you next subscribe. No penalties for gaps.' },
            { q: 'Can I change plans?', a: 'Yes, plan changes take effect at the start of your next weekly cycle.' },
          ].map((item, i) => (
            <div key={i} className="plans__faq-item">
              <div className="plans__faq-q">Q. {item.q}</div>
              <div className="plans__faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
