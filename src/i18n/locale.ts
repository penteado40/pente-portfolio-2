export type Locale = 'en' | 'pt';

export const LOCALE_COOKIE = 'locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'pt';
}

/**
 * The cookie (set by the language switcher) wins. Without it, any `pt*`
 * language the browser accepts gives `pt`; everything else, including a
 * missing header (bots, link previews), gives `en`.
 */
export function resolveLocale(cookie: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookie)) return cookie;
  return acceptsPortuguese(acceptLanguage ?? '') ? 'pt' : 'en';
}

function acceptsPortuguese(acceptLanguage: string): boolean {
  return acceptLanguage.split(',').some((entry) => {
    const [tag, ...params] = entry.trim().toLowerCase().split(';');
    if (tag !== 'pt' && !tag.startsWith('pt-')) return false;
    const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    return q === undefined || Number(q.slice(2)) > 0;
  });
}
