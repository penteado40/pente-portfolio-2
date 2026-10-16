import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gearCategories, sectionIndex } from './audio.ts';

type GearCategory = { id: string; name: string; items: string[] };

function loadAudio(locale: 'en' | 'pt'): { skills: { categories: GearCategory[] } } {
  return JSON.parse(readFileSync(new URL(`../i18n/${locale}/audio.json`, import.meta.url), 'utf8'));
}

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

test('the Gear is 06, after the Productions', () => {
  assert.equal(sectionIndex('skills'), 6);
});

for (const locale of ['en', 'pt'] as const) {
  test(`${locale}: the Gear has the three categories in order`, () => {
    const { skills } = loadAudio(locale);
    assert.deepEqual(
      skills.categories.map(({ id }) => id),
      gearCategories,
    );
  });
}

test('equipment names are the same in both languages; only Services translate', () => {
  const [en, pt] = (['en', 'pt'] as const).map((locale) => loadAudio(locale).skills.categories);
  for (const id of ['consoles', 'studio']) {
    assert.deepEqual(
      pt.find((c) => c.id === id)?.items,
      en.find((c) => c.id === id)?.items,
      id,
    );
  }
});
