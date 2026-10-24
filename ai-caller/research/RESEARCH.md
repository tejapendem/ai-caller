# Outpero — UI Research

**Target:** https://app.outpero.com/
**Method:** REA MCP for target discovery (`list_browser_targets`) + Chrome DevTools MCP for PNG captures and measurement (`take_screenshot`, `resize_page`/`emulate`, `evaluate_script`) against the same live CDP session.
**CDP:** http://127.0.0.1:9222 · Chrome/155.0.8059.86
**Reference viewport:** 1440×900 (DPR 2)
**Status:** Pre-auth + post-auth capture complete.

> Scope: this document records *observed design and structure* for a
> from-scratch reimplementation with mock data. No proprietary source files,
> stylesheets, logos or brand assets are copied into the clone. Account
> identifiers are redacted.

---

## 1. App fingerprint

| Signal | Value |
|---|---|
| Bundler | Vite (hashed chunks) |
| Framework | React |
| Animation | Motion / framer-motion |
| Backend | Supabase |
| Styling | Tailwind utilities + custom layer |
| Edge | Cloudflare |
| Fonts | **Outfit** (display), **Inter** (UI) |
| Routing | Hash-based SPA (`#dashboard`, `#leads`, …) |
| Currency / market | INR (₹), `+91` phone prefix, Telugu-first defaults |

Chunks: `vendor-react`, `vendor-motion`, `vendor-supabase`, `vendor-*`,
`index-*.js` (259 KB), `index-*.css` (137 KB).

---

## 2. Route inventory

| Route | Screen | Nav group |
|---|---|---|
| `/` (no auth) | Sign in / Sign up | — |
| `#dashboard` | Dashboard | Overview |
| `#employees` | My Employees | Overview |
| `#store` | New employee (hire) | Overview |
| `#talk` | Talk to an employee | Overview |
| `#instant` | Instant Leads | Calling |
| `#bulk` | Bulk Campaigns | Calling |
| `#inbound` | Inbound Calls | Calling |
| `#leads` | Leads & Results | Results & Setup |
| `#conversations` | All Conversations | Results & Setup |
| `#teach` | Train Employees | Results & Setup |
| `#numbers` | Phone Numbers | Results & Setup |
| `#performance` | Performance | Results & Setup |
| `#billing` | Credits & billing | Results & Setup |
| `#settings` | Settings | footer |
| `#developers` | Outpero API | footer |

Auth is a client-side state swap on `/` — no separate sign-up URL.

---

## 3. App shell

```
┌──────────────┬──────────────────────────────────────────────┐
│  sidebar     │  top bar (search · live · minutes · icons)    │
│  260 px      ├──────────────────────────────────────────────┤
│  white       │  onboarding banner (amber)                    │
│  border-r    │  page content  (max ~1116 px)                 │
│              │                                               │
└──────────────┴──────────────────────────────────────────────┘
```

### Sidebar — 260 px, `#FFFFFF`, 1 px right border
- Brand: `OUTPERO` wordmark (text-based in clone) with a small purple ring on the final “O”, sub-label **AI PHONE CALLING** in 9.5 px letterspaced caps with a green status dot.
- Collapse control: 36×36 outlined square, radius 8, `#A3A3A3` icon.
- Group labels: `OVERVIEW`, `CALLING`, `RESULTS & SETUP` — Outfit 10.5 px / 700, ls 1.2 px, `#A9A9B2`.
- Nav item: 235×39.75 px, padding 9×12, radius 16, Inter 14.5 px / 600, gap 12, icon 18 px.
  - idle `#737373` → hover `#1A1A1A` + `#F5F5F8`
  - active `#673FC4` on `#EDE8FA`
  - `NEW` badge: 10 px / 800, `#FFFFFF` on `#7A50DC`, pill.
- “Your team” card: bordered, radius 16, title 13 px / 700, “0 working” pill, muted body.
- Footer: Help & Docs · Terms · Privacy · Refund / Contact · outpero.com, 10.5 px `#A3A3A3`.

### Top bar — 79 px total, `rgba(246,246,248,.85)`, backdrop blur
- Search: 372×40, white, 1 px `#E4E4E9`, radius 16, placeholder “Search employees, pages…”, `⌘K` chip right.
- Live pill: mint `#E8F7EE` bg, green dot, “0 on calls now · 0.0 calls/min” (Inter 12.5/600 `#1B7A46`), sub-line “0 talking · 0 ringing”.
- Minutes pill: warm `#FBF3E2`, clock icon, “7–10 min”, purple circular `+`.
- Icon buttons: 40×40 white circles, `#E4E4E9` border (book, help, bell with purple dot).
- Account: 36×36 purple gradient avatar with initials, two-line block (name, email), chevron.

### Onboarding banner — `#FDF7E8`, 1 px `#EEDFB8`, radius 16
- Left: 36×36 white circle with a phone icon.
- Title 13.5 px / 700, sub 12.5 px `#8A7A55`.
- Right: gold **Start** button (gradient `#D4A346 → #B58325`, radius 12, 13 px / 700).

### Page header
- Eyebrow: 10.5 px / 800, ls 1.4 px, `#8E8E99` (section color varies per page).
- Title: Outfit 29–34 px / 800, `#1A1A1A`, ls −0.6.
- Subtitle: Inter 14 px `#737373`.
- Right-side actions: outlined icon button + primary/secondary CTAs.

---

## 4. Per-screen inventory

### Dashboard `#dashboard`
1. Amber onboarding banner.
2. **Hero composer** — radial gradient `130% 140% at 0% 0%, #2C1B53 → #1B1031 60% → #0E0820`, radius 26, padding 24.
   - Eyebrow “✦ DESCRIBE THE JOB · WE BUILD THE EMPLOYEE” (11 px / 700, white 55 %, ls 1.5).
   - Title “Build your AI employee” Outfit 24/800 + gold `FREE` chip.
   - Sub “Describe the job in a few sentences. You only pay for the calls they make.” (13 px, white 65 %).
   - Mode chips: Instant Lead Calling / Bulk Calling / Inbound Calling (active = white 15 % fill, 30 % border).
   - Language strip: `PRIMARY` label + తెలుగు · हिन्दी · தமிழ் · ಕನ್ನಡ · മലയാളം · मराठी · English (active gold).
   - Textarea: white 5 % fill, white 12 % border, radius 16, ~120 px tall.
   - Bottom row: mic button, divider, industry chips (Real estate, Coaching & tuition, …), `⌘ Enter to build`, gold **Build my employee**.
3. **Quick actions** — 2×3 grid of white cards (radius 16, 1 px border, 16 px padding): New employee, New campaign, Add credits (≈10 min left), Phone numbers, View leads, Call log. Each has a 36×36 tinted icon tile (purple / amber / blue / green / violet).
4. **Your AI employees** — white panel with “View all ›” and an empty row “No employees yet. Build your first” + dashed “Build your first employee” button.

### My Employees `#employees`
Empty state card (radius 26): 56×56 lavender icon tile, “Hire your first AI employee”, two-line support copy, primary **New employee**. Header has a refresh square + primary CTA.

### New employee `#store`
- Title “Tell us how the call should go.” + explanatory sub.
- Dashed “Paste an Outpero script JSON” row.
- `OR DESCRIBE IT YOURSELF` divider with an **English enhance** checkbox on the right.
- Same dark composer as dashboard, taller: mode chips (Instant Lead Caller / Bulk Caller / Receptionist & Support), language strip, multi-line example placeholder, mic + industry chips + **Build my employee**.

### Talk `#talk`
Empty state: “Build someone to talk to” + **Build an employee**.

### Instant Leads `#instant`
- Top strip: “Add a Instant Lead Calling employee to unlock this panel” + **Add one**.
- Header block, then a 3-step flow card: `01` webhook → `02` call within seconds → `03` qualified, each with a small illustrative tile, plus **Get your webhook URL**.

### Bulk Campaigns `#bulk`
- Same unlock strip for Bulk Calling.
- 3-step flow: `01` upload list (247 leads.csv) → `02` auto-dial (names) → `03` live analytics (62 %, 153/247), plus **Create your first campaign**.

### Inbound Calls `#inbound`
Nav badge `NEW`. Renders only the shell + banner pre-employee (gated content).

### Leads & Results `#leads`
- Live-calls strip (dot + “Live calls (0)”).
- 4 stat cards: Total leads, Qualified, Pending callback, Hot leads — each with a coloured eyebrow, 26 px / 800 number, muted caption.
- Toolbar: search field, “Most recent” sort, 3 view-mode icon buttons.
- Filter row: segmented channel (All channels / Inbound / Instant / Bulk), employee select, time select, outcome select, “Hot only”, “More filters”.
- “Showing 0 leads” + large empty state card.

### Conversations `#conversations`
- 3 metric cards with tinted icon tiles: Calls, Qualified, Credits used.
- Filter panel: search, stacked selects (All directions, Recording: any, Ended: any, All time, Any length), credits min/max, chip groups (CHANNEL / OUTCOME / SENTIMENT / SORT).
- Recording-retention note above.

### Train Employees `#teach`
“Teach your employee” + **Refresh**, empty state “No employees yet”.

### Phone Numbers `#numbers`
- Header + ₹50.00 credits pill + **Buy a new number**.
- Two-column hero: “Give your employee a phone number” explainer, ₹649/month pill, benefit rows (Call your leads / Answer customers / Your business ID), **Browse numbers**.
- Compliance note: “Only call people who've agreed to hear from you…” + calling-hours policy.

### Performance `#performance`
- Date-range subtitle, refresh + **Export leaderboard**.
- Filter card: 7/30/90 days segmented + Custom; employee select; channel select; “Issues only” checkbox + min duration; activity line “0 calls today · 0 in the last hour · 0 in the last 24h”.
- 7 KPI cards in a 4/3 grid: Calls, Connect rate, Conversion, Avg call length, Leads, Success rate, Credits used — each with a coloured dot + label, 26 px value, muted caption.
- Chart cards: “Calls over time”, “Conversion funnel”, “Outcomes”, “By channel”, “Busiest hours”, “Employee leaderboard”.

### Credits & billing `#billing`
- Left sub-nav card: Overview / Credits / Transactions / Usage / GST.
- Three-up summary: Credits balance (₹50.00, “Low balance”, purple **Add credits**), Spent · last 14 days (dashed empty chart), Last top-up.
- “WHAT CALLS COST” panel: Talk time cards ₹5/min Standard, ₹6.8/min Premium; three green info rows (₹0 if nobody picks up, 30-second billing, incoming calls); phone number row ₹649/mo; free-build footnote.

### Settings `#settings`
Business name, Default language, Smart follow-ups toggle (with long privacy explainer), **Save changes**; Account block (email, status, member since); Live call updates toggle.

### Developers `#developers`
Badge `NEW`. Hero “Use your AI employees from anywhere”, base URL `https://api.outpero.com/v1`, 3 numbered steps (create key, first request, webhooks), code quickstart with cURL / Node / Python tabs.

---

## 5. Design tokens (measured)

### Colour
| Token | Value |
|---|---|
| `bg-page` | `#F6F6F8` |
| `surface` | `#FFFFFF` |
| `text` | `#1A1A1A` |
| `text-muted` | `#737373` |
| `text-faint` | `#A3A3A3` |
| `border` | `#E4E4E9` |
| `border-strong` | `#CFCFD7` |
| `accent` | `#7A50DC` |
| `accent-deep` | `#673FC4` |
| `accent-soft-bg` | `#EDE8FA` |
| `gold-1` | `#D4A346` |
| `gold-2` | `#B58325` |
| `banner-bg` | `#FDF7E8` |
| `banner-border` | `#EEDFB8` |
| `mint-bg` | `#E8F7EE` |
| `mint-text` | `#1B7A46` |
| `hero-1` | `#2C1B53` |
| `hero-2` | `#1B1031` |
| `hero-3` | `#0E0820` |

Supporting tints for icon tiles: lavender `#EEE8FB`, amber `#FBF0D9`, blue `#E7EFFB`, green `#E6F5EC`, violet `#EFE9FD`.

### Shadows
- Card: `0 1px 2px rgba(40,22,80,.05), 0 2px 6px -1px rgba(40,22,80,.07), 0 12px 28px -10px rgba(40,22,80,.16)`
- Primary CTA glow: `0 12px 28px -10px rgba(122,80,220,.45)`
- Gold CTA glow: `0 12px 26px -10px rgba(201,155,60,.40)`

### Type
- Display **Outfit** 600–800, tracking −0.6 px at 24 px.
- Body **Inter** 400/500/600/700, tracking −0.16 px.
- Sizes: 9.5 / 10.5 / 11 / 11.5 / 12 / 12.5 / 13 / 13.5 / 14 / 14.5 / 16 / 19 / 24 / 29–34 px.

### Radius
`8 · 12 · 16 · 20 · 26 · 9999 px`. Controls 16, cards 16–26, pills 9999.

### Spacing
4 px base; card padding 16–24; page gutter 24; grid gap 16.

---

## 6. Interaction states observed
- Nav hover: text darkens to `#1A1A1A`, soft `#F5F5F8` fill.
- Input focus: 1.5 px border → accent + `0 0 0 5px rgba(122,80,220,.30)` ring.
- Primary button hover: `#7A50DC` → `#673FC4`.
- Segmented control active: solid `#7A50DC` with white text.
- Onboarding wizard: 5-step modal (z 99997 backdrop / 99998 panel) with step counter, `Next ›`, and close.
- Credits modal: ₹50 grant with **Start my first call** / **Look around first**.

---

## 7. Client-side behaviour to mock
- Hash router with 16 views.
- Auth gate: sign-in / sign-up card; mock session in `localStorage`.
- Sidebar collapse, search focus (`⌘K`), notification dot.
- Composer: mode chips, language selection, industry chips, textarea.
- Filter/segmented controls, view-mode toggles, tabs (billing sub-nav, developers code tabs).
- Toasts/empty states; no real network calls.

## 8. Limitations
- Captured post-onboarding empty state (new account) — populated tables, charts with data, and employee detail tabs were never rendered, so their exact layout is unknown. Clone renders equivalent empty states and mock rows only where observed.
- `inspect_web_page` cannot read computed CSS, so layout values were measured with CDP `getComputedStyle`.
- Network bodies were not retained; API contract inferred from bundle literals only.
- Account email, tokens and cookies are deliberately excluded.

## 9. Reimplementation & verification

**Stack:** React 19 + TypeScript + Vite 6, hand-written CSS with extracted
tokens, `lucide-react` icons, hash router, mock auth.

**Measured parity (1440×900):**

| Element | Original | Clone |
|---|---|---|
| Sidebar width | 260 px | 260 px |
| Content column | x 292, 1116 px | x 292, 1116 px |
| Top bar height | 79 px | 79 px |
| Hero block | 292,181 · 1116×391 | 292,181 · 1116×393 |
| Nav row | 235×40, radius 16 | 235×40, radius 16 |
| Nav labels y | 101 / 303 / 466 | 101 / 304 / 467 |
| Billing sub-nav | 243 px + 32 gap | 243 px + 32 gap |
| Auth card | 420×580, y 140.5 | 420×580, y 139.3 |
| Auth wordmark | cap 23.5, 133.5 wide | cap 23.5, 135 wide |
| Auth rule / fields / CTA | y 98 / 311 / 461 | y 98 / 311.5 / 461 |

Typography in the auth card was aligned by comparing dark-pixel row bands in
the reference and clone screenshots at 2× DPR; the resulting text baselines
match within 0–3 px.

**Responsive checks:** every route was loaded at 768×1024 and 500×900 with no
horizontal overflow (`scrollWidth === innerWidth`), and the dashboard plus
billing were additionally emulated at 390×844 (`Emulation.setDeviceMetricsOverride`
via the DevTools `emulate` tool). The sidebar becomes a drawer below 980 px,
two-column grids collapse, the composer's mode/language/industry rows wrap,
and the wordmark-level hero icon is hidden under 560 px.

**Build:** `npm run build` (tsc project build + Vite) succeeds; output is
`dist/index.html`, `dist/assets/index-*.css`, `dist/assets/index-*.js`.
