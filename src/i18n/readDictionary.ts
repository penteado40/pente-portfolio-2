import { readFileSync } from 'node:fs';
import type { Locale } from './locale.ts';

/**
 * A dictionary file as plain JSON, for the tests: they run on Node, which
 * reads both locales from disk instead of through `getDictionary`.
 */
export function readDictionary(locale: Locale, name: string) {
  return JSON.parse(readFileSync(new URL(`./${locale}/${name}.json`, import.meta.url), 'utf8'));
}
