# 0002. Hub at `/` and one route per persona

- Status: accepted
- Date: 2026-10-14
- Context: wayfinder map [#4](https://github.com/penteado40/pente-portfolio-2/issues/4); Audio migration spec [#15](https://github.com/penteado40/pente-portfolio-2/issues/15); Hub and Navbar prototype [#8](https://github.com/penteado40/pente-portfolio-2/issues/8)

## Context

The site was a single page at `/` presenting the Audio Engineer. It now has to present two Personas (Audio Engineer and Systems Developer) with their own content, colors and sections, plus a Hub where the visitor chooses between them. Links to the old page (`/#projects`, `/#contact`, …) are already shared on social media.

## Decision

- `/` is the **Hub**. Each persona gets its own route: `/audio` and `/dev`.
- All routes share one root layout (`src/app/layout.tsx`) with `<html>`, fonts, `LocaleProvider`, a `title.template` and the Onyx `themeColor`. Nothing persona-specific lives there.
- Each persona has a nested layout (`src/app/<persona>/layout.tsx`) that renders the `data-persona` wrapper (see [ADR 0003](0003-persona-color-tokens.md)), the persona's metadata, its providers, the Navbar and the Footer. The page renders only the persona's sections.
- The **Navbar** is shared and configured by props: `items` (section anchors) and optional `actions` (persona buttons, e.g. the Audio persona's testimonial button). It knows nothing about any persona. The **Footer** is shared without props.
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
- Persona metadata (title, description, OG image) lives in each persona's layout; the root only supplies the `title.template` and defaults.
- The Hub briefly renders before forwarding an old anchor link.
