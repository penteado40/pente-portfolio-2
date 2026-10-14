# 0004. Dev persona data in a typed content file, copy in the dictionary

- Status: accepted
- Date: 2026-10-14
- Context: wayfinder map [#4](https://github.com/penteado40/pente-portfolio-2/issues/4); Dev page sections and content [#9](https://github.com/penteado40/pente-portfolio-2/issues/9); i18n for the Hub and the Dev persona [#12](https://github.com/penteado40/pente-portfolio-2/issues/12)

## Context

The Dev persona (`/dev`) lists structured items: Experience entries with dates and stack tags, Projects with a kind, a status, repos (some private), a demo link and an image, Skills and Certifications. Most of each item doesn't depend on the language: ids, dates, URLs, stack names, flags. Only a few fields do: titles, summaries, highlights, the context line and bullets of an Experience entry.

The Audio persona keeps everything, lists included, in its dictionary (`src/i18n/{en,pt}/audio.json`). Doing the same for the Dev would copy every URL, date and stack tag into both language files, where they drift apart, and a dictionary is plain JSON, so a missing field or a typo in `kind` would only show up at runtime.

## Decision

- **Structured data lives in `src/content/dev.ts`**, typed in TypeScript: ids, `kind`, `status`, `stack`, `repos`, `demo`, `image`, Experience dates, the Skills and Certifications lists, and the locales that have a CV PDF (`cvLocales`). It is written once for both languages.
- **Translatable copy lives in `src/i18n/{en,pt}/dev.json`**, keyed by the same ids as the items in `dev.ts`. It holds only text a visitor reads: titles, summaries, highlights, Experience context and bullets, plus the page chrome (hero, section titles, Navbar labels).
- **Each component joins the two**: it maps over the list from `dev.ts` and reads the text for each item from the dictionary by its id.
- **The Audio persona doesn't change.** It keeps its lists in the dictionary and can move to this pattern later.

## Alternatives considered

- **Everything in the dictionary, like the Audio.** No join, but every language-independent value is duplicated per language, and nothing checks the shape of an item.
- **Everything in `dev.ts`, with `{ en, pt }` on each translatable field.** One file and fully typed, but every locale ships to the client together, against [ADR 0001](0001-locale-cookie-read-on-the-server.md), and copy edits happen inside code.
- **A CMS or MDX files.** More than a portfolio with a handful of items needs.

## Consequences

- Adding an item means an entry in `dev.ts` and the matching text, under the same id, in both `dev.json` files. A missing text entry isn't caught by the type checker, since the dictionary type comes from the EN file only.
- Ids become a contract between the two files: renaming one means renaming it in three places.
- `dev.ts` is bundled with the client components that read it. It holds no secrets and no copy, so that is fine.
