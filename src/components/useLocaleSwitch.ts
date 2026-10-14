'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import { otherLocale } from '@/i18n/locale';

/**
 * The language switcher, the same in every top bar however it is drawn: it
 * offers the other locale, labelled "PT" or "EN".
 */
export function useLocaleSwitch() {
  const { locale, setLocale, dict } = useLocale();
  const next = otherLocale(locale);
  return {
    label: next.toUpperCase(),
    ariaLabel: dict.navbar.switchLocale,
    switchLocale: () => setLocale(next),
  };
}
