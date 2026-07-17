# Handoff: Animated Vertical Timeline (`/timeline` page)

## Overview
A full-page, scroll-driven vertical timeline of Nic Ranum's career/life history for the
existing Next.js site (nicjranum.uk). The page opens on a hero ("Nic / Ranum") with a
**"View Nic's Timeline ⌄"** prompt at the bottom. On scroll, a vertical timeline reveals
itself: entries alternate left/right of a central spine, the entry nearest the viewport
center snaps into sharp focus while neighbors dim/blur/shrink, and the spine is rendered as
a **time ruler** (monthly ticks + bold January ticks with year labels). Vertical distance
between entries is proportional (compressed) to real elapsed time.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the
intended look and behavior. **Do not ship the HTML directly.** The task is to **recreate this
design as a React component in the existing Next.js codebase**, using its established
conventions (the file uses a small custom "Design Component" runtime that does not exist in
your app — ignore that wrapper and read it as plain HTML/CSS/JS logic).

- `Nic Timeline.dc.html` — the prototype. Read the `<x-dc>` markup as JSX structure and the
  `class Component` block as the component logic (scroll math, ruler generation).
- `current-site-reference.png` — screenshot of the current homepage, the source of the visual
  language (type, indigo accent, dotted grid, mono labels).

## Fidelity
**High-fidelity.** Colors, typography, spacing, and the scroll interaction are final. Recreate
the UI closely, but use your codebase's existing primitives (fonts already loaded, existing
layout/container components, Tailwind/CSS-modules — whatever the repo uses) rather than the
inline styles verbatim. Match the existing site's font stack; the prototype uses
`Helvetica Neue, Helvetica, Arial, sans-serif` for display/body and a monospace stack
(`ui-monospace, "SF Mono", Menlo, monospace`) for labels — swap to whatever the real site uses.

## Suggested implementation (Next.js / React)
- One client component: `app/timeline/page.tsx` or `components/Timeline.tsx` — must be a
  **Client Component** (`"use client"`) because it uses `window`, scroll listeners, and refs.
- Entry data as a typed array (see **Data** below); render with `.map()`.
- Scroll logic in a `useEffect` with a `requestAnimationFrame`-throttled `scroll`/`resize`
  listener that mutates element styles directly via refs (do **not** drive it through React
  state / re-renders — it must run every frame smoothly).
- The ruler ticks are generated imperatively after layout (also in `useEffect`) into an
  absolutely-positioned overlay; rebuild on resize.
- Respect `prefers-reduced-motion`: if set, skip the blur/scale/translate and just show all
  entries at full opacity.

## Screens / Views

### 1. Hero (landing, first viewport)
- **Purpose:** Site-consistent intro; invites the scroll into the timeline.
- **Layout:** `min-height: 100vh`, flex column, `justify-content: center`,
  `padding: 120px 46px 150px` (top/bottom padding reserves space for the fixed nav and the
  pinned prompt so text never collides on short viewports).
- **Background:** dotted grid — `background-image: radial-gradient(circle, rgba(0,0,0,0.11) 1px, transparent 1.4px); background-size: 24px 24px;`
- **Components:**
  - *"Available for work" pill* — absolute, `top:96px; right:46px`. Border `1px solid rgba(0,0,0,0.16)`, `border-radius:999px`, `padding:9px 17px`, mono 14px, with an 8px accent dot. Copy: `Available for work`.
  - *Display heading* — `<h1>` two lines: "Nic" (color `#0a0a0a`) then "Ranum" (color = accent `#4f46e5`). `font-weight:800; font-size:clamp(84px,19vw,300px); line-height:0.82; letter-spacing:-0.045em`.
  - *Tagline* — max-width 640px, `font-size:clamp(19px,2.2vw,27px); line-height:1.45; color:#3a3a3a`. Copy: "Software engineer. A quick look back — how I got from a Canterbury lecture theatre to job-hunting in London."
  - *Scroll prompt* — absolute, bottom 38px, horizontally centered `<button>`. Mono uppercase label "View Nic's Timeline" (`letter-spacing:0.14em`) above a downward chevron SVG (`polyline 5 9 12 16 19 9`, stroke = accent, stroke-width 2.4) that bobs: `@keyframes` translateY 0→7px→0 over 1.6s ease-in-out infinite. On click, smooth-scroll so the first entry's dot is centered.

### 2. Timeline
- **Purpose:** Scrollable career/life history.
- **Layout:** centered column, `max-width:1180px; margin:0 auto; padding:14vh 0 20vh; position:relative`.
- **Spine:** absolutely-positioned 2px line at `left:50%` (`rgba(0,0,0,0.1)`), full height. A second **progress** line (2px, color = accent) overlays it from the top; its `height` is set each frame to `viewportCenterY − spineTop` (clamped to spine height) so it fills as you scroll.
- **Ruler overlay** (see **Ruler** below).
- **Entry rows:** each entry is a CSS grid, `grid-template-columns: 1fr 72px 1fr; align-items:start; padding-top:56px`. Its **height is time-proportional** (see **Spacing math**). Card sits in column 1 (left entries) or column 3 (right entries); the center dot sits in column 2.
  - *Card:* `background:#fff; border:1px solid rgba(0,0,0,0.1); border-radius:16px; padding:26px 30px; max-width:440px; box-shadow:0 1px 2px rgba(0,0,0,0.05)`. Left-column cards `justify-content:flex-end`, right-column `flex-start`, so cards hug the spine. `z-index:3` (above ruler).
    - Date label: mono, `600 13px`, `letter-spacing:0.08em; text-transform:uppercase; color:accent; margin-bottom:13px`. E.g. "JUNE 2026".
    - Title: `700 23px; line-height:1.22; letter-spacing:-0.012em; color:#0a0a0a`.
    - Bullets: `<ul>` list-style none, flex column `gap:10px`; each `<li>` `padding-left:20px; font 400 15px; line-height:1.5; color:#4a4a4a` with a 6px accent dot marker absolutely positioned at `left:0; top:8px`.
  - *Dot:* 17px circle, `border:2px solid rgba(0,0,0,0.28)`, white fill. `scroll-snap-align:center` lives on the dot's grid cell. Behind the dot, a 26×2px horizontal tick crosses the spine.

### 3. Footer
Centered, `padding:60px 20px 90px; border-top:1px solid rgba(0,0,0,0.08)`. Mono uppercase muted text: "Nic Ranum — nicjranum.uk".

## Interactions & Behavior

### Per-frame focus (the core effect)
On every scroll/resize frame, for each entry:
1. `c` = the **dot's** center Y (viewport coords); `mid` = `innerHeight/2`.
2. `norm = min(|c − mid| / (innerHeight * 0.55), 1)`; `f = 1 − norm`; ease `e = f*f*(3 − 2f)` (smoothstep).
3. Apply to the entry: `opacity = minO + (1 − minO)*e`, where `minO = 1 − focusContrast` (default `focusContrast = 0.75`, so unfocused opacity ≈ 0.25).
4. Apply to the card: `transform: translateX(side*(1 − e)*42px) scale(0.94 + 0.06*e)` (side = −1 left / +1 right, so cards slide in from the spine as they focus) and `filter: blur((1 − e)*1.8px)`.
5. Dot: `transform: scale(0.75 + 0.55*e)`; when `e > 0.55` fill + border become accent with `box-shadow: 0 0 0 7px rgba(accent, 0.13)`, else white/grey.

Direct DOM style writes via refs; rAF-throttled; `{ passive: true }` listeners. Call once on mount and 300ms after (font settle).

### Snap
`document.documentElement.style.scrollSnapType = 'y proximity'` (toggleable). Each dot cell has `scroll-snap-align:center` → points gently lock to center. `proximity` (not `mandatory`) keeps it from fighting the user.

### Scroll-to-timeline
Prompt click: `window.scrollTo({ top: window.scrollY + firstDotRect.top − (innerHeight − dotHeight)/2, behavior:'smooth' })`. **Do not use `scrollIntoView`.**

## Spacing math (time-proportional heights)
For entries ordered newest→oldest, `ym = year*12 + month`. Gap to the next (older) entry
`gap = ym[i] − ym[i+1]` (months). Entry height:
```
height = round(400 + 95 * gap^0.68)   // px; last entry = 520
```
This compresses long spans so a 1–2 month hop is short and a multi-year span (e.g. the
45-month university stretch) is tall — the fix for the earlier "equal space per entry" jumps.
Tune `BASE=400, SCALE=95, EXP=0.68` if you change card sizes.

## Ruler generation
Into an absolute overlay (`inset:0; pointer-events:none; z-index:0`) covering the spine, built
imperatively after layout:
- Get each dot's center Y **relative to the spine wrapper**.
- Between each adjacent pair (older→newer), for every whole month strictly between them,
  interpolate Y linearly and place a tick at `left:50%` (translate −50%,−50%).
- **January** (`month === 1`): "big" tick 30×2px `rgba(0,0,0,0.34)` + **year label** ("2024")
  to the **left** of the spine (`right: calc(50% + 26px)`, mono `700 13px`, `rgba(0,0,0,0.5)`).
- **Other months:** "small" tick 16×1px `rgba(0,0,0,0.15)` + label `Mon 'YY` (e.g. `Mar '24`)
  to the **right** (`left: calc(50% + 26px)`, mono `500 10px`, `rgba(0,0,0,0.3)`) — but **only
  render the month label when px-per-month ≥ 26** so dense stretches show ticks only, not
  overlapping text.
- Entry months themselves are skipped (their dot is the marker). Rebuild on resize.

## State / Tweakable props
The prototype exposes three knobs — expose as component props with these defaults:
- `accent: string` = `#4f46e5` (drives heading "Ranum", date labels, bullet dots, active dot, progress line, chevron). In the prototype it's a CSS custom property `--accent` on the root; a CSS var is the cleanest port.
- `snapScroll: boolean` = `true` → sets `scrollSnapType` to `y proximity` vs `none`.
- `focusContrast: number` (0.3–0.95) = `0.75` → how dark unfocused entries get (`minO = 1 − focusContrast`).

## Data
Newest first; left/right alternates by index (index 0 = left). Bullets are **placeholder copy —
confirm/replace with real details before shipping.**

```ts
type Entry = { y: number; m: number; date: string; title: string; bullets: string[] };
const entries: Entry[] = [
  { y:2026, m:6, date:'June 2026', title:'Living in London — looking for software roles',
    bullets:['Settled in London and set up to work in the UK','Actively interviewing for backend & full-stack positions','Building side projects to stay sharp — including this site','Open to relocation across the UK & EU'] },
  { y:2026, m:4, date:'April 2026', title:'Leaves New Zealand, starts travelling Europe',
    bullets:['Wrapped up eight years of life and work in NZ','Backpacked through Italy, Spain & Portugal','Picked up freelance contracts remotely along the way','Reset priorities and planned the next chapter'] },
  { y:2026, m:3, date:'March 2026', title:'Leaves Gentrack',
    bullets:['Departed after 3+ years to travel and chase new challenges','Handed over ownership of two core billing services','Left on great terms — still in touch with the team'] },
  { y:2024, m:8, date:'August 2024', title:'Promoted to Intermediate Software Engineer',
    bullets:['Recognised for leading the move to event-driven architecture','Mentored two junior engineers on the team','Owned the payments integration end-to-end'] },
  { y:2023, m:1, date:'January 2023', title:'Joins Gentrack as Junior Software Engineer',
    bullets:['Joined the utilities billing platform team','Worked across Java, TypeScript & AWS','Shipped my first production feature in week three'] },
  { y:2021, m:11, date:'November 2021', title:'Graduates, starts at Dempsey Wood Civil as Junior Software Engineer',
    bullets:['Finished a degree in Computer Engineering','Built internal tooling for civil-works project tracking','First real taste of production software in a small team'] },
  { y:2018, m:2, date:'February 2018', title:'Starts at Canterbury University — Computer Engineering',
    bullets:['Began a Bachelor of Engineering (Hons)','Fell for systems and low-level programming','Balanced full-time study with part-time work'] },
];
```

## Design Tokens
- **Accent:** `#4f46e5` (indigo). Alt options in prototype: `#0a0a0a`, `#e5484d`, `#0ea5e9`.
- **Text:** primary `#0a0a0a`, body `#3a3a3a`, bullet text `#4a4a4a`, muted mono `rgba(0,0,0,0.3–0.5)`.
- **Surfaces:** page `#fff`; card border `rgba(0,0,0,0.1)`; card shadow `0 1px 2px rgba(0,0,0,0.05)`.
- **Spine:** base `rgba(0,0,0,0.1)`; big tick `rgba(0,0,0,0.34)`; small tick `rgba(0,0,0,0.15)`.
- **Radii:** card 16px; pill/dot 999px/50%.
- **Type:** display/body Helvetica Neue stack; labels monospace. H1 clamp(84–300px)/800; title 23px/700; body clamp(19–27px)/400; bullet 15px; date label 13px mono; month tick label 10px mono.
- **Grid:** columns `1fr 72px 1fr`; page max-width 1180px; hero padding `120px 46px 150px`.
- **Motion:** chevron bob 1.6s ease-in-out infinite; dot transitions 0.35s; scroll transforms are per-frame (no CSS transition).

## Assets
None external — no images or icon libraries. The only vector is the inline chevron SVG
(described above). The dotted grid and ticks are pure CSS/DOM. Use the site's existing fonts.

## Files
- `Nic Timeline.dc.html` — full prototype (structure + scroll/ruler logic). Read as HTML/JS.
- `current-site-reference.png` — current homepage, for visual language only.
