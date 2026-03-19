# GigShield Backend

Backend API for GigShield, built using Node.js and Express.

## 🚀 Overview

This repository contains the server-side API for GigShield, a platform that enables gig workers to file claims, manage plans, and track payouts.

### Main features

- JWT-based authentication
- Claim filing and management
- Dashboard metrics and earnings calculation
- Payout history and plan management
- Health check endpoint

## 🧩 Tech stack

- Node.js
- Express
- SQLite (via Supabase/SQLite driver in `db/supabase.js`)
- JSON Web Tokens (JWT)

## 🛠️ Prerequisites

- Node.js 16+ (or latest LTS)
- npm 8+ (or yarn)

## 📥 Setup

```bash
cd gigshield-backend
npm install
```

## ⚙️ Configuration

Copy environment variables (create `.env` file):

```text
PORT=3000
JWT_SECRET=your_secret_value
DB_FILE=./db/gigshield.db
```

## ▶️ Run the server

```bash
npm start
```

or for development with auto-reload:

```bash
npm run dev
```

## 🧪 DB initialization

Schema script is in `db/schema.sql`. Run this against your SQLite file.

## 🔐 Authentication

Auth routes are under `routes/auth.js` and middleware under `middleware/auth.js`.

- `POST /auth/login`
- `POST /auth/register`

Protected routes require `Authorization: Bearer <token>`.

## 📚 API Endpoints

- `GET /health` — service health check
- `GET /dashboard` — user dashboard data
- `GET /earnings` — earnings metrics
- `GET /payouts`, `POST /payouts` — payout history and request
- `GET /plans`, `POST /plans` — plan list and purchase
- `GET /profile`, `PUT /profile` — profile management
- `GET /claims`, `POST /claims` — claims operations

## 🧾 Project structure

- `server.js` — app entry
- `routes/` — express routes
- `middleware/` — auth middleware
- `db/` — database layer and SQL

## 🛡️ Security notes

- Keep `JWT_SECRET` safe
- Validate input in real application hardening
- Use HTTPS in production

## 📦 Deployment

- Configure `PORT` and environment variables
- Ensure DB file is persisted and backed up
- Use process manager: `pm2`, `npx nodemon` etc.

## 🧹 Misc

- Linting/style: add ESLint/Prettier as needed
- Add tests: Jest/Mocha recommended
