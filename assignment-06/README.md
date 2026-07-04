# Habit Tracker

Mobile habit tracker built with Expo Router. Create habits, get reminded (locally or via push), keep a streak, and tap a notification to land straight on the right habit.

## Features

- Create, edit, delete habits — emoji, name, frequency (daily / weekly on chosen weekdays), reminder time
- Local reminders scheduled on save, cancelled and rescheduled on edit, cancelled (only that habit's) on delete
- Streak tracking: completing today keeps/grows the streak, missing a day resets it, last 4 weeks shown as a calendar grid
- Quiet hours: reminders that would land in a muted window get shifted to right after it ends
- Snooze action on reminder notifications
- Daily "N habits left" summary notification + app icon badge count
- Push notifications from a small Node/Express backend — registration, a self-test button, and broadcast sending for streak nudges or announcements
- Both local and push notifications deep link to the same habit detail screen via a shared `{ screen: "/habit", habitId }` data payload and tap handler
- Permission-denied state with a button to open system settings, no crashes if permission is refused

## Tech stack

Expo SDK 55, Expo Router, React Native 0.83 / React 19, TypeScript, AsyncStorage, `expo-notifications`, `expo-device`, `expo-constants`. Push backend: Express + `expo-server-sdk`.

## Project structure

```
src/
  app/
    (tabs)/index.tsx       today's habits, done button, streak
    (tabs)/analytics.tsx   totals, best streak, weekly completion rate
    (tabs)/settings.tsx    permission status, quiet hours, push token, push server status
    habit/[id].tsx         habit detail — deep-link target for local and push notifications
    new.tsx                create / edit habit form
    _layout.tsx            fonts, Android channel + category setup, notification tap wiring
  lib/
    habits/                types, AsyncStorage CRUD, streak/due-date logic, quiet hours
    notifications/         handler + channel setup, scheduling, push registration, backend calls
  hooks/
    use-habits.ts             habit CRUD wired to scheduling + streak decay
    use-push-notifications.ts permission state, Expo push token, backend registration state
    use-quiet-hours.ts        quiet hours persistence + reschedule-on-change
server/
  server.js               push backend: register/unregister devices, send-test, broadcast send
```

## Running the app

Local notifications work in Expo Go. Push notifications do not — you need a development build.

```bash
npm install
npx expo start          # local-notification testing in Expo Go is fine
```

For push, build and install a dev client once:

```bash
bunx eas-cli build --profile development --platform android
npx expo start --dev-client
```

## Push backend

```bash
cd server
npm install
npm run dev
```

Listens on `PORT` (default `4000`). Endpoints:

| Route              | Body                           | Purpose                                                                                                             |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `POST /register`   | `{ token }`                    | app calls this once it has an Expo push token                                                                       |
| `POST /unregister` | `{ token }`                    | drop a token                                                                                                        |
| `POST /send-test`  | `{ token, title, body, data }` | send to one device — used by Settings' "Send test push"                                                             |
| `POST /send`       | `{ title, body, data }`        | broadcast to every registered device — streak nudges / announcements from a script, cURL, or expo.dev/notifications |

Sending is entirely server-side; the app never ships a push directly.

If testing on a physical device, point the app at your machine's LAN IP instead of `localhost` — edit `PUSH_BACKEND_URL` in `src/lib/notifications/backend.ts` (e.g. `http://192.168.1.20:4000`). `localhost` on the phone means the phone itself, not your dev machine.

Flow: permission granted → app gets an Expo push token → registers it with `/register` → Settings tab shows "Server has your token" and lets you fire a test push at yourself, which deep links to your first habit the same way a local reminder would.

## Notification design notes

**Why the Android notification channel is created before requesting permission.** On Android, a notification's importance — whether it can pop up as a heads-up banner, play sound, etc. — is fixed by the channel it's posted to, and a channel's importance can't be changed once created. If `habit-reminders` doesn't exist yet when the first reminder fires, Android silently posts it to a default low-importance channel instead, and it never shows as a heads-up alert even with permission granted. Creating the channel at app startup, before any permission prompt or scheduling happens, guarantees every reminder from the first one onward lands in a high-importance channel.

**Foreground vs background push.** `Notifications.setNotificationHandler` in `src/lib/notifications/setup.ts` sets `shouldShowBanner: true`, so a push arriving while the app is open still shows a banner — without that handler foreground pushes are delivered silently and never surfaced. When the app is backgrounded or fully killed, the OS shows the system notification on its own; tapping it either resumes the app (handled by the live `addNotificationResponseReceivedListener`) or cold-starts it (handled by `handleColdStartNotificationResponseAsync`, checked once on launch). Both paths funnel into the same `handleNotificationResponse` function that local reminders use, so the deep-link behavior is identical regardless of where the notification came from.

**Local vs push, when to use which.** Local notifications are scheduled entirely on-device and don't need a server or network at fire time — right for habit reminders tied to a time the user picked. Push notifications need a server round-trip and a live token, and are the only option for anything triggered externally: a streak nudge decided by backend logic, an announcement, or anything sent while the app isn't running.
