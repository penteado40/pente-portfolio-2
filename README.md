# Felipe Penteado - Portfolio

Portfolio website for Felipe Penteado, audio engineer and systems developer. Bilingual (EN/PT), single-page, with motion design and glassmorphism.

## Stack

- **Next.js 16** (App Router, React 19)
- **Tailwind v4**
- **Motion** (`motion/react`) for animations
- **Phosphor Icons**
- **Geist + Geist Mono** fonts

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    layout.tsx          # Root layout (fonts, locale provider)
    page.tsx            # Main page (all sections)
    globals.css         # Tailwind + glass utilities
  components/
    Navbar.tsx          # Dynamic Island navbar (compact/expanded morph)
    Hero.tsx            # Full-bleed photo hero with scroll zoom
    About.tsx           # Photo + bio + quote
    Projects.tsx        # Spotify/YouTube embeds + productions
    Timeline.tsx        # Career milestones (vertical timeline)
    Skills.tsx          # Studio gear + dev skills (glass cards)
    Photos.tsx          # Masonry photo grid (27 photos)
    Contact.tsx         # Glass card contact form
    Footer.tsx          # Social links (email, Instagram, LinkedIn, GitHub)
    CursorGlow.tsx      # Mouse-following amber spotlight (desktop only)
  i18n/
    LocaleProvider.tsx  # Client-side locale context + hook
    en.json             # English dictionary
    pt.json             # Portuguese dictionary
public/
  photos/               # Optimized JPEGs (max 1600px, quality 75)
```

## Features

**Dynamic Island Navbar** - Compact icon pill over the hero, spring-morphs to full bar on scroll or hover. Collapses back when mouse leaves.

**Full-bleed Hero** - Studio photo (`photo_12.jpg`) as background with dark gradient overlay. Content at bottom. Scroll-driven zoom + fade-out.

**Cursor Glow** - Amber spotlight follows the mouse with spring physics. `mix-blend-mode: screen`. Desktop only, respects `prefers-reduced-motion`.

**Bilingual** - EN/PT toggle persisted to localStorage. All visible text comes from JSON dictionaries.

**Glassmorphism** - `.glass` and `.glass-strong` utilities with `backdrop-filter`, layered borders, and inner shadows. Solid fallback for `prefers-reduced-transparency`.

**Scroll Animations** - Section reveals using Motion's `whileInView` with stagger. All gated by `useReducedMotion()`.

**Photo Gallery** - 27 optimized photos in a masonry-style grid with hover zoom.

**Embedded Media** - Spotify playlist and YouTube videos from real Vocal Livre performances.

## Content

All text content comes from the i18n JSON files. Edit `src/i18n/en.json` and `src/i18n/pt.json` to update copy. Social links are in `Footer.tsx`. Photo list is in `Photos.tsx`.

## Deploy

```bash
npm run build
```

Deploy the `.next` output to Vercel, Netlify, or any Node.js host.
