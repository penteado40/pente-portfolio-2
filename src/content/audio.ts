/*
 * Structured data of the Audio persona. Translatable text lives in
 * `src/i18n/{en,pt}/audio.json` (see docs/adr/0004).
 */

/** Section ids (and anchors) of the page, in order; see `sectionIndex`. */
const audioSections = [
  'hero',
  'about',
  'timeline',
  'certifications',
  'projects',
  'skills',
  'testimonials',
  'photos',
  'contact',
] as const;

export type AudioSection = (typeof audioSections)[number];

/** "03 / Journey": a section's position on the page, from 1, the Hero's 01. */
export function sectionIndex(id: AudioSection) {
  return audioSections.indexOf(id) + 1;
}

/**
 * The `id`s of the Gear's categories in audio.json, in order (the test holds
 * both languages to it); the Gear picks each card's icon by id.
 */
export const gearCategories = ['consoles', 'studio', 'services'] as const;

export type GearCategoryId = (typeof gearCategories)[number];
