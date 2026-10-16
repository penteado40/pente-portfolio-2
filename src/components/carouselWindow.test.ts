import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carouselWindow } from './carouselWindow.ts';

test('three per view: the first window counts 01–03 and only goes forward', () => {
  const w = carouselWindow(0, 3, 11);
  assert.equal(w.label, '01–03 / 11');
  assert.equal(w.range, '01–03');
  assert.equal(w.prev, null);
  assert.equal(w.next, 3);
  assert.equal(w.pages, 4);
  assert.equal(w.page, 0);
});

test('a middle window steps a whole view each way', () => {
  const w = carouselWindow(3, 3, 11);
  assert.equal(w.label, '04–06 / 11');
  assert.equal(w.prev, 0);
  assert.equal(w.next, 6);
  assert.equal(w.page, 1);
});

test('the last step stops at the end instead of leaving a gap', () => {
  assert.equal(carouselWindow(6, 3, 11).next, 8);
});

test('the last window shows the last cards, lights the last dot and has no next', () => {
  const w = carouselWindow(8, 3, 11);
  assert.equal(w.label, '09–11 / 11');
  assert.equal(w.next, null);
  // Back onto the dots' windows, not three cards before the flush end.
  assert.equal(w.prev, 6);
  assert.equal(w.page, 3);
});

test('one per view: a single number, one dot per card', () => {
  const w = carouselWindow(4, 1, 11);
  assert.equal(w.label, '05 / 11');
  assert.equal(w.pages, 11);
  assert.equal(w.page, 4);
  assert.equal(w.prev, 3);
  assert.equal(w.next, 5);
});

test('a window off the dots (a swipe) steps onto them', () => {
  const w = carouselWindow(4, 3, 11);
  assert.equal(w.prev, 3);
  assert.equal(w.next, 6);
});

test('a first card out of range is clamped', () => {
  assert.equal(carouselWindow(20, 3, 11).label, '09–11 / 11');
  assert.equal(carouselWindow(-2, 3, 11).label, '01–03 / 11');
});

test('fewer cards than a view: one window, no arrows', () => {
  const w = carouselWindow(0, 3, 2);
  assert.equal(w.label, '01–02 / 02');
  assert.equal(w.pages, 1);
  assert.equal(w.prev, null);
  assert.equal(w.next, null);
});

test('pageStart puts each dot on its window, the last one flush with the end', () => {
  const w = carouselWindow(0, 3, 11);
  assert.deepEqual([0, 1, 2, 3].map(w.pageStart), [0, 3, 6, 8]);
  assert.deepEqual([0, 1, 2, 3].map(w.pageRange), ['01–03', '04–06', '07–09', '09–11']);
});
