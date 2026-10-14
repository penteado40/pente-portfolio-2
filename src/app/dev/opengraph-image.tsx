import { siteTitle } from '@/content/seo';
import { ogImage, OG_SIZE } from '@/lib/ogImage';
import en from '@/i18n/en/dev.json';

// Static, built once: link previews and crawlers get English (see routeMetadata).
export const alt = siteTitle(en.meta.title);
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage({ persona: 'dev', subtitle: en.meta.title });
}
