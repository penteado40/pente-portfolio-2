import 'server-only';
import { cookies, headers } from 'next/headers';
import { LOCALE_COOKIE, resolveLocale, type Locale } from './locale';
import type { Persona } from './types';

// Loaders run on the server only; each layout passes its own slice to the
// client, so a persona's bundle never carries the other personas' dictionaries.
const common = {
  en: () => import('./en/common.json').then((m) => m.default),
  pt: () => import('./pt/common.json').then((m) => m.default),
};

const personas = {
  hub: {
    en: () => import('./en/hub.json').then((m) => m.default),
    pt: () => import('./pt/hub.json').then((m) => m.default),
  },
  audio: {
    en: () => import('./en/audio.json').then((m) => m.default),
    pt: () => import('./pt/audio.json').then((m) => m.default),
  },
  dev: {
    en: () => import('./en/dev.json').then((m) => m.default),
    pt: () => import('./pt/dev.json').then((m) => m.default),
  },
};

export async function getLocale(): Promise<Locale> {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, headerList.get('accept-language'));
}

export async function getDictionary<P extends Persona>(locale: Locale, persona: P) {
  const [commonDict, personaDict] = await Promise.all([
    common[locale](),
    personas[persona][locale]() as Promise<Awaited<ReturnType<(typeof personas)[P]['en']>>>,
  ]);
  return { ...commonDict, ...personaDict };
}
