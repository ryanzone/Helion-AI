import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './Dashboard.css';
import { API_BASE, ML_BASE } from "../api";

const MOCK_WEATHER = {
  Mumbai: { temp: 31, rain: 42, aqi: 156, humidity: 88, wind: 18 },
  Delhi: { temp: 28, rain: 12, aqi: 312, humidity: 62, wind: 9 },
  Bangalore: { temp: 24, rain: 28, aqi: 95, humidity: 74, wind: 12 },
  Chennai: { temp: 34, rain: 8, aqi: 85, humidity: 91, wind: 14 },
  Hyderabad: { temp: 30, rain: 55, aqi: 188, humidity: 78, wind: 11 },
  Pune: { temp: 26, rain: 10, aqi: 80, humidity: 60, wind: 15 },
  Kolkata: { temp: 35, rain: 90, aqi: 110, humidity: 95, wind: 22 },
  Ahmedabad: { temp: 40, rain: 0, aqi: 130, humidity: 20, wind: 5 },
  default: { temp: 29, rain: 22, aqi: 135, humidity: 75, wind: 13 },
};

const MOCK_HISTORY = [
  { date: 'Mon', rain: 12, payout: 0 },
  { date: 'Tue', rain: 34, payout: 0 },
  { date: 'Wed', rain: 68, payout: 500 },
  { date: 'Thu', rain: 22, payout: 0 },
  { date: 'Fri', rain: 45, payout: 0 },
  { date: 'Sat', rain: 78, payout: 500 },
  { date: 'Sun', rain: 19, payout: 0 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [weather, setWeather] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [mlData, setMlData] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('helion_user');
    if (!rawUser) {
      navigate('/register');
      return;
    }
    
    const u = JSON.parse(rawUser);
    if (!u.name || !u.city) {
      navigate('/register');
      return;
    }
    
    setUser(u);
    const city = u.city;
    
    // Initial mock weather for immediate display
    const w = MOCK_WEATHER[city] || MOCK_WEATHER.default;
    setWeather(w);

    // Try ML service for REAL data
   fetch(`${ML_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city })
    })
      .then(r => r.json())
      .then(d => {
        setMlData(d);
        // Sync weather and risk with real ML data
        if (d.weather) {
          setWeather({
            ...d.weather,
            rain: d.weather.rainfall, // map for UI compatibility
            aqi: w.aqi // keep mock aqi as ML service doesn't provide it yet
          });
        }
        if (d.probability !== undefined) {
          setRiskScore(Math.round(d.probability * 100));
        }
      })
      .catch(() => {
        // Fallback calculation if service is down
        let risk = 0;
        if (w.rain > 50) risk += 40;
        else if (w.rain > 30) risk += 20;
        if (w.aqi > 300) risk += 35;
        risk = Math.min(risk, 98);
        setRiskScore(risk);
        setMlData({ 
          probability: risk / 100, 
          dynamic_premium: u.planCost || 40, 
          risk_label: risk > 50 ? 'HIGH' : risk > 25 ? 'MEDIUM' : 'LOW' 
        });
      });
  }, [navigate]);

  if (!user.name) return null; // Avoid flashing static layout while redirecting

  const plan = user.plan || 'standard';
  const wallet = user.wallet || 1000;
  const planPayout = user.planPayout || 500;
  const trustScore = user.trustScore || 94;

  const triggerFired = weather && weather.rain >= 50;
  const aqiFired = weather && weather.aqi >= 300;

  const getRiskColor = (score) => {
    if (score >= 60) return '#ef4444';
    if (score >= 30) return '#f97316';
    return '#10b981';
  };

  const getRiskLabel = (score) => {
    if (score >= 60) return 'HIGH RISK';
    if (score >= 30) return 'MODERATE';
    return 'LOW RISK';
  };

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        {/* Header */}
        <div className="dashboard__header">
          <div>
            <div className="dashboard__greeting">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span>{user.name}</span> 👋
            </div>
            <div className="dashboard__subgreeting">
              {user.city} · {user.platform} Partner ·{' '}
              <span className={`dashboard__policy-badge ${user.policyActive ? 'active' : 'inactive'}`}>
                {user.policyActive ? '🛡️ Policy Active' : '⚠️ No Active Policy'}
              </span>
            </div>
          </div>
          <Link to="/demo" className="dashboard__demo-btn">
            🎬 Run Live Demo
          </Link>
        </div>

        {/* Alert banner */}
        {(triggerFired || aqiFired) && (
          <div className="dashboard__alert animate-fadeInUp">
            <span className="dashboard__alert-icon">{triggerFired ? '🌧️' : '🌫️'}</span>
            <div>
              <div className="dashboard__alert-title">
                {triggerFired ? `Heavy Rain Alert — ${weather.rain}mm detected!` : `High AQI Alert — ${weather.aqi} detected!`}
              </div>
              <div className="dashboard__alert-sub">
                Trigger threshold exceeded. Auto-payout of ₹{planPayout} is being processed.
              </div>
            </div>
            <div className="dashboard__alert-payout">₹{planPayout} <span>Processing</span></div>
          </div>
        )}

        {/* Top stats */}
        <div className="dashboard__stats">
          {/* Wallet */}
          <div className="dashboard__stat dashboard__stat--wallet">
            <div className="dashboard__stat-label">Wallet Balance</div>
            <div className="dashboard__stat-val dashboard__stat-val--wallet">₹{wallet.toLocaleString()}</div>
            <div className="dashboard__stat-sub">+₹500 this week</div>
            <div className="dashboard__wallet-bar">
              <div style={{ width: `${Math.min((wallet / 5000) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Plan */}
          <div className="dashboard__stat">
            <div className="dashboard__stat-label">Active Plan</div>
            <div className="dashboard__stat-plan">{plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
            <div className="dashboard__stat-sub">₹{planPayout} per trigger event</div>
            <Link to="/plans" className="dashboard__upgrade-link">Upgrade →</Link>
          </div>

          {/* Risk Score */}
          <div className="dashboard__stat">
            <div className="dashboard__stat-label">Today's Risk Score</div>
            <div className="dashboard__risk-ring" style={{ '--risk-color': getRiskColor(riskScore) }}>
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke={getRiskColor(riskScore)}
                  strokeWidth="6"
                  strokeDasharray={`${(riskScore / 100) * 213.6} 213.6`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${getRiskColor(riskScore)})` }}
                />
              </svg>
              <div className="dashboard__risk-label">
                <div className="dashboard__risk-num">{riskScore}%</div>
                <div className="dashboard__risk-tag" style={{ color: getRiskColor(riskScore) }}>
                  {getRiskLabel(riskScore)}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Score */}
          <div className="dashboard__stat">
            <div className="dashboard__stat-label">Trust Score</div>
            <div className="dashboard__trust-score">{trustScore}<span>/100</span></div>
            <div className="dashboard__trust-badges">
              <span className="badge green">✓ GPS verified</span>
              <span className="badge green">✓ Motion OK</span>
              <span className="badge blue">✓ Device clean</span>
            </div>
          </div>
        </div>

        {/* Weather + ML */}
        <div className="dashboard__middle">
          {/* Weather */}
          <div className="dashboard__weather">
            <div className="dashboard__card-title">
              <span>🌤️</span> Live Weather — {user.city}
            </div>
            {weather && (
              <div className="dashboard__weather-grid">
                <div className="dashboard__weather-item">
                  <div className="dashboard__weather-icon">🌡️</div>
                  <div className="dashboard__weather-val">{weather.temp}°C</div>
                  <div className="dashboard__weather-label">Temperature</div>
                </div>
                <div className={`dashboard__weather-item ${weather.rain >= 50 ? 'triggered' : ''}`}>
                  <div className="dashboard__weather-icon">🌧️</div>
                  <div className="dashboard__weather-val">{weather.rain}mm</div>
                  <div className="dashboard__weather-label">Rainfall</div>
                  {weather.rain >= 50 && <div className="dashboard__weather-alert">⚡ TRIGGERED</div>}
                </div>
                <div className={`dashboard__weather-item ${weather.aqi >= 300 ? 'triggered' : ''}`}>
                  <div className="dashboard__weather-icon">🌫️</div>
                  <div className="dashboard__weather-val">{weather.aqi}</div>
                  <div className="dashboard__weather-label">AQI</div>
                  {weather.aqi >= 300 && <div className="dashboard__weather-alert">⚡ TRIGGERED</div>}
                </div>
                <div className="dashboard__weather-item">
                  <div className="dashboard__weather-icon">💧</div>
                  <div className="dashboard__weather-val">{weather.humidity}%</div>
                  <div className="dashboard__weather-label">Humidity</div>
                </div>
              </div>
            )}
          </div>

          {/* ML Prediction */}
          <div className="dashboard__ml">
            <div className="dashboard__card-title">
              <span>🧠</span> AI Risk Prediction
            </div>
            {mlData && (
              <>
                <div className="dashboard__ml-prob">
                  <div className="dashboard__ml-prob-label">Trigger Probability (Next 24h)</div>
                  <div className="dashboard__ml-prob-bar">
                    <div
                      className="dashboard__ml-prob-fill"
                      style={{
                        width: `${(mlData.probability * 100).toFixed(0)}%`,
                        background: getRiskColor(mlData.probability * 100)
                      }}
                    />
                  </div>
                  <div className="dashboard__ml-prob-val">
                    {(mlData.probability * 100).toFixed(0)}%
                    <span style={{ color: getRiskColor(mlData.probability * 100) }}>
                      {' '}{mlData.risk_label}
                    </span>
                  </div>
                </div>
                <div className="dashboard__ml-premium">
                  <div className="dashboard__ml-premium-label">AI-Adjusted Premium</div>
                  <div className="dashboard__ml-premium-val">₹{mlData.dynamic_premium}<span>/week</span></div>
                  {mlData.dynamic_premium !== (user.planCost || 40) && (
                    <div className="dashboard__ml-premium-note">
                      {mlData.dynamic_premium > (user.planCost || 40) ? '↑ Adjusted for high risk zone' : '↓ Lower risk — savings applied'}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="dashboard__chart-card">
          <div className="dashboard__card-title">
            <span>📈</span> 7-Day Rainfall & Payouts
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={12} />
              <YAxis stroke="var(--text-dim)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Area type="monotone" dataKey="rain" stroke="#38bdf8" fill="url(#rainGrad)" strokeWidth={2} name="Rainfall (mm)" />
              <Line type="monotone" dataKey="payout" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Payout (₹)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="dashboard__chart-legend">
            <span className="dash__legend-item blue">━ Rainfall (mm)</span>
            <span className="dash__legend-item green">━ Payout (₹)</span>
          </div>
        </div>

        {/* Transaction history */}
        <div className="dashboard__txns">
          <div className="dashboard__card-title"><span>🧾</span> Recent Payouts</div>
          <div className="dashboard__txn-list">
            {[
              { date: 'Today, 2:34 PM', event: 'Rainfall 78mm — Premium Trigger', amount: 800, status: 'completed' },
              { date: 'Sat, 11:12 AM', event: 'Rainfall 68mm — Standard Trigger', amount: 500, status: 'completed' },
              { date: 'Wed, 3:45 PM', event: 'AQI 312 — Flood Zone Alert', amount: 500, status: 'completed' },
              { date: 'Mon, 9:20 AM', event: 'Rainfall check — below threshold', amount: 0, status: 'no-trigger' },
            ].map((txn, i) => (
              <div key={i} className="dashboard__txn">
                <div className={`dashboard__txn-icon ${txn.amount > 0 ? 'green' : 'grey'}`}>
                  {txn.amount > 0 ? '💸' : '—'}
                </div>
                <div className="dashboard__txn-info">
                  <div className="dashboard__txn-event">{txn.event}</div>
                  <div className="dashboard__txn-date">{txn.date}</div>
                </div>
                <div className={`dashboard__txn-amount ${txn.amount > 0 ? 'green' : 'dim'}`}>
                  {txn.amount > 0 ? `+₹${txn.amount}` : 'No payout'}
                </div>
                <div className={`dashboard__txn-status ${txn.status}`}>
                  {txn.status === 'completed' ? 'Credited' : 'No trigger'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
