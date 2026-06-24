'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import en from './en.json';
import pt from './pt.json';

type Dictionary = typeof en;
type Locale = 'en' | 'pt';

const dictionaries: Record<Locale, Dictionary> = { en, pt };

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  dict: Dictionary;
}>({
  locale: 'en',
  setLocale: () => {},
  dict: en,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved === 'en' || saved === 'pt') {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('locale', l);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dict: dictionaries[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
