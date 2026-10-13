# Per-route color tokens in Next 16 + Tailwind v4

Research for issue #7 (map: #4). Question: how can `/` (Hub), `/audio` and `/dev` share the same semantic `--color-*` tokens (`@theme inline` in `src/app/globals.css`) with **different values per route**, without a flash of wrong colors on SSR or client-side navigation? This also covers per-route metadata and moving the current page from `/` to `/audio`.

Versions checked: `next@16.2.9`, `tailwindcss@4.3.1`, `react@19.2.4` (`package.json`, `node_modules/tailwindcss/package.json`).

## TL;DR (recommendation)

1. Keep **one root layout** (`src/app/layout.tsx`). Do **not** use multiple root layouts.
2. Add a **nested layout per persona** that renders a wrapper `<div data-persona="hub|audio|dev">`:
   - `src/app/(hub)/layout.tsx` + `src/app/(hub)/page.tsx` → `/`
   - `src/app/audio/layout.tsx` + `page.tsx` → `/audio` (the current page moves here)
   - `src/app/dev/layout.tsx` + `page.tsx` → `/dev`
3. In `globals.css`, keep the `@theme inline` block as it is (one semantic structure). Add **one block per persona** that redefines only the `--brand-*` palette variables, and scope it to the root element so that *everything* follows:
   ```css
   :root:has([data-persona="audio"]) { --brand-midnight: …; --brand-red: …; }
   :root:has([data-persona="dev"])   { … }
   ```
   (Default `:root` values = Hub, or whichever palette is the fallback.)
4. Per-route `metadata` / `viewport.themeColor` goes in each persona layout. The root layout keeps a `title.template`.
5. No redirect is needed for `/` → `/audio`, because `/` stays a live route (the Hub). Hash links (`/#projects`) cannot be redirected server-side. Update internal links instead.

All of the persona CSS is in one stylesheet and is SSR'd. The `data-persona` attribute is part of the server HTML and is swapped by React in the same commit as the new page content during client navigation. So there is no flash and no JS theme script.

## Grounding: the current code

- `src/app/globals.css` defines raw palette vars on `:root` (`--brand-midnight`, `--brand-red`, …). It maps them to semantic tokens in `@theme inline { --color-background: var(--brand-midnight); --color-accent: var(--brand-red); … }`.
- Hand-written CSS in the same file consumes the **semantic** vars directly: `body { background: var(--color-background) }`, `::selection`, `.glass*` (`var(--color-surface)`, `var(--color-white)`).
- `src/app/layout.tsx` is the single root layout (`<html>`, `<body>`, `LocaleProvider`) with static `metadata` ("Felipe Penteado - Audio Engineer").
- `src/app/page.tsx` is the audio portfolio (Hero, Projects, Testimonials, …) at `/`.

## Finding 1: how `@theme inline` actually compiles (decides where overrides must go)

Tailwind docs: with `inline`, "the utility class will use the theme variable *value* instead of referencing the actual theme variable". The docs show this exact use case: palette vars on `:root`, overridden under `[data-theme="dark"]`, mapped via `@theme inline { --color-canvas: var(--acme-canvas-color) }`. ([tailwindcss.com/docs/theme#referencing-other-variables](https://tailwindcss.com/docs/theme#referencing-other-variables), [tailwindcss.com/docs/colors#using-a-custom-palette / "Referencing dynamic CSS variables"](https://tailwindcss.com/docs/colors))

Verified in this repo's compiled CSS (`.next/dev/static/chunks/src_app_globals_css_*.css`):

```css
@layer theme { :root, :host { --color-background: var(--brand-midnight); --color-accent: var(--brand-red); … } }
.bg-background { background-color: var(--brand-midnight); }   /* utility inlines the brand var */
body { background: var(--color-background); }                  /* hand-written rule uses semantic var */
```

Consequences:

- **Utilities** (`bg-accent`, `text-ink/70`, …) reference `--brand-*` directly. Overriding `--brand-*` on *any* ancestor element re-themes them.
- **Semantic vars** (`--color-*`) are declared on `:root`. A custom property whose value contains `var()` is resolved where it is declared, and descendants inherit the *computed* value (same mechanism as the docs' `--font-sans` / `#parent` / `#child` example). So `body`, `::selection` and `.glass*`, which read `var(--color-*)`, would **ignore** a `--brand-*` override placed only on a wrapper `<div>`. They would keep the `:root` palette. This is the main pitfall of the naive "wrapper div with `data-persona`" approach.
- Fix: apply the override **at the root element**. `:root:has([data-persona="audio"])` does this declaratively from a wrapper rendered anywhere in the tree. Two alternatives also work: also redeclare `--color-*` inside the persona block, or switch the hand-written rules to `--brand-*`. `:root:has()` is the smallest change and also re-themes `html`/`body` background, scrollbar area and overscroll.
- The theme vars live in `@layer theme`. The project's `:root { --brand-* }` and the persona blocks are unlayered, so they win the cascade regardless of specificity.
- `:has()` is Baseline (Chrome 105, Safari 15.4, Firefox 121). If that is a concern, use the alternative of redeclaring `--color-*` in `[data-persona=…]` blocks. That still themes everything inside the wrapper, but not `html`/`body` themselves.

## Finding 2: route groups and layouts in Next 16

From `node_modules/next/dist/docs/01-app/`:

- Route groups `(folder)` are omitted from the URL. Their use cases include "Defining multiple root layouts" and "Opting specific route segments into sharing a layout". (`03-api-reference/03-file-conventions/route-groups.md`)
- **Multiple root layouts**: "If you navigate between routes that use different root layouts, it'll trigger a full page reload… This **only** applies to multiple root layouts." (`route-groups.md` Caveats; also `03-file-conventions/layout.md` §Root Layout: "Navigating across multiple root layouts will cause a full page load (as opposed to a client-side navigation)".)
  - This works for theming (each root layout could set `<html data-persona>` server-side), but it loses SPA navigation between Hub ↔ Audio ↔ Dev. Each root layout must also repeat `<html>`/`<body>`, fonts and `LocaleProvider` (`02-project-structure.md` §Creating multiple root layouts). **Not recommended** for a portfolio whose Hub exists to link to the other two.
- **Layouts do not re-render on navigation and cannot see the pathname**: "Layouts do not re-render on navigation, so they do not access pathname which would otherwise become stale." (`layout.md` §Pathname). So the single root layout **cannot** server-render a per-route `data-persona` on `<html>`. Setting it on `<html>` would need a client component (`usePathname` + `useEffect`), which runs after paint, so you get a **flash** on first load. That rules out "attribute on `<html>` from the root layout".
- **Nested layouts** (`app/audio/layout.tsx`, `app/(hub)/layout.tsx`) are server components that render as part of their segment. On a client navigation from `/audio` to `/dev`, the root layout persists and the `audio` segment is replaced by the `dev` segment. The wrapper `<div data-persona>` changes in the same React commit as the new content, so no frame shows new content with old colors. On a hard load it is in the SSR HTML.
- Putting the Hub in `(hub)/` (rather than `app/page.tsx` directly) gives it its own layout and wrapper without affecting `/audio` or `/dev`. This needs no change to the root layout. The top-level root layout remains, so the "home route must be inside a group" caveat for multiple root layouts doesn't apply.

## Finding 3: don't split persona CSS into per-route imports

`01-getting-started/11-css.md` (Global CSS, "Good to know"): global styles can be imported in any layout/page, "However, since Next.js uses React's built-in support for stylesheets to integrate with Suspense, this currently **does not remove stylesheets as you navigate between routes** which can lead to conflicts."

So `app/audio/persona.css` with `:root { --brand-red: … }` would leak into `/dev` after navigating. Keep all persona blocks in `globals.css`, each behind its own selector (`:root:has([data-persona="…"])`), so only the active one matches. The same file also says ordering can differ in dev vs `next build` (§Ordering and Merging). One file with selector-scoped blocks avoids depending on order.

## Finding 4: per-route metadata

- `metadata` / `generateMetadata` can be exported from `layout.js` and `page.js`. Segments are **shallowly merged** in evaluation order, so later segments replace earlier keys, including whole nested objects such as `openGraph`. (`03-api-reference/04-functions/generate-metadata.md` §Merging)
- Recommended: in the root layout, `title: { template: '%s · Felipe Penteado', default: 'Felipe Penteado' }`. In each persona layout, set its own `title`, `description` and a full `openGraph` object, because shallow merging means a partial `openGraph` would drop the parent's fields. Note that `title.template` in a layout does not apply to a `title` in a `page.js` of the **same** segment (`generate-metadata.md` ~L287). Put persona titles in the persona layout or page accordingly.
- Browser chrome color: export `viewport = { themeColor: '…' }` per persona layout (`03-api-reference/04-functions/generate-viewport.md` §themeColor). `themeColor` takes a literal value, so it is the one place the persona hex repeats outside `globals.css`. Keeping it in sync with the palette is a small manual step.
- Don't add `<title>`/`<meta>` manually to layouts. Use the Metadata API (`layout.md` §Metadata, "Good to know").

## Finding 5: moving the current page from `/` to `/audio`

- Move `src/app/page.tsx` → `src/app/audio/page.tsx` (plus `audio/layout.tsx` with `data-persona="audio"` and audio metadata). Create the Hub at `src/app/(hub)/page.tsx`.
- **No redirect for `/`**: it stays a valid route (the Hub). A `/` → `/audio` redirect would hide the Hub. `next.config` `redirects()` uses `permanent: true` → 308 (cached forever by clients/search engines) and `false` → 307 (`05-config/01-next-config-js/redirects.md`). Use them only if an old path disappears, which is not the case here.
- **Hash anchors**: the current Navbar/Hero use relative `#about`, `#projects` (`src/components/Navbar.tsx` L28-31, `Hero.tsx` L87), so they keep working once the page lives at `/audio`. Externally shared `/#contact`-style links can't be fixed with a redirect, because the fragment is never sent to the server. They will land on the Hub, which should therefore link clearly to `/audio` (and `/dev`).
- SEO: set canonical / `openGraph.url` per persona layout (`metadataBase` in the root layout).

## Options compared

| Option | SSR / first paint | Client nav (root layout persists) | Themes `body`/`.glass` | Cost |
|---|---|---|---|---|
| **A. Nested layout wrapper `data-persona` + `:root:has()` override of `--brand-*`** (recommended) | Correct, attribute in HTML | Swaps atomically with segment, SPA kept | Yes (override at root) | 3 small layouts, 2 CSS blocks |
| B. Wrapper `data-persona` overriding `--brand-*` on the wrapper only | Correct | Correct | **No**: `--color-*` resolved on `:root` (Finding 1) | Needs `--color-*` redeclared too |
| C. Multiple root layouts, `<html data-persona>` per group | Correct | **Full page reload** between personas | Yes | Duplicated html/body/fonts/providers |
| D. Root layout + client `usePathname` sets `<html data-persona>` | **Flash** (effect after paint) | Brief flash | Yes | JS, hydration ordering |
| E. Per-route CSS file overriding `:root` | Correct on hard load | **Leaks**: stylesheets not removed on nav (Finding 3) | Yes | Fragile |

## Sources

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md`: convention, multiple root layouts, full-page-load caveat.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`: §Root Layout (multiple root layouts → full page load), §Pathname (layouts don't re-render on navigation), §Metadata.
- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`: §Creating multiple root layouts.
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`: §Global CSS (stylesheets not removed on navigation), §Ordering and Merging.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`: §Merging (shallow), title.template caveat.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-viewport.md`: §themeColor.
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md`: 307/308 semantics.
- Tailwind CSS v4 docs: [Theme variables → Referencing other variables](https://tailwindcss.com/docs/theme#referencing-other-variables), [Colors → referencing dynamic CSS variables with `@theme inline` + `[data-theme]` override](https://tailwindcss.com/docs/colors), [Adding custom styles → `@custom-variant` scoped to `[data-theme]`](https://tailwindcss.com/docs/adding-custom-styles) (retrieved via context7 `/tailwindlabs/tailwindcss.com`).
- Empirical: compiled dev CSS `.next/dev/static/chunks/src_app_globals_css_*.css` in this repo: theme vars emitted in `@layer theme { :root, :host { … } }`, utilities inline `var(--brand-*)`.
