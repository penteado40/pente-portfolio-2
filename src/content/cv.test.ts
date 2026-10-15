import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cvLink } from './cv.ts';

test('the active locale gets its own CV when it exists', () => {
  assert.deepEqual(cvLink('pt', ['pt', 'en']), { href: '/cv/felipe-penteado-pt.pdf', fallback: false });
  assert.deepEqual(cvLink('en', ['pt', 'en']), { href: '/cv/felipe-penteado-en.pdf', fallback: false });
});

test('a locale without its own CV falls back to the PT one', () => {
  assert.deepEqual(cvLink('en', ['pt']), { href: '/cv/felipe-penteado-pt.pdf', fallback: true });
});

test('PT never falls back', () => {
  assert.deepEqual(cvLink('pt', ['pt']), { href: '/cv/felipe-penteado-pt.pdf', fallback: false });
});
