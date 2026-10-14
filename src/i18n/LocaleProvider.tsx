'use client';

import { createContext, useContext, useTransition, type ReactNode } from 'react';
import { setLocaleCookie } from './actions';
import { otherLocale, type Locale } from './locale';
import type { CommonDictionary } from './types';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dict: CommonDictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Receives the locale and dictionary resolved on the server (see
 * `getLocale`/`getDictionary`); each layout passes `common` plus its own persona.
 */
export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: CommonDictionary;
  children: ReactNode;
}) {
  const [, startTransition] = useTransition();

  const setLocale = (l: Locale) => {
    startTransition(() => setLocaleCookie(l));
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * `D` is the dictionary of the layout the component renders under, e.g.
 * `useLocale<AudioDictionary>()` inside the Audio persona.
 */
export function useLocale<D extends CommonDictionary = CommonDictionary>() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale must be used inside a LocaleProvider');
  return value as Omit<LocaleContextValue, 'dict'> & { dict: D };
}

/**
 * The language switcher, the same in every navbar however it is drawn: it
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
