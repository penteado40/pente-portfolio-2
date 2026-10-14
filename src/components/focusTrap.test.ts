import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrapFocus } from './focusTrap.ts';

const items = ['about', 'timeline', 'contact'];

test('Tab on the last item wraps to the first', () => {
  assert.equal(wrapFocus(items, 'contact', false), 'about');
});

test('Shift+Tab on the first item wraps to the last', () => {
  assert.equal(wrapFocus(items, 'about', true), 'contact');
});

test('inside the list, Tab is left to the browser', () => {
  assert.equal(wrapFocus(items, 'about', false), null);
  assert.equal(wrapFocus(items, 'timeline', true), null);
});

test('focus outside the list is brought back in', () => {
  assert.equal(wrapFocus(items, 'elsewhere', false), 'about');
  assert.equal(wrapFocus(items, null, true), 'contact');
});

test('an empty list has nothing to focus', () => {
  assert.equal(wrapFocus([], 'about', false), null);
});
