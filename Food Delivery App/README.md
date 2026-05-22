# FoodApp

A food delivery app built with React Native + Expo. Started as a navigation POC, grew into something that actually looks and feels like a real app — complete with a cart, order tracking, dark mode, and deep linking.

---

## Stack

| Layer           | Choice                                          |
| --------------- | ----------------------------------------------- |
| Framework       | React Native 0.83 + Expo 55                     |
| Language        | TypeScript 5.9                                  |
| Navigation      | React Navigation 7 (Stack + BottomTab + Drawer) |
| Animations      | Reanimated 4 + Animated API                     |
| Package manager | Bun                                             |

---

## Project Structure

```
food_app/
├── App.tsx                  # Root — providers + nav container
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx  # isLoggedIn, login(), logout()
│   │   ├── CartContext.tsx  # items, addItem(), removeItem(), total
│   │   └── ThemeContext.tsx # light/dark theme tokens
│   ├── navigation/
│   │   ├── AuthStack.tsx
│   │   ├── DrawerNavigator.tsx
│   │   ├── BottomTab.tsx
│   │   ├── HomeStack.tsx
│   │   ├── OrdersStack.tsx
│   │   ├── SearchStack.tsx
│   │   └── ProfileStack.tsx
│   ├── screens/             # One file per screen
│   ├── components/          # Reusable cards and modals
│   └── sample/
│       └── data.ts          # All mock data lives here
└── app.json                 # Expo config + deep link scheme
```

---

## Navigation Tree

```
App.tsx
├── ThemeProvider
├── AuthProvider
└── CartProvider
      │
      └── NavigationContainer  (scheme: foodapp://)
            │
            ├── [logged out] AuthStack
            │     ├── Onboarding  ──replace()──► Signin
            │     ├── Signin      ──login()───► DrawerNavigator
            │     └── Signup      ──login()───► DrawerNavigator
            │
            └── [logged in] DrawerNavigator
                  ├── MainTabs (BottomTab)          ← default
                  │     ├── HomeTab (Stack)
                  │     │     ├── Home
                  │     │     ├── RestaurantDetail  (tab bar hidden)
                  │     │     └── Cart              (tab bar hidden, modal)
                  │     ├── Search
                  │     ├── Orders
                  │     └── Profile
                  ├── DrawerOrders
                  ├── DrawerSettings
                  └── DrawerHelp
```

---

## Screens

- **Onboarding** — splash-style entry, leads into auth
- **Sign In / Sign Up** — form screens, calls `login()` on success
- **Home** — featured restaurants, categories, popular items, paginated lists
- **Restaurant** — menu grouped by category, item customization modal
- **Cart** — item management, qty controls, order summary
- **Search** — live filter with sort + price range filters
- **Orders** — order history cards
- **Tracking** — animated step-by-step delivery progress + rider info
- **Profile** — user info, opens drawer for settings/help
- **Settings** — dark mode toggle and preferences
- **Help** — static help page

---

## State Management

Three lightweight React contexts — no Redux, no external store.

**AuthContext** — tracks login state and the current user's name. Auth is in-memory only (no persistence between app restarts).

**CartContext** — holds cart items with qty tracking. `addItem` increments if the item already exists rather than duplicating. `removeItem` decrements and auto-removes at zero.

**ThemeContext** — toggles between a LIGHT and DARK token set. Every screen pulls colors from `useTheme()` rather than using hardcoded values.

---

## Navigation Patterns

```
replace()   Onboarding → Signin          (kills back stack)
navigate()  Home → RestaurantDetail      (passes restaurant param)
navigate()  RestaurantDetail → Cart
goBack()    Cart back button
reset()     Post-order → back to MainTabs
openDrawer() Profile rows → side menu
```

Tab bar visibility is computed dynamically in `BottomTab.tsx` using `useNavigationState` — it hides when the active nested route is `RestaurantDetail` or `Cart`.

---

## Deep Linking

```
foodapp://restaurant/123
```

Opens `RestaurantDetail` directly, nested correctly inside `HomeTab → MainTabs`. Config lives in `App.tsx` (`deepLinkConfig`) and the scheme is registered in `app.json`.

---

## Screen Transitions

| Navigator | Transition                            |
| --------- | ------------------------------------- |
| AuthStack | Fade + scale (95% → 100%)             |
| HomeStack | Slide from right                      |
| Cart      | Modal presentation                    |
| Drawer    | Slide overlay (`drawerType: 'slide'`) |

---

## Getting Started

```bash
# install deps
bun install

# start dev server
bun start

# run on a specific platform
bun run android
bun run ios
bun run web
```

Requires the Expo Go app on your device, or a running Android/iOS simulator.

---

## Assumptions

- **No backend** — all restaurants, menus, and order data come from `src/sample/data.ts`. The app is fully static; nothing is fetched over the network.
- **Auth is fake** — entering any name/email on Sign In or Sign Up logs you in. There's no password validation or token. State resets on app restart.
- **Currency is INR** — price ranges and labels (₹150, ₹300, etc.) are hardcoded for the Indian market.
- **Single user** — no multi-account support. The cart and auth state are global singletons for the duration of the session.
- **Tracking is mocked** — the delivery steps and rider info on the Tracking screen are hardcoded, not tied to a real order.
- **Portrait only** — `orientation: "portrait"` is set in `app.json`. Landscape isn't handled.
- **Light mode default** — app starts in light theme. The toggle in Settings works but preference isn't persisted across restarts.

---

## Notes

- All data (restaurants, menus, orders) comes from `src/sample/data.ts` — there's no backend. Swap it out with real API calls when needed.
- Auth state doesn't persist across restarts — intentional for a POC.
- The `bun.lock` file is committed; don't switch to npm/yarn mid-project or you'll get lockfile conflicts.
