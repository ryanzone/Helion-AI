import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const STATS = [
  { value: '2.3Cr+', label: 'Gig Workers at Risk' },
  { value: '₹600', label: 'Avg. Daily Income Lost' },
  { value: '<2min', label: 'Payout Processing Time' },
  { value: '97.4%', label: 'Fraud Detection Accuracy' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '📝', title: 'Register', desc: 'Sign up with your gig platform and city. Takes under 2 minutes.' },
  { step: '02', icon: '🛡️', title: 'Pick a Plan', desc: 'Choose Basic, Standard, or Premium — starting at just ₹20/week.' },
  { step: '03', icon: '🌧️', title: 'We Watch the Weather', desc: 'Our AI monitors rainfall, AQI, and flood alerts in real-time.' },
  { step: '04', icon: '💸', title: 'Auto Payout', desc: 'When conditions are triggered, your wallet is credited instantly.' },
];

const TRIGGERS = [
  { icon: '🌧️', label: 'Rainfall', value: '> 50mm', color: '#38bdf8' },
  { icon: '🌫️', label: 'AQI', value: '> 300', color: '#f59e0b' },
  { icon: '🌊', label: 'Flood Alert', value: 'Govt. Notice', color: '#ef4444' },
];

export default function Landing() {
  const [raindrops, setRaindrops] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const drops = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${0.6 + Math.random() * 0.8}s`,
      opacity: 0.2 + Math.random() * 0.5,
    }));
    setRaindrops(drops);
  }, []);

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing__nav">
        <div className="landing__nav-inner">
          <div className="landing__logo">
            <span className="landing__logo-icon">⚡</span>
            <span>Helion<span className="accent">AI</span></span>
          </div>
          <div className="landing__nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/demo">Live Demo</Link>
            <Link to="/register" className="landing__nav-cta">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing__hero" ref={heroRef}>
        {/* Rain animation */}
        <div className="landing__rain">
          {raindrops.map(drop => (
            <div
              key={drop.id}
              className="landing__raindrop"
              style={{
                left: drop.left,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
                opacity: drop.opacity,
              }}
            />
          ))}
        </div>

        {/* Glowing orbs */}
        <div className="landing__orb landing__orb--1" />
        <div className="landing__orb landing__orb--2" />

        <div className="landing__hero-content">
          <div className="landing__badge animate-fadeInUp">
            <span className="landing__badge-dot" />
            AI-Powered Parametric Insurance
          </div>

          <h1 className="landing__headline animate-fadeInUp delay-1">
            Your income<br />
            <span className="landing__headline-accent">deserves protection</span><br />
            rain or shine.
          </h1>

          <p className="landing__subtext animate-fadeInUp delay-2">
            Helion AI automatically detects bad weather, flood alerts, and air quality crises —
            and credits your wallet <em>before you even file a claim.</em>
          </p>

          <div className="landing__hero-actions animate-fadeInUp delay-3">
            <Link to="/register" className="landing__btn-primary">
              Start Protection — Free Trial
              <span className="landing__btn-arrow">→</span>
            </Link>
            <Link to="/demo" className="landing__btn-secondary">
              Watch Live Demo
            </Link>
          </div>

          {/* Trigger pills */}
          <div className="landing__triggers animate-fadeInUp delay-4">
            {TRIGGERS.map(t => (
              <div key={t.label} className="landing__trigger-pill" style={{ '--pill-color': t.color }}>
                <span>{t.icon}</span>
                <span>{t.label} {t.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live widget */}
        <div className="landing__live-card animate-fadeInUp delay-3">
          <div className="landing__live-header">
            <span className="landing__live-dot" />
            <span>LIVE PAYOUT EVENT</span>
          </div>
          <div className="landing__live-city">Mumbai, Maharashtra</div>
          <div className="landing__live-stat">
            <span className="landing__live-rain">🌧️ 68mm</span>
            <span className="landing__live-threshold">Threshold: 50mm ✓</span>
          </div>
          <div className="landing__live-payout">
            <div className="landing__live-payout-label">Auto-Payout Triggered</div>
            <div className="landing__live-amount">₹500 <span>credited</span></div>
          </div>
          <div className="landing__live-users">
            <div className="landing__live-avatars">
              {['R', 'P', 'A', 'K', 'S'].map((l, i) => (
                <div key={i} className="landing__live-avatar">{l}</div>
              ))}
            </div>
            <span>1,247 workers paid today</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing__stats">
        {STATS.map((s, i) => (
          <div key={i} className="landing__stat">
            <div className="landing__stat-value">{s.value}</div>
            <div className="landing__stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="landing__how">
        <div className="landing__section-label">How It Works</div>
        <h2 className="landing__section-title">Protection that runs itself</h2>
        <div className="landing__steps">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="landing__step">
              <div className="landing__step-num">{step.step}</div>
              <div className="landing__step-icon">{step.icon}</div>
              <h3 className="landing__step-title">{step.title}</h3>
              <p className="landing__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans teaser */}
      <section className="landing__plans-teaser">
        <div className="landing__section-label">Pricing</div>
        <h2 className="landing__section-title">Less than a cup of chai</h2>
        <div className="landing__plan-cards">
          {[
            { name: 'Basic', cost: '₹20', payout: '₹200', period: '/week', color: '#38bdf8' },
            { name: 'Standard', cost: '₹40', payout: '₹500', period: '/week', color: '#2563ff', featured: true },
            { name: 'Premium', cost: '₹60', payout: '₹800', period: '/week', color: '#f59e0b' },
          ].map((plan, i) => (
            <div key={i} className={`landing__plan-card ${plan.featured ? 'landing__plan-card--featured' : ''}`} style={{ '--plan-color': plan.color }}>
              {plan.featured && <div className="landing__plan-badge">Most Popular</div>}
              <div className="landing__plan-name">{plan.name}</div>
              <div className="landing__plan-cost">{plan.cost}<span>{plan.period}</span></div>
              <div className="landing__plan-payout">Payout: <strong>{plan.payout}</strong></div>
            </div>
          ))}
        </div>
        <Link to="/plans" className="landing__btn-primary" style={{ display: 'inline-flex', marginTop: '40px' }}>
          View All Plans →
        </Link>
      </section>

      {/* CTA */}
      <section className="landing__cta">
        <div className="landing__cta-orb" />
        <h2 className="landing__cta-title">Don't lose income to the rain.</h2>
        <p className="landing__cta-sub">Join thousands of gig workers who get paid automatically when conditions turn bad.</p>
        <Link to="/register" className="landing__btn-primary">
          Get Protected Now — It's Free to Start
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__logo">
          <span>⚡</span>
          <span>Helion<span className="accent">AI</span></span>
        </div>
        <p>AI-Powered Parametric Income Protection for Gig Workers</p>
        <p className="landing__footer-team">Built with ❤️ for the Hackathon · Team Helion</p>
      </footer>
    </div>
  );
}
