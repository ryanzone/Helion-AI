# Helion AI — Web Frontend

> AI-Powered Parametric Income Protection for Gig Workers

This is the **browser-based web application** for Helion AI — designed for judges, investors, and demo purposes. It works fully standalone with mock data, and also connects to the live backend + ML service when running locally.

---

## 🚀 Quick Start (3 commands)

```bash
cd frontend-web
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, how it works, plans |
| `/register` | 3-step registration flow |
| `/plans` | Plan selection (Basic / Standard / Premium) |
| `/dashboard` | Live weather, risk score, wallet, AI predictions |
| `/demo` | **Interactive simulation** — run a full payout flow |

---

## 🎬 Demo Page (Key Feature for Judges)

The `/demo` page lets you:

1. **Select a city** (Mumbai, Delhi, Chennai, Hyderabad)
2. **Adjust rainfall and AQI** sliders manually
3. **Run the simulation** — watch the full pipeline:
   - Trigger detection
   - Multi-signal fraud verification
   - Trust score calculation
   - Auto wallet credit
4. See the **fraud attack scenario** — how GPS spoofing is caught

---

## 🔗 Backend Integration

The frontend automatically tries to connect to:
- **Backend API**: `http://localhost:5000` (gigshield-backend)
- **ML Service**: `http://localhost:6000` (ml-service)

If either is unavailable, it falls back to realistic mock data. **The UI works fully without the backend running.**

---

## 🛠️ Tech Stack

- **React 18** + React Router v6
- **Recharts** for data visualizations
- **CSS Variables** design system (no external UI library)
- Google Fonts: Syne (display) + DM Sans (body)

---

## 🌐 Deployment

### Frontend → Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# From frontend-web folder
vercel
```

Set environment variable if needed:
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

### Backend → Render

1. Go to [render.com](https://render.com)
2. New → Web Service → connect GitHub repo
3. Root directory: `gigshield-backend`
4. Build command: `npm install`
5. Start command: `npm start`

### ML Service → Render

1. New → Web Service
2. Root directory: `ml-service`
3. Build command: `pip install -r requirements.txt`
4. Start command: `python app.py`

---

## 📸 Screenshots

> Register → Plans → Dashboard → Live Demo → Fraud Detection

---

## 👥 Team Helion

Built for the hackathon — Helion AI provides instant income protection for gig economy workers through parametric insurance and AI-driven fraud prevention.
