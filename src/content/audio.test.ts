import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sectionIndex } from './audio.ts';

test('the Hero is 01, so About is 02 and the Journey 03', () => {
  assert.equal(sectionIndex('hero'), 1);
  assert.equal(sectionIndex('about'), 2);
  assert.equal(sectionIndex('timeline'), 3);
});

test('the labelled sections follow the page order down to Contact', () => {
  assert.equal(sectionIndex('certifications'), 4);
  assert.equal(sectionIndex('projects'), 5);
  assert.equal(sectionIndex('contact'), 9);
});
