import { test } from 'node:test';
import assert from 'node:assert/strict';
import { personaHref, personaSwitch } from './personas.ts';

const copy = {
  personas: { audio: 'Audio', dev: 'Dev' },
  switchTo: 'Switch to the {persona} persona',
};

test('each persona lives at its own route', () => {
  assert.equal(personaHref('audio'), '/audio');
  assert.equal(personaHref('dev'), '/dev');
});

test('the selector lists every persona in a fixed order, marking the current one', () => {
  assert.deepEqual(personaSwitch('dev', copy).options, [
    {
      id: 'audio',
      label: 'Audio',
      href: '/audio',
      current: false,
      switchLabel: 'Switch to the Audio persona',
    },
    {
      id: 'dev',
      label: 'Dev',
      href: '/dev',
      current: true,
      switchLabel: 'Switch to the Dev persona',
    },
  ]);
});

test('the chip goes to the other persona', () => {
  assert.equal(personaSwitch('audio', copy).destination.href, '/dev');
  assert.equal(personaSwitch('dev', copy).destination.href, '/audio');
});
