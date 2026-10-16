import { test } from 'node:test';
import assert from 'node:assert/strict';
import { galleryPhotos, gearCategories, sectionIndex, type PhotoShape } from './audio.ts';
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

test('the Testimonials are 07 and the Photos 08', () => {
  assert.equal(sectionIndex('testimonials'), 7);
  assert.equal(sectionIndex('photos'), 8);
});

// CSS grid's dense auto-placement: each photo takes the first cell, row by
// row, where its span fits, going back to fill holes left behind.
function packMosaic(shapes: PhotoShape[], cols: number) {
  const span = { single: [1, 1], tall: [1, 2], wide: [2, 1] } as const;
  const taken: boolean[][] = [];
  const free = (r: number, c: number) => !taken[r]?.[c];
  for (const shape of shapes) {
    const [w, h] = span[shape];
    const width = Math.min(w, cols);
    for (let cell = 0; ; cell++) {
      const r = Math.floor(cell / cols);
      const c = cell % cols;
      if (c + width > cols) continue;
      const cells = Array.from({ length: h }, (_, dr) =>
        Array.from({ length: width }, (_, dc) => [r + dr, c + dc] as const),
      ).flat();
      if (!cells.every(([rr, cc]) => free(rr, cc))) continue;
      for (const [rr, cc] of cells) (taken[rr] ??= [])[cc] = true;
      break;
    }
  }
  return taken;
}

for (const cols of [4, 2]) {
  test(`the photo mosaic leaves no hole across ${cols} columns`, () => {
    const rows = packMosaic(galleryPhotos.map((p) => p.shape), cols);
    rows.forEach((row, r) => {
      for (let c = 0; c < cols; c++) assert.ok(row[c], `row ${r + 1}, column ${c + 1} is empty`);
    });
  });
}

test('every photo of the mosaic is in the gallery once', () => {
  const srcs = galleryPhotos.map((p) => p.src);
  assert.equal(new Set(srcs).size, srcs.length);
});

for (const locale of ['en', 'pt'] as const) {
  test(`${locale}: the Testimonials and the Photos have their section labels`, () => {
    const dict = readDictionary(locale, 'audio');
    assert.ok(dict.testimonials.label && dict.testimonials.ctaFull, 'testimonials');
    assert.ok(dict.photos.label && dict.photos.tabsLabel, 'photos');
  });
}

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
