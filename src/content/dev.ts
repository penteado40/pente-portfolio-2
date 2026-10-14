import type { Locale } from '@/i18n/locale';

/*
 * Structured data of the Dev persona: ids, dates, links and lists that
 * aren't translated. Translatable text lives in `src/i18n/{en,pt}/dev.json`,
 * keyed by the same ids, and each component joins the two (see docs/adr/0004).
 */

/**
 * Locales whose CV PDF is in `public/cv/` (see `cvLink`). PT is the original
 * and always listed; add a locale here when its translated file lands.
 */
export const cvLocales: readonly Locale[] = ['pt'];

/** Empty until there is one to show; the section and its Navbar anchor stay hidden. */
export const certifications: readonly { id: string }[] = [];
