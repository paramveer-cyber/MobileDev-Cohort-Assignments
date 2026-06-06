# SafeDrive

A React Native (Expo) app that monitors your driving behaviour in real time using your phone's onboard sensors, scores every trip from 0–100, and keeps a full history of past sessions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How Scoring Works](#how-scoring-works)
- [Sensor & Detection Logic](#sensor--detection-logic)
- [Theme System](#theme-system)
- [Database](#database)
- [Screens](#screens)
- [Components](#components)

---

## Overview

SafeDrive turns your phone into a passive drive recorder. Mount it on your dashboard, press **Start Drive**, and the app silently watches your accelerometer, gyroscope, and device-motion sensors. Every harsh brake, sharp turn, aggressive acceleration, or moment of phone handling is flagged as an event and deducted from your score. At the end of the trip you get a full breakdown with duration, event count, and a score breakdown card.

---

## Features

- **Real-time safety score** — starts at 100, deducts per detected event, animated SVG face reflects mood
- **6 event types** detected via sensor fusion
- **Animated splash screen** — Bauhaus-themed entrance animation on every cold launch
- **First-run tutorial** — 4-slide onboarding modal shown once, re-accessible via `?` button
- **Trip history** — all sessions persisted to local SQLite, swipe-to-delete, tap for full summary
- **Adaptive theme** — Android: light sensor auto-switches at `<40 lux` (dark) / `>400 lux` (light) with manual override and per-session toggle; iOS: manual toggle only
- **Bauhaus design language** — geometric shapes, primary colour palette, deliberate typography throughout

---

## Tech Stack

| Layer      | Technology                                                                           |
| ---------- | ------------------------------------------------------------------------------------ |
| Framework  | React Native 0.83 + Expo SDK 55                                                      |
| Navigation | Expo Router (file-based, tab layout)                                                 |
| Sensors    | `expo-sensors` — accelerometer, gyroscope, device motion, magnetometer, light sensor |
| Storage    | `expo-sqlite` (WAL mode)                                                             |
| Animation  | React Native `Animated` API + `react-native-reanimated`                              |
| Graphics   | `react-native-svg`                                                                   |
| Language   | TypeScript 5.9                                                                       |

---

## Project Structure

```
src/
├── app/                    # Expo Router file-based routes
│   ├── (tabs)/             # Bottom tab screens
│   │   ├── index.tsx       # Home / dashboard
│   │   ├── drive.tsx       # Active drive tab
│   │   └── history.tsx     # Session history tab
│   └── drive/
│       └── summary.tsx     # Post-drive summary screen
│
├── screens/                # Screen-level components
│   ├── HomeScreen.tsx
│   ├── DriveScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SummaryScreen.tsx
│
├── components/
│   ├── SplashScreen.tsx    # Animated launch screen
│   ├── ScoreFace.tsx       # Animated SVG face (score visualiser)
│   ├── TutorialModal.tsx   # 4-slide onboarding modal
│   └── shared/
│       ├── BauhausDecor.tsx # Background SVG decorations
│       ├── ScoreRing.tsx    # Circular score ring (history/summary)
│       ├── EventBadge.tsx   # Per-event-type badge
│       └── ThemeToggle.tsx  # Theme control button + dropdown
│
├── hooks/
│   ├── use-drive-session.ts   # Core session orchestrator
│   ├── use-drive-history.ts   # History list state
│   ├── use-accelerometer.ts
│   ├── use-gyroscope.ts
│   ├── use-device-motion.ts
│   ├── use-magnetometer.ts
│   ├── use-light-sensor.ts    # Smoothed lux readings
│   ├── use-pedometer.ts
│   └── use-shake-detection.ts
│
├── db/
│   └── sessions.ts         # SQLite schema, CRUD, app prefs
│
├── utils/
│   ├── driveTypes.ts       # Types, penalty map, event labels
│   ├── eventDetection.ts   # Sensor fusion + event detection algorithms
│   └── theme.ts            # Theme tokens, score colours, ratings
│
└── context/
    └── ThemeContext.tsx    # Theme provider with hysteresis logic
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Android device or emulator (iOS supported but light-sensor features are Android-only)

### Install

```bash
# Clone / extract the project
cd SafeDrive
npm install
```

### Run

```bash
# Start Metro bundler
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

### Android Permissions

The following are declared in `app.json` and requested at runtime by `expo-sensors`:

```
android.permission.ACTIVITY_RECOGNITION
android.permission.HIGH_SAMPLING_RATE_SENSORS
```

---

## How Scoring Works

Every drive starts at **100 points**. Each detected event deducts a fixed amount:

| Event               | Deduction |
| ------------------- | --------- |
| Phone Handling      | −10       |
| Harsh Brake         | −5        |
| Harsh Acceleration  | −5        |
| Sharp Turn          | −3        |
| Aggressive Steering | −3        |
| Excessive Movement  | −2        |

Score never goes below 0. The final rating:

| Score    | Rating    |
| -------- | --------- |
| 90 – 100 | Excellent |
| 80 – 89  | Good      |
| 70 – 79  | Fair      |
| 60 – 69  | Poor      |
| 0 – 59   | Dangerous |

---

## Sensor & Detection Logic

All detection lives in `src/utils/eventDetection.ts`.

### Pipeline

```
Raw accelerometer (100 Hz)
        ↓
High-pass filter (α = 0.85)   ← removes gravity / low-freq drift
        ↓
Motion gate check              ← ignores total magnitude < 0.18 g
        ↓
Per-event threshold check      ← must exceed threshold N=4 consecutive
        ↓
Cooldown check                 ← 5 s lockout per event type after firing
        ↓
DriveEvent emitted
```

### Thresholds

| Event               | Sensor axis                                                 | Threshold   |
| ------------------- | ----------------------------------------------------------- | ----------- |
| Harsh Brake         | −filtered Y                                                 | > 1.3 g     |
| Harsh Acceleration  | +filtered Y                                                 | > 1.2 g     |
| Sharp Turn          | abs(filtered X)                                             | > 1.0 g     |
| Aggressive Steering | abs(gyro Z)                                                 | > 3.2 rad/s |
| Excessive Movement  | total filtered magnitude                                    | > 4.5 g     |
| Phone Handling      | device-motion total < 0.05 g **and** gyro total > 2.2 rad/s | —           |

Phone handling detection works by looking for high rotational movement while the car is effectively still — the classic signature of picking up a phone while stationary at lights or slow-moving traffic.

### Confirmation & Cooldown

Events require **4 consecutive positive readings** (at 200 ms poll interval = 800 ms of sustained force) before firing. This eliminates single-sample spikes from road bumps. After firing, each event type is locked out for **5 seconds** to prevent double-counting the same incident.

---

## Theme System

### Light / Dark tokens

All colour tokens are defined in `src/utils/theme.ts` as `lightTheme` and `darkTheme` objects conforming to `AppTheme`. Components consume them via `useTheme()`.

### Android Auto-Theme (Light Sensor)

`use-light-sensor.ts` reads ambient lux at 1-second intervals and applies a **5-sample rolling average** to smooth out sensor noise.

`ThemeContext.tsx` applies **hysteresis** to prevent flickering at the boundary:

- Switches to **dark** when smoothed lux drops below **40**
- Switches to **light** when smoothed lux rises above **400**
- Stays in current mode for anything in between

### Manual Override

Tap the sun/moon icon in the header:

- **iOS** — single tap toggles light/dark
- **Android** — opens a dropdown with:
  - Auto theme toggle (switch)
  - Live lux readout (when auto is on)
  - Manual light/dark switch (disables auto)

---

## Database

SQLite via `expo-sqlite` in WAL mode. Three tables:

```sql
drive_sessions (
  id TEXT PRIMARY KEY,
  started_at INTEGER,
  ended_at INTEGER,
  duration_seconds INTEGER,
  final_score INTEGER,
  safety_rating TEXT
)

drive_events (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES drive_sessions(id),
  type TEXT,
  timestamp INTEGER,
  severity REAL
)

app_prefs (
  key TEXT PRIMARY KEY,
  value TEXT
)
```

`app_prefs` currently stores `has_seen_tutorial` to gate the onboarding modal.

All DB access goes through `src/db/sessions.ts` which exposes: `saveSession`, `loadAllSessions`, `loadSession`, `deleteSession`, `getPref`, `setPref`.

---

## Screens

### Home

Dashboard showing lifetime stats — total drives, average score, best score, total distance. Tapping a recent session opens its summary.

### Drive

Active session screen. Shows the animated score face (smile → frown as score drops), live timer, event counter, and live event badges. Events flash an alert banner when detected. Start/End drive controls at the bottom. `?` button reopens the tutorial at any time.

### History

Chronological list of all past sessions. Each card shows date, time, duration, score ring, and event count. Long-press to delete. Pull-to-refresh.

### Summary

Post-drive breakdown: score ring, duration / events / deductions meta cards, itemised score breakdown, event badge list. Shows a trophy card for a perfect drive.

---

## Components

### `ScoreFace`

Animated SVG face rendered during active drives. The mouth curve interpolates between a full frown (score 0) and a full smile (score 100) using a quadratic bezier. Eyebrows tilt inward as score drops. On a score deduction: face shakes left-right and eyes squint (opacity pulse).

### `ScoreRing`

Classic circular arc score indicator used on the History and Summary screens.

### `TutorialModal`

4-slide paginated modal with custom SVG icons per slide and per-slide accent colours. Tracks completion in SQLite prefs.

### `SplashScreen`

Full-screen overlay rendered above the root stack on cold launch. Bauhaus shapes spring in sequentially, then the logo and tagline fade up, then the whole screen fades out. Runs once per app open.

### `BauhausDecor`

Purely decorative SVG layer rendered as an `absoluteFill` behind each screen. Uses the Bauhaus primary palette (red, blue, yellow) at reduced opacity. Four variants: `home`, `drive`, `history`, `minimal`.
