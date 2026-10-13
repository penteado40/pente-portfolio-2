'use client';

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';
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

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function getSnapshot(): Locale {
  const saved = localStorage.getItem('locale');
  return saved === 'pt' ? 'pt' : 'en';
}

const getServerSnapshot = (): Locale => 'en';

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = (l: Locale) => {
    localStorage.setItem('locale', l);
    listeners.forEach((listener) => listener());
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
