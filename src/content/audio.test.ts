import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gearCategories, sectionIndex } from './audio.ts';
import { readDictionary } from '../i18n/readDictionary.ts';

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

// The dictionary type comes from the EN file only, so nothing else catches
// a category in audio.ts without its text in pt.
for (const locale of ['en', 'pt'] as const) {
  test(`${locale}: every Gear category has its name and items`, () => {
    const { categories } = readDictionary(locale, 'audio').skills;
    for (const id of gearCategories) {
      assert.ok(categories[id]?.name && categories[id].items?.length, `skills.categories.${id}`);
    }
  });
}

test('equipment names are the same in both languages; only Services translate', () => {
  const [en, pt] = (['en', 'pt'] as const).map((locale) => readDictionary(locale, 'audio').skills.categories);
  for (const id of ['consoles', 'studio']) assert.deepEqual(pt[id].items, en[id].items, id);
});
