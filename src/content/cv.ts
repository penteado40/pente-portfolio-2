// Relative, not `@/`: cv.test.ts runs under plain `node --test`, which has no path aliases.
import type { Locale } from '../i18n/locale';

// The names in `public/cv/`. The download button saves under this name too.
const cvFiles: Record<Locale, string> = {
  pt: 'CV_Felipe_Penteado_Node.pdf',
  en: 'CV_Felipe_Penteado_Node_EN.pdf',
};

/**
 * The CV PDF for the active locale, from `public/cv/`.
 * PT is the original, so it always exists; a locale whose translation isn't
 * in `available` gets the PT file, and `fallback` tells the button to label
 * it as such.
 */
export function cvLink(locale: Locale, available: readonly Locale[]) {
  const file = locale === 'pt' || available.includes(locale) ? locale : 'pt';
  return { href: `/cv/${cvFiles[file]}`, fallback: file !== locale };
}
