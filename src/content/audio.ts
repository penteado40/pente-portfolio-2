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

/** Keys the Gear's categories in audio.json, in order: each card's icon. */
export const gearCategories = ['consoles', 'studio', 'services'] as const;

export type GearCategoryId = (typeof gearCategories)[number];
