import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
const PLATFORMS = ['Swiggy', 'Zomato', 'Dunzo', 'Blinkit', 'Rapido', 'Ola', 'Uber', 'Porter', 'Other'];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', city: '', platform: '', avgIncome: '', aadhaar: ''
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Try real backend, fallback to mock
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('helion_user', JSON.stringify({ ...form, ...data }));
      } else throw new Error('Backend unavailable');
    } catch {
      // Mock fallback
      localStorage.setItem('helion_user', JSON.stringify({
        ...form,
        id: 'USR' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        wallet: 0,
        trustScore: 92,
        registered: true
      }));
    }
    setTimeout(() => {
      setLoading(false);
      navigate('/plans');
    }, 1200);
  };

  const canProceed = {
    1: form.name && form.phone.length === 10,
    2: form.city && form.platform,
    3: form.avgIncome,
  }[step];

  return (
    <div className="register">
      <div className="register__container">
        <div className="register__left">
          <div className="register__badge">
            <span className="dot" />
            Secure Registration
          </div>
          <h1 className="register__title">
            One registration.<br />
            <span>Lifelong protection.</span>
          </h1>
          <p className="register__sub">
            Set up your Helion AI account in under 2 minutes.
            Your income gets protected starting this week.
          </p>

          {/* Perks */}
          <div className="register__perks">
            {[
              { icon: '⚡', text: 'Instant payout when triggers fire' },
              { icon: '🔒', text: 'Bank-grade data encryption' },
              { icon: '🚫', text: 'Zero manual claim process' },
              { icon: '📱', text: 'Works across all gig platforms' },
            ].map((p, i) => (
              <div key={i} className="register__perk">
                <span className="register__perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>

          {/* Rahul persona card */}
          <div className="register__persona">
            <div className="register__persona-avatar">R</div>
            <div>
              <div className="register__persona-name">Rahul, 26 · Swiggy Partner</div>
              <div className="register__persona-quote">"Got ₹500 credited automatically when it rained 68mm. No forms, no calls."</div>
            </div>
          </div>
        </div>

        <div className="register__right">
          {/* Progress */}
          <div className="register__progress">
            {[1, 2, 3].map(s => (
              <div key={s} className="register__progress-item">
                <div className={`register__progress-dot ${s <= step ? 'active' : ''} ${s < step ? 'done' : ''}`}>
                  {s < step ? '✓' : s}
                </div>
                <div className={`register__progress-label ${s === step ? 'active' : ''}`}>
                  {['Personal', 'Work Info', 'Income'][s - 1]}
                </div>
                {s < 3 && <div className={`register__progress-line ${s < step ? 'done' : ''}`} />}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="register__step animate-fadeInUp">
              <h2 className="register__step-title">Personal Details</h2>
              <div className="register__field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Rahul Kumar"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>
              <div className="register__field">
                <label>Mobile Number</label>
                <div className="register__phone-input">
                  <span className="register__phone-prefix">+91</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
              <div className="register__field">
                <label>Aadhaar (last 4 digits)</label>
                <input
                  type="text"
                  placeholder="XXXX"
                  maxLength={4}
                  value={form.aadhaar}
                  onChange={e => set('aadhaar', e.target.value.replace(/\D/g, ''))}
                />
                <span className="register__hint">Used for identity verification only. Stored encrypted.</span>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="register__step animate-fadeInUp">
              <h2 className="register__step-title">Work Information</h2>
              <div className="register__field">
                <label>Your City</label>
                <div className="register__city-grid">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      className={`register__city-btn ${form.city === city ? 'active' : ''}`}
                      onClick={() => set('city', city)}
                      type="button"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              <div className="register__field">
                <label>Gig Platform</label>
                <div className="register__platform-grid">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      className={`register__platform-btn ${form.platform === p ? 'active' : ''}`}
                      onClick={() => set('platform', p)}
                      type="button"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="register__step animate-fadeInUp">
              <h2 className="register__step-title">Income Details</h2>
              <div className="register__field">
                <label>Average Daily Income (₹)</label>
                <input
                  type="number"
                  placeholder="600"
                  value={form.avgIncome}
                  onChange={e => set('avgIncome', e.target.value)}
                />
              </div>
              {form.avgIncome && (
                <div className="register__preview animate-fadeInUp">
                  <div className="register__preview-title">Your Estimated Coverage</div>
                  <div className="register__preview-rows">
                    {[
                      { plan: 'Basic — ₹20/wk', payout: '₹200', risk: 'Low coverage' },
                      { plan: 'Standard — ₹40/wk', payout: '₹500', risk: 'Recommended', highlight: true },
                      { plan: 'Premium — ₹60/wk', payout: '₹800', risk: 'Full coverage' },
                    ].map((row, i) => (
                      <div key={i} className={`register__preview-row ${row.highlight ? 'highlight' : ''}`}>
                        <span>{row.plan}</span>
                        <span className="green">{row.payout} payout</span>
                        <span className="dim">{row.risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            className={`register__btn ${loading ? 'loading' : ''}`}
            onClick={handleNext}
            disabled={!canProceed || loading}
          >
            {loading ? (
              <span className="register__spinner" />
            ) : step === 3 ? (
              'Create My Account →'
            ) : (
              'Continue →'
            )}
          </button>

          <p className="register__terms">
            By continuing, you agree to Helion AI's Terms of Service and Privacy Policy.
            Your data is encrypted and never sold.
          </p>
        </div>
      </div>
    </div>
  );
}
