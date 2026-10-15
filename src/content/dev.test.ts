import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { education, experience, formatPeriod } from './dev.ts';

function devDictionary(locale: 'en' | 'pt') {
  return JSON.parse(readFileSync(new URL(`../i18n/${locale}/dev.json`, import.meta.url), 'utf8'));
}

test('a period reads month/year to month/year', () => {
  assert.equal(formatPeriod({ start: '2023-04', end: '2025-11' }, 'present'), '04/2023 – 11/2025');
});

test('an open period ends with the current label', () => {
  assert.equal(formatPeriod({ start: '2025-12', end: null }, 'atual'), '12/2025 – atual');
});

test('experience lists the CV entries newest first, with the CV dates', () => {
  assert.deepEqual(
    experience.map(({ id, start, end }) => [id, start, end]),
    [
      ['freelance', '2025-12', null],
      ['iatec-mid', '2023-04', '2025-11'],
      ['youpay', '2022-09', '2023-03'],
      ['iatec-trainee', '2021-02', '2022-08'],
      ['unasp', '2019-02', '2019-11'],
    ],
  );
});

test('every experience entry has stack tags', () => {
  for (const job of experience) assert.ok(job.stack.length > 0, job.id);
});

// ADR 0004: the dictionary type comes from the EN file only, so nothing
// else catches an id in dev.ts without its text.
for (const locale of ['en', 'pt'] as const) {
  test(`${locale}: every experience and education id has its text`, () => {
    const dict = devDictionary(locale);
    for (const { id } of experience) {
      const text = dict.experience.items[id];
      assert.ok(text?.role && text.context && text.bullets?.length, `experience.items.${id}`);
    }
    for (const { id } of education) {
      const text = dict.experience.education.items[id];
      assert.ok(text?.course, `experience.education.items.${id}`);
    }
  });
}
