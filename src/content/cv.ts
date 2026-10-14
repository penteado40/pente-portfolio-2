import type { Locale } from '../i18n/locale';

/**
 * The CV PDF for the active locale, from `public/cv/felipe-penteado-{locale}.pdf`.
 * PT is the original, so it always exists; a locale whose translation isn't
 * in `available` gets the PT file, and `fallback` tells the button to label
 * it as such.
 */
export function cvLink(locale: Locale, available: readonly Locale[]) {
  const file = locale === 'pt' || available.includes(locale) ? locale : 'pt';
  return { href: `/cv/felipe-penteado-${file}.pdf`, fallback: file !== locale };
}
