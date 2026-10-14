import type { MetadataRoute } from 'next';
import { ROUTES, SITE_URL } from '@/content/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({ url: new URL(route, SITE_URL).href }));
}
