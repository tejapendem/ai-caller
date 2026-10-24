# Outpero UI clone

A local, from-scratch reimplementation of the [Outpero](https://app.outpero.com/)
web app UI, built with React + TypeScript + Vite and mock data only.

The goal was to reproduce the *structure, layout, tokens and interaction
patterns* observed in the live app, not to copy its source, stylesheets, logo
files or other proprietary assets. No network calls are made to Outpero.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Using it

- Any email / password (6+ chars) signs you in; state is kept in
  `localStorage` under `outpero.session`.
- Every screen lives on a hash route, mirroring the original SPA:
  `#dashboard`, `#employees`, `#store`, `#talk`, `#instant`, `#bulk`,
  `#inbound`, `#leads`, `#conversations`, `#teach`, `#numbers`,
  `#performance`, `#billing`, `#settings`, `#developers`.
- The credits welcome modal is shown once per browser session
  (`sessionStorage`), like the original onboarding interrupt.
- Clear `localStorage` to return to the sign-in screen.

## Structure

```
src/
  App.tsx                hash router + mock auth gate
  nav.ts                 routes, nav groups, languages, industries
  styles.css             design tokens and all layout/component CSS
  components/Shell.tsx   sidebar, top bar, banner, app shell
  components/UI.tsx      page header, stat card, empty state, controls
  pages/Auth.tsx         sign-in / sign-up card
  pages/Dashboard.tsx    dashboard + shared job composer + credits modal
  pages/Hire.tsx         new-employee screen
  pages/Simple.tsx       employees, talk, teach, inbound
  pages/Calling.tsx      instant leads, bulk campaigns
  pages/Results.tsx      leads & results, conversations
  pages/Setup.tsx        numbers, performance, billing, settings, developers
research/
  RESEARCH.md            observed design findings + page inventory
  *.png                  reference captures and clone comparisons
```

## Fidelity notes

- Reference viewport: **1440×900**. Layout values (260 px sidebar, 1116 px
  content column, 79 px top bar, 40 px nav rows, radii, colours, gradients)
  were measured from the live app with CDP `getComputedStyle`.
- The inspected account was new/empty, so only empty states exist in the
  reference. Populated tables, charts and employee-detail tabs were never
  rendered; the clone therefore stays on empty/mock states rather than
  inventing data-heavy screens.
- Responsive layouts (≤980 px and ≤560 px) are an adaptation: the original
  was only captured at desktop width. The sidebar becomes a drawer, grids
  collapse, and the composer wraps.
- Account identifiers in captures/docs are redacted; the clone shows
  `you@business.com` and a neutral `SA` avatar.
- `research/RESEARCH.md` documents screens, tokens and known gaps in detail.

## Stack

React 19 · TypeScript · Vite 6 · lucide-react · hand-written CSS with design
tokens (no Tailwind, no copied stylesheet).
