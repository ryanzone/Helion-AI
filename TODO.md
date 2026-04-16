# Backend & Frontend Fix TODO

## Priority 1: Backend DB Fix

- [x] Start server with .env - check no timeout error
- [ ] Test POST /api/auth/register - data entered
- [ ] Test GET /api/health/any-uuid - queries DB

## Priority 2: Frontend Dynamic Data

- [ ] Update api.ts BASE_URL = 'http://10.0.2.2:3001/api' (emulator) or 'http://localhost:3001/api'
- [ ] Fix endpoint paths add /api if missing
- [ ] Remove static fallbacks in screens (getFallbackPlans etc)
- [ ] Update store integration if needed

## Priority 3: Test Flow

- [ ] expo start frontend
- [ ] Register user → data persists
- [ ] Dashboard shows dynamic stats, not static

## Commands

```
cd gigshield-backend; npm start
cd ../gigshield-frontend && npx expo start
```

- Port 3001 PID 30060 killed
