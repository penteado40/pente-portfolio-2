import { test } from 'node:test';
import assert from 'node:assert/strict';
import { personaHref, personaSwitch } from './personas.ts';

const names = { audio: 'Audio', dev: 'Dev' };

test('each persona lives at its own route', () => {
  assert.equal(personaHref('audio'), '/audio');
  assert.equal(personaHref('dev'), '/dev');
});

test('the selector lists every persona in a fixed order, marking the current one', () => {
  assert.deepEqual(personaSwitch('dev', names), [
    { id: 'audio', label: 'Audio', href: '/audio', current: false },
    { id: 'dev', label: 'Dev', href: '/dev', current: true },
  ]);
});
