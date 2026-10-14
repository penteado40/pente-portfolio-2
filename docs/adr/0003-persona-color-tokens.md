# 0003. Per-persona color tokens via `data-persona` and `:root:has()`

- Status: accepted
- Date: 2026-10-13
- Context: wayfinder map [#4](https://github.com/penteado40/pente-portfolio-2/issues/4); research [#7](https://github.com/penteado40/pente-portfolio-2/issues/7); palette [#5](https://github.com/penteado40/pente-portfolio-2/issues/5)

## Context

The site is splitting into a Hub (`/`) and two Personas (`/audio`, `/dev`). All three share one Onyx base (`background`, `mist`, `surface`, `ink`, state colors), but each persona has its own `accent`, `accent-dark` and `highlight`. Components must keep using the same semantic Tailwind tokens (`bg-accent`, `ring-highlight`, …) and never know which persona they render in.

Constraints found in the research (#7):

- Tailwind v4 `@theme inline` makes utilities inline `var(--brand-*)`, but the `--color-*` tokens are declared on `:root` and inherited already resolved. Hand-written CSS that reads `var(--color-*)` (`body`, `::selection`, `.glass*`) only changes if the `--brand-*` override applies to `:root` itself.
- Next 16 layouts don't re-render on navigation and can't see the pathname, so the root layout can't server-render a per-route attribute on `<html>`.
- Next 16 does not remove stylesheets when navigating, so per-route CSS files leak into other routes.
- Navigating between different root layouts triggers a full page reload.

## Decision

Each persona's page (later, its nested layout) renders a wrapper `<div data-persona="hub|audio|dev">`. `globals.css` keeps one `@theme inline` block and adds one block per persona that redefines only the `--brand-*` persona variables, scoped to the root element:

```css
:root,
:root:has([data-persona="hub"])   { --brand-accent: …; --brand-highlight: …; }
:root:has([data-persona="audio"]) { … }
:root:has([data-persona="dev"])   { … }
```

The Hub block is also the plain `:root` fallback. All persona values live in `globals.css`, the only file allowed to hold hex values.

The attribute is in the SSR HTML, and on client navigation React swaps it in the same commit as the new content, so there is no flash and no theme script. Because the override sits on `:root`, portaled UI (modals rendered outside the wrapper) and `html`/`body` follow the persona too.

## Alternatives considered

- **Override `--brand-*` on the wrapper only.** Themes utilities inside the wrapper, but `body`, `::selection` and `.glass*` keep the `:root` palette because `--color-*` is resolved on `:root`. Fixing it means redeclaring every `--color-*` in each persona block, and `html`/`body` still wouldn't change.
- **Multiple root layouts with `<html data-persona>` per route group.** No flash, but every Hub ↔ persona navigation becomes a full page reload, and `<html>`/`<body>`, fonts and providers get duplicated.
- **`data-persona` on `<html>` set from the client (`usePathname` + effect).** The effect runs after paint, so the wrong colors flash on first load.
- **A CSS file per route that overrides `:root`.** Next 16 keeps stylesheets loaded after navigating away, so values leak between personas.

## Consequences

- Relies on `:has()` (Baseline: Chrome 105, Safari 15.4, Firefox 121). Older browsers fall back to the neutral Hub palette.
- Adding a persona means adding one CSS block and one wrapper; components don't change.
- `accent` is fill-only. It never colors text (Dark Azure is 2.8:1 and Deep Teal 1.6:1 on Onyx); text uses `ink`, and emphasis uses `highlight`.
- Per-persona values that must be literals outside CSS (`viewport.themeColor`) have to be kept in sync by hand.

## Amendment (2026-10-14): Liquid Glass refraction flag

PROJ-129 sets `data-glass-refraction` on `<html>` from a client effect (`LiquidGlassFilter`), the post-paint pattern rejected above for persona colors. It is accepted here because the cost is different: the first frame draws glass without refraction instead of in the wrong colors, and the flag can't be server-rendered, since only the browser knows whether it is Chromium (`navigator.userAgentData`). Persona colors still follow the decision above.

## Amendment (2026-10-14): OG images mirror the palette

PROJ-138's generated Open Graph images (`src/lib/ogImage.tsx`) are rendered by `ImageResponse`, which can't read CSS variables, so that file holds a hand-synced copy of the Onyx base and each persona's gradient stops and highlight. It joins `viewport.themeColor` as the second exception to "only `globals.css` holds hex values"; both are noted in the header of `globals.css`.
