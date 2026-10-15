# 0002. Hub at `/` and one route per persona

- Status: accepted
- Date: 2026-10-14
- Context: wayfinder map [#4](https://github.com/penteado40/pente-portfolio-2/issues/4); Audio migration spec [#15](https://github.com/penteado40/pente-portfolio-2/issues/15); Hub and Navbar prototype [#8](https://github.com/penteado40/pente-portfolio-2/issues/8)

## Context

The site was a single page at `/` presenting the Audio Engineer. It now has to present two Personas (Audio Engineer and Systems Developer) with their own content, colors and sections, plus a Hub where the visitor chooses between them. Links to the old page (`/#projects`, `/#contact`, …) are already shared on social media.

## Decision

- `/` is the **Hub**. Each persona gets its own route: `/audio` and `/dev`.
- All routes share one root layout (`src/app/layout.tsx`) with `<html>` (its `lang` read from the locale cookie, see [ADR 0001](0001-locale-cookie-read-on-the-server.md)), fonts, a `title.template` and the Onyx `themeColor`. Nothing persona-specific lives there.
- Each persona has a nested layout (`src/app/<persona>/layout.tsx`) that renders the `data-persona` wrapper (see [ADR 0003](0003-persona-color-tokens.md)), the persona's metadata, its providers (including the `LocaleProvider` with `common` plus the persona's dictionary), the Navbar and the Footer. The page renders only the persona's sections.
- The **Navbar** is shared and configured by props: `items` (section anchors) and optional `actions` (persona buttons, e.g. the Audio persona's testimonial button). It knows nothing about any persona. `actions` is a list of `{ label, Icon, onClick }` rather than a ReactNode slot, because the Navbar renders each action three ways (desktop pill, compact icon, mobile menu entry; one way since PROJ-154, see below). Since labels come from the client-side dictionary and `onClick` can't cross from a server layout, each persona has a small client wrapper (e.g. `AudioNavbar`) that builds the props. The **Footer** is shared without props.
- Old links: the Hub forwards `/#<anchor>` to `/audio#<anchor>` on the client when the anchor is one of the Audio page's sections (`about`, `timeline`, `certifications`, `projects`, `skills`, `contact`, `testimonials`, `photos`). A brief flash of the Hub is accepted. This can be removed once old links stop mattering.
- API routes (`/api/contacts`, `/api/testimonials`) keep their paths.

## Alternatives considered

- **Keep one page and switch persona in place (tabs or a toggle).** No shareable URL per persona, one page carrying both personas' content, and metadata/OG images that can't differ per persona.
- **Audio stays at `/` and Dev is added at `/dev`.** Makes the Audio persona the default and leaves no place for a Hub; the two personas wouldn't be peers.
- **A route group with a separate root layout per persona.** Lets each persona own `<html>`, but navigating between root layouts is a full page reload, and fonts and providers get duplicated.
- **A central nav config read with `usePathname`.** The Navbar would have to know every persona. Two separate Navbars would duplicate the motion and layout logic.
- **Server redirect for old anchors.** The URL fragment never reaches the server, so only the client can forward `/#contact`.

## Consequences

- Adding a persona means adding a route folder with a layout and a page, a `data-persona` block in `globals.css`, and the persona's nav items.
- A new kind of action (not an icon button) needs a Navbar change.
- Persona metadata (title, description, OG image) lives in each persona's layout; the root only supplies the `title.template` and defaults.
- The Hub briefly renders before forwarding an old anchor link.

## Amendment (2026-10-14): the Hub's own bar and footer

PROJ-137 gives the Hub a plain top bar (`HubNavbar`) and footer (`HubFooter`) instead of the shared Navbar and Footer. The Hub has no sections to jump between, only the routes, so the floating Navbar has nothing to show; the shared Navbar and Footer stay the personas'.

## Amendment (2026-10-14): switching persona from the Navbar

PROJ-136 adds a third Navbar prop, `personas`: every persona with the current one marked (the expanded state's segmented selector) and the destination of the compact state's "go to" chip. The Navbar still knows no persona by name; the wrappers build the prop with `usePersonaSwitch('<persona>')`, which takes the order and routes from `src/content/personas.ts` and the labels from `common.json`. The "FP" logo leads back to the Hub in both states. Adding a persona now also means adding it to `PERSONAS`, giving it an icon in `PERSONA_ICONS` (`src/components/personaIcons.ts`), and adding its name under `navbar.personas` in `common.json`; with more than two, the chip needs a rule for which persona it points at.

PROJ-142 makes `src/content/personas.ts` the only source of persona ids and routes (`PersonaId`, `personaHref`): the Hub's cards and top bar iterate `PERSONAS` instead of naming `/audio` and `/dev`, and the legacy `/#anchor` redirect and `DictionaryName` build on them too. One icon map, `PERSONA_ICONS`, serves both the Hub (server components) and the Navbar; it imports from `@phosphor-icons/react/dist/ssr`, which client components can render as well. A persona's name lives only in `common.json` (`navbar.personas`), which every layout loads, and the chip's accessible name is one template, `navbar.switchTo`, with a `{persona}` slot. Both top bars switch language through `useLocaleSwitch`. A new persona also needs its Hub card copy (`cards.<persona>` in `hub.json`) and an entry in the Hub page's `PHOTOS`; TypeScript flags any of these maps that misses it.

## Amendment (2026-10-14): the mobile pill and the section menu

PROJ-154 splits the Navbar at Tailwind's `lg` into two islands that share the same props. From `lg` up, the island shrinks and expands as in PROJ-136; the expanded state now holds the logo with the name, the sections, the segmented selector and the language, and neither desktop state shows `actions` (they don't fit the expanded 1024px, and the Audio persona's Testimonials section has its own button), so each action renders one way: a mobile menu entry. Below `lg`, the island is a pill that always stays compact: logo, segmented selector, language and a menu button that opens the sections and the `actions` in a glass panel underneath, with focus kept inside it until it closes. The "go to" chip is only the compact desktop state's.

The segmented selector then moves out of the island into its own glass pill beside it, on both sizes (desktop: 56px, 10px from the island, which now expands up to 920px; mobile: 48px, 8px apart, the island keeping the logo, language and menu button). The pill sits in the same row as the island, so it follows the island as it shrinks and expands. With the selector always in view, the compact desktop island drops the "go to" chip: `personas` is just the selector's options, `personaSwitch` no longer returns a `destination`, and `navbar.switchTo` is gone from `common.json`. The note above about a rule for the chip with more than two personas no longer applies, and `PERSONA_ICONS` now serves only the Hub's cards.
