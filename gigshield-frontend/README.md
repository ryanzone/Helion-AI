# Helion Frontend

Helion is a premium, React Native-based frontend for modern gig-workers. It provides an elegant, dark-themed (Material Design 3) interface for managing earnings, tracking health/safety scores, and viewing dynamic insurance coverage policies triggered by API integrations.

## 🚀 Features

- **Dynamic Dashboard:** Real-time earnings ledger, recent payouts progress, and activity trends.
- **Safety & Health Metrics:** Integration with mock safety scores and dynamic health data to show real-time "Security Ratings."
- **Policy Management:** Browse coverage plans like 'Pro Active' or 'Elite Shield' with dynamic deductibles and features calculated on the backend.
- **Trigger Views:** Smart UI components that react to external variables (e.g. Extreme Heat Alerts or Wind Speeds) to display active protection thresholds.
- **Claim & Payout Handling:** File claims with an intuitive form or view instant payouts triggered by coverage conditions.

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Navigation:** [React Navigation](https://reactnavigation.org/) (Stack & Bottom Tabs)
- **Styling/UI:** Custom Material Design 3 (M3) Dark Theme + `expo-linear-gradient` + `@expo/vector-icons`

## 🏃‍♂️ Getting Started

### Prerequisites

Make sure you have Node.js installed, along with Expo CLI.
You must be running the **Helion Backend** API locally on port `3001` before the frontend can fully function.

### Installation

1. Install dependencies

```bash
npm install
```

2. Start the Expo development server

```bash
npm start
# or
expo start
```

3. Press `a` to open in Android emulator, `i` for iOS simulator, or scan the QR code using the Expo Go app on your physical device.

## 🔗 Connecting to Backend

The API base URL is currently configured in `src/services/api.ts` to point to:

```typescript
const BASE_URL = "http://localhost:3001/api";
```

If you are running on a physical Android device, change `localhost` to your computer's local local IP address (e.g., `http://192.168.1.XX:3001/api`).
