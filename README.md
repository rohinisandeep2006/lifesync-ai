# LifeSync AI

A personal life-sync app: splash → login → onboarding bot → dashboard with gamified streak, planner, focus widget, and app lock.

## Features

- **Splash**: Opens with "LifeSync AI" then loads to login
- **Auth**: Login / Sign up (demo; stores in localStorage)
- **Onboarding bot**: Collects name, age, sex, profession (student, graduate, working, homemaker), sleep schedule, hydration goal, routines, and daily schedule; lets you customize schedule and pick a theme
- **Dashboard**: 
  - Gamified calendar streak (tap days to mark complete)
  - Planner (add/complete tasks)
  - Focus widget (timer in minutes)
  - Today’s schedule from your customized plan
  - Hydration goal
  - App lock (PIN **1234** by default; enable in header)

## Run

```bash
cd LifeSync-AI
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## Default app lock PIN

`1234` — change this in `src/pages/Dashboard.tsx` (`LOCK_PIN`) if you want a different PIN.
