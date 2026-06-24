# Context

## What this is

Portfolio website for Felipe Penteado, an audio engineer and systems developer. Single-page bilingual (EN/PT) site showcasing audio work, career trajectory, studio gear, and photos.

## Domain

- **Audio Engineer** — Felipe's primary professional identity. Specializes in vocal music: live events (FOH mixing), DVD productions, and studio mixing for vocal groups, bands, and independent artists.
- **Systems Developer** — Secondary identity. Backend services, APIs, and tooling in TypeScript, Go, Python.
- **FOH** — Front-of-house. The mixing position for live sound, facing the audience.
- **Vocal Livre** — A vocal group Felipe serves as technical director.
- **Ministerio VOX** — Ministry where Felipe started his professional audio career.
- **UNASP-HT** — Boarding school and university where Felipe began running audio for events.

## Architecture

Single Next.js 16 app with App Router. No backend, no database. Static portfolio.

- **Styling**: Tailwind v4 with custom glass utility classes in `globals.css`
- **Animation**: Motion (`motion/react`) for scroll reveals and stagger; spring physics for the navbar morph
- **Icons**: Phosphor Icons (`@phosphor-icons/react`)
- **i18n**: Client-side locale switching via React context (`LocaleProvider`). Dictionaries in `src/i18n/en.json` and `src/i18n/pt.json`. No URL-based routing for locale.
- **Photos**: Optimized JPEGs in `public/photos/`, max 1600px, quality 75.

## Key design decisions

- **Dynamic Island navbar**: Compact icon pill over the hero section, spring-morphs to full bar on scroll or hover. Uses `maxWidth` + `borderRadius` spring animation.
- **Full-bleed hero**: Photo background (`photo_12.jpg`) with dark gradient overlay, text anchored at bottom. Scroll-driven zoom + fade-out.
- **CursorGlow**: Global amber spotlight that follows the mouse with spring physics and `mix-blend-mode: screen`. Desktop only (fine pointer).
- **Glassmorphism**: `backdrop-filter: blur(20px) saturate(180%)` with layered borders and inner shadows. Defined as `.glass` and `.glass-strong` utilities.
- **Warm white palette**: Background `#f8f7f4`, amber-700 accent, stone neutrals. Light mode only (user requested "white colors").
