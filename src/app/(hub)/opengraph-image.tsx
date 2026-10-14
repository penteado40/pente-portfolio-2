import { SITE_NAME } from '@/content/seo';
import { ogImage, OG_SIZE } from '@/lib/ogImage';
import en from '@/i18n/en/hub.json';

// Static, built once: link previews and crawlers get English (see routeMetadata).
export const alt = `${SITE_NAME}: ${en.intro.tagline}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

// Neutral, like the Hub: no persona gradient, just the name and the tagline.
export default function Image() {
  return ogImage({ subtitle: en.intro.tagline });
}
