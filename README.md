# 🚀 Helion AI
AI-Powered Parametric Income Protection for Gig Workers

## 🌐 Live Demo

🚀 **[Launch Helion AI](https://helionai.netlify.app/)**

👉 Experience real-time parametric insurance with AI-powered risk detection and automatic payouts.

## 📌 Problem Statement
Gig workers such as delivery partners rely on daily income. External factors like heavy rain, poor air quality, and floods reduce their working hours, leading to 20–30% income loss.

Currently, there is no fast, transparent, and automated system to compensate this income loss.

## 👤 User Persona
**Rahul – Delivery Partner**
- Age: 26
- Daily income: ₹600
- Works 8–10 hours/day
- Problem:
  - Cannot work during bad weather
  - Loses daily earnings

👉 Needs quick and simple income protection without complex claims.

## 💡 Solution Overview
Helion AI is a mobile-based parametric insurance platform that:
- Offers weekly subscription plans
- Monitors real-time weather & AQI
- Provides automatic payouts when conditions are met
- Uses AI for prediction and fraud detection

## ⚙️ Workflow
1. User registers on the app
2. Selects a weekly plan
3. System securely tracks user location and environmental conditions in real-time
4. If condition exceeds threshold → 💸 Automatic payout is credited

👉 No manual claims required

## 💰 Pricing Model

| Plan     | Cost       | Payout |
|----------|------------|--------|
| Basic    | ₹20/week   | ₹200   |
| Standard | ₹40/week   | ₹500   |
| Premium  | ₹60/week   | ₹800   |

✔ Affordable ✔ Matches gig workers' earning cycle

## 🌐 Parametric Triggers
- 🌧️ Rainfall > 50 mm
- 🌫️ AQI > 300
- 🌊 Government flood alert

👉 Based on real-world data → automatic payouts, no manual claims
# Installation and Setup
```
# Clone repo
git clone https://github.com/ryanzone/Helion-AI.git

# Navigate
cd Helion-AI

# Install dependencies
npm install

# Run backend
npm start

# Run mobile app
npx expo start
```
## 🧠 AI/ML Integration
- **Risk Prediction:** Uses historical weather + payout data to estimate probability of trigger events
- **Dynamic Pricing:** Adjust premiums based on location risk profile
- **Fraud Detection:** Rule-based + anomaly detection on: motion patterns, IP clustering, device fingerprints
👉 Result: Fraud payouts are blocked before liquidity is impacted.
## 🛠️ Tech Stack
- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express
- **Database:** Supabase (PostgreSQL)
- **APIs:** Weather API, AQI API

## 🛡️ Fraud Prevention

### The Threat
A coordinated syndicate can use GPS-spoofing applications to fake their location inside a parametric trigger zone, tricking the system into issuing mass false payouts and draining the liquidity pool.

### Differentiation — Genuine Worker vs Bad Actor
Helion's AI layer does not rely on GPS alone. Every payout decision is scored against a multi-signal trust model:

- **Motion consistency:** A genuine worker in heavy rain shows low or erratic movement via the device accelerometer. A spoofed user sitting at home shows zero motion or normal indoor activity patterns inconsistent with being on a delivery route
- **Historical route fingerprint:** Each user builds a location history over time. The system flags claims where the reported location has never appeared in the user's past 30-day route data
- **Device sensor cross-check:** Real weather exposure affects GPS signal quality, network handoffs between cell towers, and battery drain patterns. A spoofed location from a stable home environment produces clean sensor readings that contradict the claimed adverse conditions
- **Session behaviour:** Genuine workers in bad weather open the app briefly to check status. Coordinated fraud rings show simultaneous sessions with identical interaction patterns across multiple accounts
## 🚨 Market Crash Response
- During a simulated “Market Crash”, fraud rings attempt to drain the system using GPS spoofing.
  
- Helion AI prevents this by:
  - Multi-signal verification (not GPS alone)
  - Ring detection via timing + IP clustering
  - Device fingerprinting
  - Tiered payout control (Green / Yellow / Red)
### Data Points — Beyond GPS

| Signal | What It Reveals |
|--------|----------------|
| Accelerometer & gyroscope | Whether the device is actually in motion or stationary |
| Cell tower triangulation | Independent location verification separate from GPS |
| Network IP address | Multiple claims from the same IP indicate a shared location |
| Weather API cross-reference | Claimed location's weather must match a third-party source |
| Claim timing correlation | Hundreds of claims firing simultaneously triggers a ring detection alert |
| Device fingerprint | Flags multiple accounts operating from the same physical device |
| Onboarding velocity | Accounts created in bulk before a weather event are scored high-risk |

### UX Balance — Handling Flagged Claims Fairly
A genuine worker in a flood zone may have poor GPS signal and inconsistent sensor data which could look suspicious. Helion handles this with a tiered review system:

- 🟢 **Green (auto-approved):** Trust score above threshold, all signals consistent → payout credited immediately
- 🟡 **Yellow (soft flag):** One or two inconsistent signals → payout held for max 2 hours, worker notified in-app, single photo verification resolves it instantly
- 🔴 **Red (hard flag):** Multiple high-confidence fraud signals → payout withheld, escalated to manual review, worker notified with clear reason and appeal option. No account suspension without human confirmation
## 🔧 System Architecture
- Mobile app collects:
  -GPS
  -Sensor data
  -Session activity
Backend processes:
  -Weather & AQI APIs
  -User data
  -Trigger conditions
AI Engine:
  -Calculates risk score
  -Runs fraud detection model
  -Validates multi-signal trust score
Decision Layer:
  -If trigger + trust score valid → payout
  -Else → flag (yellow/red)
Payment Service:
  -Instant payout to user wallet

## 🗓️ Development Plan

**Week 1:**
- Research & ideation
- Define workflow
- UI/UX design

**Week 2:**
- Build prototype
- Simulate triggers
- Prepare demo

## 🧪 Prototype Scope
- Basic mobile UI (login, plans, dashboard)
- Simulated trigger system (mock data)
- Dummy payout logic
- End-to-end workflow demo

👉 Focus: Concept validation, not full implementation

## 🔭 Future Scope
- Integration with live Weather & AQI APIs for real-time parametric triggers
- Aadhaar-based KYC for identity verification at onboarding
- UPI/bank account linking for instant payout disbursement
- ML model trained on historical claim and weather data for dynamic risk scoring
- Expansion to other gig categories — cab drivers, freelancers, construction workers
- Government flood alert API integration for automatic zone-based triggers
- Multi-language support for regional gig worker accessibility

## 🎯 Conclusion
Helion AI provides:
- Instant income protection
- Affordable weekly plans
- Automated, claim-free payouts

👉 A scalable solution for gig economy stability
