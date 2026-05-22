# FoodApp — React Navigation POC

## Navigation Structure

```
App.tsx
├── AuthProvider + CartProvider (context)
└── NavigationContainer (linking: foodapp://)
    │
    ├── [unauthenticated] AuthStack (Stack)
    │   ├── Onboarding          ← replace() → Signin
    │   ├── Signin              ← login() → mounts DrawerNavigator
    │   └── Signup              ← login() → mounts DrawerNavigator
    │
    └── [authenticated] DrawerNavigator (Drawer)
        ├── MainTabs (BottomTab)  ← default screen
        │   ├── HomeTab (HomeStack — Stack)
        │   │   ├── Home                  (tab bar visible)
        │   │   ├── RestaurantDetail      (tab bar HIDDEN)
        │   │   └── Cart                  (tab bar HIDDEN, modal)
        │   ├── Search
        │   ├── Orders            ← badge when cart non-empty
        │   └── Profile           ← navigation.openDrawer()
        ├── DrawerOrders
        ├── DrawerSettings
        └── DrawerHelp
```

## Navigator Types Used

| Navigator | Purpose |
|-----------|---------|
| Stack | Auth flow (Onboarding → Signin → Signup) |
| Stack | Home flow (Home → RestaurantDetail → Cart) |
| BottomTab | Main app tabs |
| Drawer | Side menu from Profile tab |

## Key Navigation Patterns

- **replace** — Onboarding → Signin (no back stack)
- **navigate** — Home → RestaurantDetail (passes `restaurant` param)
- **navigate** — RestaurantDetail → Cart
- **goBack** — Cart back button
- **reset** — After place order, resets stack to MainTabs
- **openDrawer** — Profile rows open the drawer
- **Conditional auth** — `isLoggedIn` state in AuthContext swaps nav trees

## Deep Linking

```
foodapp://restaurant/123
```
Opens `RestaurantDetail` inside `HomeTab` inside `MainTabs` directly.

Config lives in `App.tsx` → `deepLinkConfig`.  
Scheme registered in `app.json` → `expo.scheme` and `android.intentFilters`.

## Tab Bar Visibility

The tab bar is hidden when `HomeTab`'s active stack screen is `RestaurantDetail` or `Cart`.  
Logic in `BottomTab.tsx` reads `useNavigationState` and computes visibility from the nested route name.

## Screen Transitions

- AuthStack: fade + scale (95% → 100%)
- HomeStack: slide from right (custom `cardStyleInterpolator`)
- Cart: modal presentation
- Drawer: slide overlay (`drawerType: 'slide'`)

## Run

```bash
bun install
bun start
```
