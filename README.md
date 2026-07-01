# felipepenteado.com.br

> Personal portfolio site — bilingual (EN/PT), single-page, with a Dynamic Island navbar, scroll-driven animations, glassmorphism design, and embedded real-world productions. Built with Next.js 16, React 19, and Tailwind v4.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/motion%2Freact-8B5CF6?style=flat)
![Deployed](https://img.shields.io/badge/deployed-live-brightgreen)

**[felipepenteado.com.br](https://felipepenteado.com.br)** — live

---

## Overview

This site presents both sides of my professional background — software engineering and audio engineering — in a single, bilingual experience. Rather than a generic template, every visual detail was designed and built from scratch: a Dynamic Island navbar that morphs on scroll, a full-bleed hero with scroll-driven zoom, glassmorphism cards, a cursor spotlight, and section reveals with staggered motion.

The site also embeds real productions: Spotify playlists and YouTube performances from Vocal Livre, a Brazilian vocal ensemble I've served as Technical Director since 2022.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Animations | motion/react |
| Icons | Phosphor Icons |
| Fonts | Geist + Geist Mono |
| i18n | Custom client-side locale context |
| Deploy | Vercel |

---

## Features

### Dynamic Island Navbar
Starts as a compact icon pill floating over the hero. On scroll or hover, it spring-morphs into a full navigation bar. Collapses back automatically when the cursor leaves. Built with `motion/react` layout animations — no fixed width transitions, just smooth shape morphing driven by spring physics.

### Scroll-driven Hero
Full-bleed studio photo with a dark gradient overlay. As the user scrolls, the background image zooms and the content fades out — creating a parallax depth effect tied to scroll position.

### Cursor Glow
An amber spotlight that follows the mouse using spring physics and `mix-blend-mode: screen`. Desktop only. Fully respects `prefers-reduced-motion`.

### Bilingual (EN / PT)
Language toggle persisted to `localStorage`. All visible text lives in JSON dictionaries (`en.json`, `pt.json`) — no hardcoded copy in components. Switching language is instant with no page reload.

### Glassmorphism Design System
Two utility classes — `.glass` and `.glass-strong` — built on `backdrop-filter`, layered borders, and inner shadows. Solid color fallback for `prefers-reduced-transparency`.

### Scroll Reveal Animations
Section content reveals using Motion's `whileInView` with staggered entry per element. All animations are gated by `useReducedMotion()` — users who prefer reduced motion get a clean, static experience.

### Photo Gallery
27 optimized photographs in a masonry-style grid (max 1600px, quality 75). Hover zoom on each image.

### Embedded Real Productions
Spotify playlist and YouTube videos from actual Vocal Livre performances — including a 30-year anniversary concert and a live DVD production.

---

## Key Technical Decisions

### Next.js 16 + App Router + React 19
App Router enables per-segment layouts and streaming without the overhead of a separate server setup. React 19's concurrent features (transitions, deferred updates) pair naturally with scroll-driven and physics-based animations. Using the latest stable versions also demonstrates active engagement with the current ecosystem.

### Tailwind v4
Tailwind v4 moves from a config file to CSS-first configuration. Custom design tokens (colors, shadows, blur values for glassmorphism) are declared directly in `globals.css` rather than `tailwind.config.js` — co-locating design decisions with the styles that use them.

### motion/react for layout animations
The Dynamic Island effect relies on `layoutId` — Motion's mechanism for animating shared layout between component states. When the navbar switches between compact and expanded, Motion detects the layout change and smoothly interpolates the shape, position, and size. This would be extremely difficult to achieve with CSS transitions alone.

### Custom i18n over a library
A full i18n library (next-intl, react-i18next) would be appropriate for a multi-route, server-rendered multilingual app. For a single-page portfolio with two languages and client-only rendering, a `LocaleProvider` context + two JSON files is the right scope — no unnecessary dependencies, no bundle overhead.

### Single-page architecture
All content is on one page, separated into anchored sections. This is deliberate: a portfolio should be browsable in one continuous scroll, not navigated across routes. Next.js is still used for its image optimization, font loading, and Vercel deployment pipeline.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout: fonts, LocaleProvider
│   ├── page.tsx            # Single page: all sections composed here
│   └── globals.css         # Tailwind v4 config + .glass utilities
├── components/
│   ├── Navbar.tsx          # Dynamic Island — compact/expanded morph
│   ├── Hero.tsx            # Full-bleed photo + scroll zoom + fade
│   ├── About.tsx           # Photo + bio + quote
│   ├── Projects.tsx        # Software projects + audio productions
│   ├── Timeline.tsx        # Career milestones (vertical timeline)
│   ├── Skills.tsx          # Studio gear + dev skills (glass cards)
│   ├── Photos.tsx          # Masonry photo grid (27 photos)
│   ├── Contact.tsx         # Glass card contact form
│   ├── Footer.tsx          # Social links
│   └── CursorGlow.tsx      # Mouse-following amber spotlight
└── i18n/
    ├── LocaleProvider.tsx  # Locale context + useLocale hook
    ├── en.json             # English dictionary
    └── pt.json             # Portuguese dictionary
```

---

## Local Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

```bash
# Production build
npm run build
```

Deploy the `.next` output to Vercel, Netlify, or any Node.js host.

---

## Content

All text is in `src/i18n/en.json` and `src/i18n/pt.json`.
Social links are in `Footer.tsx`.
Photo list is in `Photos.tsx`.

Photos are optimized JPEGs — max 1600px wide, quality 75 — for fast loading without perceptible quality loss.

---

## Related

- **[inventory-api](https://github.com/penteado40/inventory-api)** — Multi-tenant inventory REST API (Hono · TypeScript · Prisma · PostgreSQL)
- **[fa-wedding](https://github.com/penteado40/fa-wedding)** — Wedding site frontend (React · TypeScript · Vite · GitHub Pages)
- **[fawedding-api](https://github.com/penteado40/fawedding-api)** — Wedding site API with AWS SQS + Lambda + SES (Hono · CDK)

---

## Author

**Felipe Penteado** — Full Stack Engineer & Audio Engineer
[felipepenteado.com.br](https://felipepenteado.com.br) · [LinkedIn](https://linkedin.com/in/felipepenteado) · [GitHub](https://github.com/penteado40)
