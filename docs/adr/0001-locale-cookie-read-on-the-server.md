# 0001. Locale in a cookie read on the server, not in the URL

- Status: accepted
- Date: 2026-10-14
- Context: wayfinder map [#4](https://github.com/penteado40/pente-portfolio-2/issues/4); i18n for the Hub and the Dev persona [#12](https://github.com/penteado40/pente-portfolio-2/issues/12)

## Context

The site is bilingual (EN / PT). Until now the locale lived in `localStorage` and was read on the client, so the server always rendered English: every PT visitor saw a flash of English, `<html lang>` was always `en`, and both full dictionaries shipped in the client bundle. The site is now a Hub (`/`) plus one route per Persona (`/audio`, `/dev`, see [ADR 0002](0002-hub-and-route-per-persona.md)), each with its own copy.

## Decision

- **No locale in the URL.** Routes stay `/`, `/audio`, `/dev`.
- **The locale lives in a `locale` cookie read on the server** (`getLocale` in `src/i18n/dictionaries.ts`). The root layout renders `<html lang>` from it, and every page renders in that locale from the first byte. Pages are therefore rendered per request.
- **First visit (no cookie):** if `Accept-Language` lists any `pt*` tag (`pt`, `pt-BR`, `pt-PT`, …) with a non-zero `q`, the locale is `pt`; anything else, or no header at all, is `en`. The rule is the pure function `resolveLocale` in `src/i18n/locale.ts`.
- **The language switcher stores the choice** in the cookie for one year through a Server Action (`setLocaleCookie`). Setting the cookie in a Server Action re-renders the route in the same roundtrip, and the cookie wins over `Accept-Language` from then on. `localStorage` is no longer read; an old value there is ignored.
- **Dictionaries are split per persona:** `src/i18n/{en,pt}/{common,hub,audio,dev}.json`. `common` holds the shared chrome (Navbar, Footer, Contact, persona and language switchers). Each layout loads `common` plus its own file in the request's locale and passes it to the client `LocaleProvider`, so a route only ships its own dictionary in one language.
- **Metadata follows the request's locale** too (when it gets translated). Link-preview crawlers send no cookie and usually no `Accept-Language`, so previews come out in English.

## Alternatives considered

- **Locale in the URL (`/pt/dev`).** The portfolio is found by name, so ranking in two languages gains little. The cost would be a `[lang]` segment in every route, redirects from the current URLs, and a bigger migration. Revisit if indexing the PT version starts to matter.
- **Keep `localStorage`.** It can't be read on the server, so the English flash and the wrong `<html lang>` would stay.
- **Detection only, no stored choice.** A visitor whose browser prefers one language but who wants the other would have to switch on every visit.
- **One dictionary per locale.** Every route would ship the copy of every persona.

## Consequences

- Search engines index one language only (whatever their crawler resolves to, in practice English).
- Every page is dynamic: no static prerender and no CDN caching of the HTML. Fine for a portfolio's traffic; the testimonials fetch keeps its own cache.
- Responses vary by cookie and `Accept-Language`. If the HTML is ever cached at the edge, the cache key must include both.
- The Hub has its own layout in the `src/app/(hub)/` route group so it can load `common` + `hub` like the personas do.
- Client components read the dictionary with `useLocale<AudioDictionary>()` (or the persona they render in); calling it outside a `LocaleProvider` throws.
