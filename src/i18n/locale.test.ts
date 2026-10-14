import { test } from 'node:test';
import assert from 'node:assert/strict';
import { otherLocale, resolveLocale } from './locale.ts';

test('a valid cookie wins over Accept-Language', () => {
  assert.equal(resolveLocale('en', 'pt-BR,pt;q=0.9'), 'en');
  assert.equal(resolveLocale('pt', 'en-US,en;q=0.9'), 'pt');
});

test('without a cookie, any pt* language in Accept-Language gives pt', () => {
  assert.equal(resolveLocale(undefined, 'pt-PT'), 'pt');
  assert.equal(resolveLocale(undefined, 'pt'), 'pt');
  assert.equal(resolveLocale(undefined, 'en-US,en;q=0.9,pt-BR;q=0.8'), 'pt');
  assert.equal(resolveLocale(undefined, 'PT-br'), 'pt');
});

test('without a cookie, other languages give en', () => {
  assert.equal(resolveLocale(undefined, 'en-US,en;q=0.9'), 'en');
  assert.equal(resolveLocale(undefined, 'es-ES, fr;q=0.5'), 'en');
  assert.equal(resolveLocale(undefined, '*'), 'en');
});

test('a missing Accept-Language header gives en', () => {
  assert.equal(resolveLocale(undefined, null), 'en');
  assert.equal(resolveLocale(undefined, ''), 'en');
});

test('pt only matches as a language tag, not as a prefix of another one', () => {
  assert.equal(resolveLocale(undefined, 'ptx'), 'en');
});

test('pt with q=0 is a refusal, not a preference', () => {
  assert.equal(resolveLocale(undefined, 'en, pt;q=0'), 'en');
});

test('an unknown cookie value falls back to detection', () => {
  assert.equal(resolveLocale('fr', 'pt-BR'), 'pt');
  assert.equal(resolveLocale('', null), 'en');
});

test('the language switcher always offers the other locale', () => {
  assert.equal(otherLocale('en'), 'pt');
  assert.equal(otherLocale('pt'), 'en');
});
