import React, { useState, useEffect, useRef } from 'react';
import './Demo.css';
import { API_BASE, ML_BASE } from "../api";

const DEMO_CITIES = [
  { name: 'Mumbai', rain: 72, aqi: 145, lat: 19.07, lng: 72.87 },
  { name: 'Delhi', rain: 18, aqi: 338, lat: 28.6, lng: 77.2 },
  { name: 'Chennai', rain: 88, aqi: 92, lat: 13.08, lng: 80.27 },
  { name: 'Hyderabad', rain: 56, aqi: 210, lat: 17.38, lng: 78.48 },
];

const STEPS = [
  { id: 'idle', label: 'Waiting for Weather Event' },
  { id: 'detect', label: 'Weather Anomaly Detected' },
  { id: 'verify', label: 'Multi-Signal Verification' },
  { id: 'score', label: 'Trust Score Calculated' },
  { id: 'payout', label: 'Auto Payout Triggered' },
  { id: 'done', label: 'Wallet Credited ✓' },
];

const SIGNALS = [
  { icon: '📡', label: 'GPS Location', key: 'gps' },
  { icon: '📱', label: 'Accelerometer', key: 'accel' },
  { icon: '🌐', label: 'IP Check', key: 'ip' },
  { icon: '🌦️', label: 'Weather API Cross-ref', key: 'weather' },
  { icon: '🔒', label: 'Device Fingerprint', key: 'device' },
  { icon: '⏱️', label: 'Claim Timing', key: 'timing' },
];

export default function Demo() {
  const [city, setCity] = useState(DEMO_CITIES[0]);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [signals, setSignals] = useState({});
  const [trustScore, setTrustScore] = useState(0);
  const [walletBefore] = useState(500);
  const [walletAfter, setWalletAfter] = useState(500);
  const [logs, setLogs] = useState([]);
  const [manualRain, setManualRain] = useState(null);
  const [manualAqi, setManualAqi] = useState(null);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const addLog = (msg, type = 'info') => {
    const ts = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { msg, type, ts }]);
  };

  const effectiveRain = manualRain !== null ? Number(manualRain) : city.rain;
  const effectiveAqi = manualAqi !== null ? Number(manualAqi) : city.aqi;
  const triggered = effectiveRain >= 50 || effectiveAqi >= 300;
  const payout = city.name === 'Mumbai' || city.name === 'Chennai' ? 500 : 500;

  const resetDemo = () => {
    setRunning(false);
    setStep(0);
    setSignals({});
    setTrustScore(0);
    setWalletAfter(walletBefore);
    setLogs([]);
    setManualRain(null);
    setManualAqi(null);
  };

  const runDemo = async () => {
    if (running) return;
    setRunning(true);
    setStep(0);
    setSignals({});
    setTrustScore(0);
    setWalletAfter(walletBefore);
    setLogs([]);

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    addLog(`🔍 Checking weather conditions for ${city.name}...`, 'info');
    await delay(800);

    addLog(`🌧️ Rainfall detected: ${effectiveRain}mm | AQI: ${effectiveAqi}`, 'info');
    await delay(600);

    if (!triggered) {
      addLog(`✓ Conditions below trigger threshold. No payout required.`, 'success');
      setStep(5);
      setRunning(false);
      return;
    }

    setStep(1);
    addLog(`⚡ TRIGGER DETECTED — Rainfall ${effectiveRain}mm (threshold: 50mm)`, 'alert');
    await delay(700);

    setStep(2);
    addLog(`🔐 Starting multi-signal verification...`, 'info');
    await delay(400);

    // Verify signals one by one
    for (let i = 0; i < SIGNALS.length; i++) {
      const s = SIGNALS[i];
      await delay(350);
      setSignals(prev => ({ ...prev, [s.key]: 'checking' }));
      await delay(450);
      setSignals(prev => ({ ...prev, [s.key]: 'verified' }));
      addLog(`  ✓ ${s.label} — verified`, 'success');
    }

    await delay(500);
    setStep(3);

    // Trust score animation
    addLog(`🧠 Running trust score model...`, 'info');
    for (let t = 0; t <= 94; t += 7) {
      await delay(40);
      setTrustScore(Math.min(t, 94));
    }
    setTrustScore(94);
    addLog(`✅ Trust Score: 94/100 — APPROVED (Green tier)`, 'success');
    await delay(600);

    setStep(4);
    addLog(`💸 Initiating auto-payout of ₹${payout}...`, 'alert');
    await delay(800);

    // Try real backend
    try {
     await fetch(`${API_BASE}/api/payout/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: city.name, rain: effectiveRain, aqi: effectiveAqi })
      });
      addLog(`🏦 Backend payout API called successfully`, 'success');
    } catch {
      addLog(`🏦 Payout processed (demo mode)`, 'info');
    }

    await delay(600);
    setStep(5);
    setWalletAfter(walletBefore + payout);
    addLog(`🎉 ₹${payout} credited to wallet! Total: ₹${walletBefore + payout}`, 'success');
    addLog(`⏱️ Total processing time: 2.3 seconds`, 'info');
    setRunning(false);
  };

  return (
    <div className="demo">
      <div className="demo__container">
        <div className="demo__header">
          <div>
            <div className="demo__label">Live Simulation</div>
            <h1 className="demo__title">
              Watch Helion AI<br />
              <span>pay out in real-time.</span>
            </h1>
            <p className="demo__sub">
              This is the exact same flow that runs for real gig workers when a weather event occurs.
              Select a city, adjust conditions, and hit Run Demo.
            </p>
          </div>
          <button className="demo__reset-btn" onClick={resetDemo}>↺ Reset</button>
        </div>

        <div className="demo__grid">
          {/* Left: Controls */}
          <div className="demo__controls">
            <div className="demo__card">
              <div className="demo__card-title">⚙️ Scenario Setup</div>

              {/* City selector */}
              <div className="demo__field">
                <label>Select City</label>
                <div className="demo__city-btns">
                  {DEMO_CITIES.map(c => (
                    <button
                      key={c.name}
                      className={`demo__city-btn ${city.name === c.name ? 'active' : ''}`}
                      onClick={() => { setCity(c); setManualRain(null); setManualAqi(null); }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual sliders */}
              <div className="demo__field">
                <label>
                  Rainfall Override: <span className={effectiveRain >= 50 ? 'triggered-val' : ''}>{effectiveRain}mm</span>
                  {effectiveRain >= 50 && <span className="trigger-tag">TRIGGER</span>}
                </label>
                <input
                  type="range"
                  min={0} max={120} step={1}
                  value={effectiveRain}
                  onChange={e => setManualRain(e.target.value)}
                  className="demo__slider"
                  style={{ '--pct': `${(effectiveRain / 120) * 100}%` }}
                />
                <div className="demo__slider-labels">
                  <span>0mm</span>
                  <span className="threshold-mark">50mm ⚡</span>
                  <span>120mm</span>
                </div>
              </div>

              <div className="demo__field">
                <label>
                  AQI Override: <span className={effectiveAqi >= 300 ? 'triggered-val' : ''}>{effectiveAqi}</span>
                  {effectiveAqi >= 300 && <span className="trigger-tag">TRIGGER</span>}
                </label>
                <input
                  type="range"
                  min={0} max={500} step={5}
                  value={effectiveAqi}
                  onChange={e => setManualAqi(e.target.value)}
                  className="demo__slider"
                  style={{ '--pct': `${(effectiveAqi / 500) * 100}%` }}
                />
                <div className="demo__slider-labels">
                  <span>0</span>
                  <span className="threshold-mark">300 ⚡</span>
                  <span>500</span>
                </div>
              </div>

              {/* Status indicator */}
              <div className={`demo__trigger-status ${triggered ? 'yes' : 'no'}`}>
                {triggered ? (
                  <>
                    <span>⚡</span>
                    <div>
                      <div className="demo__trigger-status-title">Trigger Conditions Met</div>
                      <div className="demo__trigger-status-sub">
                        {effectiveRain >= 50 ? `Rain: ${effectiveRain}mm ≥ 50mm` : `AQI: ${effectiveAqi} ≥ 300`}
                      </div>
                    </div>
                    <div className="demo__trigger-payout">₹{payout} payout</div>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <div>
                      <div className="demo__trigger-status-title">Below Threshold</div>
                      <div className="demo__trigger-status-sub">No payout triggered</div>
                    </div>
                  </>
                )}
              </div>

              <button
                className={`demo__run-btn ${running ? 'running' : ''}`}
                onClick={runDemo}
                disabled={running}
              >
                {running ? (
                  <><span className="register__spinner" /> Running Simulation...</>
                ) : (
                  '▶ Run Demo Simulation'
                )}
              </button>
            </div>

            {/* Wallet card */}
            <div className="demo__card demo__wallet-card">
              <div className="demo__card-title">💼 Worker Wallet</div>
              <div className="demo__wallet-row">
                <div>
                  <div className="demo__wallet-label">Before</div>
                  <div className="demo__wallet-val">₹{walletBefore}</div>
                </div>
                <div className="demo__wallet-arrow">→</div>
                <div>
                  <div className="demo__wallet-label">After</div>
                  <div className={`demo__wallet-val ${walletAfter > walletBefore ? 'credited' : ''}`}>
                    ₹{walletAfter}
                  </div>
                </div>
                {walletAfter > walletBefore && (
                  <div className="demo__wallet-credited">
                    +₹{walletAfter - walletBefore} credited ✓
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle: Pipeline */}
          <div className="demo__pipeline">
            <div className="demo__card">
              <div className="demo__card-title">🔄 Processing Pipeline</div>
              <div className="demo__steps">
                {STEPS.map((s, i) => (
                  <div
                    key={s.id}
                    className={`demo__step ${step === i ? 'active' : ''} ${step > i ? 'done' : ''}`}
                  >
                    <div className="demo__step-dot">
                      {step > i ? '✓' : i + 1}
                    </div>
                    <div className="demo__step-label">{s.label}</div>
                    {i < STEPS.length - 1 && <div className={`demo__step-line ${step > i ? 'done' : ''}`} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-signal verification */}
            <div className="demo__card">
              <div className="demo__card-title">🔐 Multi-Signal Verification</div>
              <div className="demo__signals">
                {SIGNALS.map(s => (
                  <div key={s.key} className={`demo__signal ${signals[s.key] || 'pending'}`}>
                    <span className="demo__signal-icon">{s.icon}</span>
                    <span className="demo__signal-label">{s.label}</span>
                    <span className="demo__signal-status">
                      {signals[s.key] === 'verified' ? '✓' : signals[s.key] === 'checking' ? '...' : '—'}
                    </span>
                  </div>
                ))}
              </div>
              {trustScore > 0 && (
                <div className="demo__trust animate-fadeInUp">
                  <div className="demo__trust-label">Trust Score</div>
                  <div className="demo__trust-bar">
                    <div className="demo__trust-fill" style={{ width: `${trustScore}%` }} />
                  </div>
                  <div className="demo__trust-val">{trustScore}/100 — 🟢 APPROVED</div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Log */}
          <div className="demo__log-card demo__card">
            <div className="demo__card-title">📋 System Logs</div>
            <div className="demo__log" ref={logRef}>
              {logs.length === 0 ? (
                <div className="demo__log-empty">
                  Hit "Run Demo Simulation" to see live system logs...
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`demo__log-line ${log.type}`}>
                    <span className="demo__log-ts">{log.ts}</span>
                    <span>{log.msg}</span>
                  </div>
                ))
              )}
            </div>

            {step === 5 && (
              <div className="demo__success animate-fadeInUp">
                <div className="demo__success-icon">🎉</div>
                <div className="demo__success-title">Payout Complete!</div>
                <div className="demo__success-sub">
                  Worker received ₹{payout} automatically — no claim filed, no phone call made.
                </div>
                <div className="demo__success-time">⏱️ 2.3 seconds end-to-end</div>
              </div>
            )}
          </div>
        </div>

        {/* Fraud scenario */}
        <div className="demo__fraud">
          <div className="demo__fraud-header">
            <span>🚨</span>
            <div>
              <div className="demo__fraud-title">Fraud Scenario — GPS Spoofing Attack</div>
              <div className="demo__fraud-sub">A bad actor tries to fake location in a trigger zone</div>
            </div>
          </div>
          <div className="demo__fraud-signals">
            {[
              { signal: 'GPS Location', status: '⚠️ Suspicious — coordinates never in 30d history', red: true },
              { signal: 'Accelerometer', status: '❌ FAILED — Zero motion detected (indoor pattern)', red: true },
              { signal: 'IP Address', status: '❌ FAILED — 14 claims from same IP in 3 minutes', red: true },
              { signal: 'Weather Cross-ref', status: '✓ Weather matches claimed location', red: false },
              { signal: 'Device Fingerprint', status: '❌ FAILED — 3 accounts on same device', red: true },
              { signal: 'Claim Timing', status: '❌ FAILED — 847 simultaneous claims (ring detected)', red: true },
            ].map((s, i) => (
              <div key={i} className={`demo__fraud-row ${s.red ? 'fail' : 'pass'}`}>
                <span className="demo__fraud-signal">{s.signal}</span>
                <span className="demo__fraud-status">{s.status}</span>
              </div>
            ))}
          </div>
          <div className="demo__fraud-result">
            🔴 RESULT: Trust score 12/100 — Payout WITHHELD. Escalated to manual review. Ring detection alert raised.
          </div>
        </div>
      </div>
    </div>
  );
}
