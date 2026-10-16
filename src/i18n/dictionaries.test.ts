import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Locale } from './locale.ts';
import { readDictionary } from './readDictionary.ts';

const NAMES = ['common', 'hub', 'audio', 'dev'] as const;

function load(locale: Locale, name: string): Record<string, unknown> {
  return readDictionary(locale, name);
}

function keyPaths(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

for (const name of NAMES) {
  test(`${name}: en and pt have the same keys`, () => {
    assert.deepEqual(keyPaths(load('pt', name)).sort(), keyPaths(load('en', name)).sort());
  });
}

// getDictionary spreads a scoped dictionary over common, so a shared
// top-level key would silently replace that whole common section.
for (const name of NAMES.filter((n) => n !== 'common')) {
  test(`${name}: no top-level key shadows common`, () => {
    const common = Object.keys(load('en', 'common'));
    const shared = Object.keys(load('en', name)).filter((key) => common.includes(key));
    assert.deepEqual(shared, []);
  });
}

// Contact is shared by both persona pages, but each asks its own question.
for (const locale of ['en', 'pt'] as const) {
  test(`${locale}: each persona has its own Contact title and subtitle`, () => {
    const audio = load(locale, 'audio').contact as Record<string, string> | undefined;
    const dev = load(locale, 'dev').contact as Record<string, string> | undefined;
    assert.ok(audio?.title && audio.subtitle, 'audio.contact');
    assert.ok(dev?.title && dev.subtitle, 'dev.contact');
    assert.notEqual(audio.title, dev.title);
    assert.notEqual(audio.subtitle, dev.subtitle);
  });
}
