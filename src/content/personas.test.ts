import { test } from 'node:test';
import assert from 'node:assert/strict';
import { personaSwitch } from './personas.ts';

const labels = { audio: 'Audio', dev: 'Dev' };

test('the selector lists every persona in a fixed order, marking the current one', () => {
  assert.deepEqual(personaSwitch('dev', labels).options, [
    { id: 'audio', label: 'Audio', href: '/audio', current: false },
    { id: 'dev', label: 'Dev', href: '/dev', current: true },
  ]);
});

test('the chip goes to the other persona', () => {
  assert.equal(personaSwitch('audio', labels).destination.href, '/dev');
  assert.equal(personaSwitch('dev', labels).destination.href, '/audio');
});
