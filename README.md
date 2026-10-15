# felipepenteado.com.br

> A bilingual (EN / PT) site with a Hub and two Personas, Audio Engineer and Systems Developer, each on its own page. Built with Next.js 16, React 19 and Tailwind v4.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/motion%2Freact-8B5CF6?style=flat)

**[felipepenteado.com.br](https://felipepenteado.com.br)**

---

## Overview

| Route | What it shows |
|-------|---------------|
| `/` | The **Hub**: name, portrait, a tagline and one card per Persona to choose where to go. Old links like `/#projects` are forwarded to the same anchor on `/audio`. |
| `/audio` | The **Audio persona**: hero, stats, about, timeline, certifications, Productions (Spotify and YouTube embeds, DVD cards), gear, Testimonials, photos and contact. |
| `/dev` | The **Dev persona**: hero with the CV, about, experience and education, certifications (hidden while empty), Projects split into Products and Studies, stack and contact. |

The domain terms (Persona, Hub, Production, Product, Study, Color block, Chip…) are defined in [CONTEXT.md](CONTEXT.md).

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4, per-persona color tokens in `globals.css` |
| Animations | motion/react |
| Icons / fonts | Phosphor Icons, Geist + Geist Mono |
| i18n | Locale cookie read on the server, JSON dictionaries per route |
| Backend | API routes that proxy contact messages and testimonials to an external API |
| Social previews | Open Graph images generated per route with `next/og` |
| Deploy | Vercel |

---

## Features

- **Dynamic Island Navbar with a persona switch.** A compact pill over the hero that springs open into the full section menu, with a segmented selector to jump between the Audio and Dev personas.
- **Per-persona tokens.** One Onyx base for the whole site; each Persona brings its own accent, highlight and Color block tones, and components only use semantic tokens (`bg-accent`, `text-highlight`).
- **Liquid Glass.** Glass surfaces with blur, sheen and a tilt-following highlight, plus SVG refraction on Chromium. Falls back to solid fills under `prefers-reduced-transparency`.
- **Scroll reveal.** Sections and items enter with staggered motion; everything is static under `prefers-reduced-motion`.

---

## Technical decisions

The decisions that are hard to reverse have their own ADR:

- [0001. Locale in a cookie read on the server, not in the URL](docs/adr/0001-locale-cookie-read-on-the-server.md)
- [0002. Hub at `/` and one route per persona](docs/adr/0002-hub-and-route-per-persona.md)
- [0003. Per-persona color tokens via `data-persona` and `:root:has()`](docs/adr/0003-persona-color-tokens.md)
- [0004. Dev persona data in a typed content file, copy in the dictionary](docs/adr/0004-dev-data-separate-from-copy.md)

Smaller notes:

- **Liquid Glass, plan A:** glass on every `.glass` surface, content cards included. Plan B (glass only on controls, solid content cards) stays possible as a CSS swap in `globals.css`.
- **Navbar by props:** one shared Navbar takes `items` (section anchors) and `actions` (persona buttons, such as the testimonial button); a small client wrapper per persona (`AudioNavbar`, `DevNavbar`) builds them.
- **Static OG images, text in English:** each route's `opengraph-image` is rendered once, so its text stays in English while the page metadata follows the request's locale.
- **Testimonials only on the Audio persona, and contact without an origin:** the Dev page has no Testimonials, and the contact form sends the same payload from both personas.
- **Removed:** the cursor glow, and the Stats section on the Dev persona.

---

## Project structure

```
src/
├── app/         # Routes: (hub) at /, audio/, dev/, api/ (proxy routes), root layout, globals.css
├── components/  # UI components and hooks, shared by the three routes
├── content/     # Typed data and helpers: Dev content, personas, links, SEO, CV
├── i18n/        # Locale resolution, dictionary loading, en/ and pt/ JSON dictionaries
└── lib/         # Server helpers: OG image, contact and testimonial requests
public/photos/   # Photos, production covers and badges
docs/adr/        # Architecture decision records
```

---

## Editing content

All visible text lives in the dictionaries, in both languages: change `src/i18n/en/<file>.json` and `src/i18n/pt/<file>.json` together. `npm test` fails if the two files stop having the same keys.

### Hub (`/`)

| I want to change… | I edit… |
|-------------------|---------|
| Tagline, card copy, page title and description | `src/i18n/{en,pt}/hub.json` |
| Portrait (also the Audio About photo) | `public/photos/pente-portrait.jpg` |
| Audio card photo | `public/photos/pente-hub-audio-bg.jpg` |
| Dev card photo | Add `public/photos/pente-hub-dev-bg.jpg` (until then the card shows the Dev glow) |
| Card order | `PERSONAS` in `src/content/personas.ts` |

### Audio (`/audio`)

| I want to change… | I edit… |
|-------------------|---------|
| Any text: hero, stats, about, timeline, gear, Productions | `src/i18n/{en,pt}/audio.json` |
| Certifications (with their badge image) | `certifications.items` in `src/i18n/{en,pt}/audio.json` |
| Hero photo | The image `src` in `src/components/Hero.tsx` (a file in `public/photos/`) |
| Photo grid and Instagram posts | The `photos` and `instagramPosts` lists in `src/components/Photos.tsx` |
| Testimonials | Approved in the external API; the page reads them on the server |

### Dev (`/dev`)

| I want to change… | I edit… |
|-------------------|---------|
| Text: hero, about, section titles, Experience, Projects, stack notes | `src/i18n/{en,pt}/dev.json` |
| Experience and education dates, companies, stack tags | `experience` and `education` in `src/content/dev.ts` |
| Projects: kind, status, stack, repos, demo, screenshot | `projects` in `src/content/dev.ts` |
| Stack lists | `skills` in `src/content/dev.ts` |
| Certifications | `certifications` in `src/content/dev.ts` (the section shows up with the first one) |
| CV PDF | Add `public/cv/felipe-penteado-pt.pdf`: the hero's CV button links to it and returns a 404 until it exists. For a translation, add `public/cv/felipe-penteado-en.pdf` and `'en'` to `cvLocales` in `src/content/dev.ts` |
| Hero and about photos | Add `public/photos/pente-dev-hero.jpg` and `public/photos/pente-dev-portrait.jpg` (until then the Dev glow stands in) |

### Common

| I want to change… | I edit… |
|-------------------|---------|
| Navbar labels, contact form, footer | `src/i18n/{en,pt}/common.json` |
| Email and social links | `src/content/links.ts` |
| Site name and URL | `src/content/seo.ts` |
| Persona colors | The `[data-persona=…]` blocks in `src/app/globals.css`, and `PERSONA_COLORS` in `src/lib/ogImage.tsx`, which mirrors them by hand |

A new photo (Hub Dev card, Dev hero, Dev portrait) is picked up when the build or `npm run dev` starts; restart the dev server after adding one.

### Add a Project (Dev)

1. Decide the kind (see [CONTEXT.md](CONTEXT.md)): a **Product** has real users or clients; a **Study** was built to learn.
2. Add its id to `ProjectId` in `src/content/dev.ts`.
3. Add an entry to `projects` in `src/content/dev.ts`. The page splits the list by kind; among the Products, the first one is the large card.
   - Product: `kind: 'product'`, `status` (`'active'` or `'building'`), `stack`, `repos` (a repo without `url` is shown as private), and optionally `demo` and `image`.
   - Study: `kind: 'study'`, `stack` and exactly one public repo.
4. Add the text under `projects.items.<id>` in both `src/i18n/en/dev.json` and `src/i18n/pt/dev.json`: `title` and `summary`, plus `highlights` for a Product.
5. For a Product, add a 16:10 screenshot to `public/` and set `image` to its path. Until then the card shows the persona gradient.
6. Update the project list in `src/content/dev.test.ts`, which pins the order, and run `npm test`.

### Add a Production (Audio)

1. Add the cover image to `public/photos/`.
2. Add an entry to `projects.productions` in both `src/i18n/en/audio.json` and `src/i18n/pt/audio.json`, in the same position: `title`, `description`, `roles`, `image` (the path from step 1), `streams`, `youtubeId` (the video embedded in the card) and `youtubeUrl` (the link out).
3. A Production without a card goes elsewhere in the same files: as an embedded video or playlist in `projects.items`, or by name only in `projects.otherItems`.

---

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in API_URL and API_KEY
npm run dev                  # http://localhost:3000
```

| Variable | What it is |
|----------|------------|
| `API_URL` | Base URL of the external API for contact messages and testimonials. Without it the site runs, but the contact and testimonial forms answer 500 and no Testimonials show. |
| `API_KEY` | Sent to that API as `X-API-Key`. |

Other scripts: `npm test` (unit tests with `node --test`), `npm run lint`, `npm run build`.

---

## Author

**Felipe Penteado**, Systems Developer and Audio Engineer
[felipepenteado.com.br](https://felipepenteado.com.br) · [LinkedIn](https://www.linkedin.com/in/penteado-felipe) · [GitHub](https://github.com/penteado40)
