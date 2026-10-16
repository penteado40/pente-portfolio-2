import type { LinkId } from './links';

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
 * The Gear's categories in page order, keying `skills.categories` in
 * audio.json (the name and items) and each card's icon.
 */
export const gearCategories = ['consoles', 'studio', 'services'] as const;

export type GearCategoryId = (typeof gearCategories)[number];

/** The Instagram tab's posts, embedded in this order. */
export const instagramPosts = [
  'https://www.instagram.com/p/DZJC0njx_kQ/',
  'https://www.instagram.com/p/DXecvK-Alxw/',
  'https://www.instagram.com/p/DSco_6sjtyV/',
  'https://www.instagram.com/p/DOT6zzlEaB3/',
  'https://www.instagram.com/p/DBr1f1vxw7g/',
  'https://www.instagram.com/p/DZ-2kO4i3R2/',
];

/**
 * How a photo sits in the mosaic: `tall` two rows high (a portrait), `wide`
 * two columns across (a landscape), `single` one cell.
 */
export type PhotoShape = 'single' | 'tall' | 'wide';

/**
 * The Photos tab's mosaic in order, packed densely across four columns on
 * desktop and two on a phone. The order and shapes fill every row at both
 * widths; audio.test.ts checks it, so a photo added or moved needs a run.
 */
export const galleryPhotos: { src: string; shape: PhotoShape }[] = [
  { src: '/photos/photo_1.jpg', shape: 'tall' },
  { src: '/photos/photo_8.jpg', shape: 'wide' },
  { src: '/photos/photo_3.jpg', shape: 'tall' },
  { src: '/photos/photo_5.jpg', shape: 'tall' },
  { src: '/photos/photo_11.jpg', shape: 'single' },
  { src: '/photos/photo_4.jpg', shape: 'tall' },
  { src: '/photos/photo_22.jpg', shape: 'tall' },
  { src: '/photos/photo_14.jpg', shape: 'single' },
  { src: '/photos/photo_16.jpg', shape: 'wide' },
  { src: '/photos/photo_10.jpg', shape: 'tall' },
  { src: '/photos/photo_18.jpg', shape: 'single' },
  { src: '/photos/photo_6.jpg', shape: 'tall' },
  { src: '/photos/photo_12.jpg', shape: 'tall' },
  { src: '/photos/photo_19.jpg', shape: 'wide' },
  { src: '/photos/photo_23.jpg', shape: 'tall' },
  { src: '/photos/photo_7.jpg', shape: 'tall' },
  { src: '/photos/photo_24.jpg', shape: 'tall' },
  { src: '/photos/photo_25.jpg', shape: 'single' },
  { src: '/photos/photo_2.jpg', shape: 'tall' },
  { src: '/photos/photo_9.jpg', shape: 'tall' },
  { src: '/photos/photo_26.jpg', shape: 'single' },
  { src: '/photos/photo_13.jpg', shape: 'tall' },
  { src: '/photos/photo_15.jpg', shape: 'tall' },
  { src: '/photos/photo_27.jpg', shape: 'single' },
  { src: '/photos/photo_20.jpg', shape: 'tall' },
  { src: '/photos/photo_21.jpg', shape: 'tall' },
  { src: '/photos/photo_17.jpg', shape: 'wide' },
];

/** The direct channels beside the Contact form, in order. */
export const contactLinks: readonly LinkId[] = ['email', 'instagram'];

/** The Footer's Chips after "Back to the Hub", in order. */
export const footerLinks: readonly LinkId[] = ['linkedin', 'instagram'];
