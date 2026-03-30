<div align="center">
  <img src="/public/images/logo-black.svg" alt="CAAF Memory" width="220" />
  <br /><br />
  <img src="/public/images/isologo.svg" alt="CAAF Isologo" width="48" />
  <h1>CAAF Memory</h1>
  <p>Cooperative memory card game built for the CAAF congress event.</p>
</div>

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS v4 (design tokens via `@theme`) |
| Routing | React Router v7 (`createBrowserRouter`) |
| Backend | Firebase Firestore (no Auth — anonymous players) |
| i18n | i18next + react-i18next (ES default, EN available) |
| Icons | Lucide React |
| QR | qrcode.react |
| PWA | vite-plugin-pwa |
| Deployment | Netlify (SPA redirect configured) |

---

## Project Structure

```
src/
├── App.jsx                        # Router setup (createBrowserRouter)
├── main.jsx                       # Theme bootstrap before first paint
├── index.css                      # @theme tokens, global styles, safe-area helpers
│
├── components/
│   ├── ui/                        # Design system primitives
│   │   ├── AchievementToast.jsx   # Medal unlock notifications
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── FadeIn.jsx             # Scroll-triggered entrance animation
│   │   ├── Input.jsx
│   │   ├── Loader.jsx             # Full-screen logo shimmer loader
│   │   ├── NavBar.jsx             # Bottom navigation (mobile bar / tablet pill)
│   │   ├── PageHero.jsx
│   │   ├── ThemedLogo.jsx         # Isologo + wordmark with CSS mask coloring
│   │   └── Typography.jsx
│   ├── shared/                    # App-level layout components
│   │   ├── AppShell.jsx           # Layout wrapper: TopAppBar + BottomNav + Outlet
│   │   ├── BottomNav.jsx
│   │   ├── Footer.jsx
│   │   ├── ScrollToTop.jsx        # Scroll reset + dynamic page titles on route change
│   │   └── TopAppBar.jsx          # Fixed header with safe-area notch support
│   └── onboarding/
│       ├── IconPicker.jsx
│       ├── OnboardingModal.jsx    # New profile creation + existing session recovery
│       └── iconOptions.js
│
├── hooks/
│   ├── useGameState.js            # Card flip state machine, timer, scoring
│   ├── useImagePreload.js         # Parallel image preloading
│   ├── useInView.js               # IntersectionObserver wrapper
│   ├── useLeaderboard.js          # Firestore leaderboard fetcher
│   ├── useProfile.js              # Player session (localStorage + caaf:login/logout events)
│   └── useTheme.js                # Dark / light / system theme with localStorage persistence
│
├── pages/
│   ├── Home/                      # Landing: HeroSection + BentoFeatures + Footer
│   ├── Difficulty/                # Difficulty picker + resume badge + stats bar
│   ├── Game/                      # MemoryGrid + ExitConfirmModal + useBlocker guard
│   ├── Results/                   # Score, medals, leaderboard submit, share canvas
│   ├── Leaderboard/               # Top-10 per difficulty with player avatars
│   ├── Settings/                  # Profile, theme, language, share/QR
│   ├── About/
│   └── Privacy/
│
├── services/                      # All external I/O (Firestore + localStorage)
│   ├── profileService.js          # Player CRUD — dual write: localStorage + Firestore
│   ├── savedGameService.js        # In-progress game persistence per player
│   ├── scoreService.js            # Leaderboard top-10 transaction
│   ├── analyticsService.js        # Game session tracking (/games collection)
│   ├── statsService.js            # Cumulative stats — synced to player doc
│   └── achievementService.js      # Medal catalogue + grant logic — synced to player doc
│
├── lib/
│   └── firebase.js                # Firebase app + Firestore instance
│
├── i18n/
│   ├── index.js                   # i18next init (default: 'es', persisted to localStorage)
│   └── locales/
│       ├── es.json
│       └── en.json
│
└── utils/
    └── shareResult.js             # Canvas 2D share image generator
```

---

## Environment Variables

All variables are injected at build time by Vite and must be prefixed with `VITE_`.
Set them in Netlify under **Site configuration > Environment variables**.

Create a `.env.local` file for local development (never commit it):

```env
# Firebase project configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Public app URL — used for the QR code and Web Share API
VITE_APP_URL=https://caaf.netlify.app
```

---

## Hooks

### `useProfile()`
Manages the anonymous player session.
- Reads the profile from `localStorage` on mount.
- Listens to `caaf:logout` and `caaf:login` custom DOM events for cross-component sync.
- Returns `{ profile, isLoading, needsOnboarding, createProfile }`.

### `useGameState(difficulty, savedState?)`
State machine for the memory game.
- Handles card flipping, match evaluation, timer, and failed attempt counting.
- Supports resuming from a saved state (cards + matched pairs + elapsed time).
- Returns game phase (`playing | won | lost`), card array, score, and a `handleCardClick` callback.

### `useTheme()`
Theme preference management.
- Three modes: `dark`, `light`, `system`.
- Persists to `localStorage` under `caaf_theme`.
- Applies `dark` / `light` class to `document.documentElement`.
- Returns `{ mode, setMode, resolvedMode }`.

### `useLeaderboard(difficulty)`
Fetches the top-10 leaderboard for a given difficulty from Firestore.
- Re-fetches automatically when `difficulty` changes.
- Returns `{ scores, loading }`.

### `useInView(options?)`
Thin wrapper around `IntersectionObserver`.
- Options: `threshold` (default `0.12`), `rootMargin` (default `'-32px'`), `once` (default `true`).
- Returns `{ ref, inView }` — attach `ref` to the element to observe.

### `useImagePreload(urls)`
Preloads an array of image URLs in parallel before the UI renders.
- All images resolve via `Promise.all`; errors are swallowed (non-blocking).
- Returns a `loading` boolean — used in `AppShell` to gate the `<Loader />`.

---

## Data Architecture

Stats and medals are persisted in both `localStorage` (fast, sync) and the player's Firestore document (durable, survives localStorage wipes). On session recovery, `recoverProfile` restores all three: profile, stats, and medals.

```
/players/{playerId}
  name, iconKey, createdAt
  stats: { gamesPlayed, gamesWon, easyWins, mediumWins, hardWins, fastestWinSec }
  medals: string[]

/leaderboards/{easy|medium|hard}
  scores: [ { playerId, playerName, iconKey, points, savedAt } ]  (max 10)

/games/{gameId}
  playerId, difficulty, outcome, score, elapsed, failedAttempts, completedAt

/savedGames/{playerId}
  difficulty, cards, matchedPairs, elapsed, failedAttempts, savedAt
```

---

## Local Development

```bash
npm install
npm run dev
```

Deploy to Netlify is automatic on push to `main`. The `netlify.toml` at the root handles the SPA redirect (`/* → /index.html`).
