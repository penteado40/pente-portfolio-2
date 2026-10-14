import type { Metadata } from 'next';
import type { Locale } from '../i18n/locale';
import { PERSONAS, personaHref } from './personas.ts';

export const SITE_URL = 'https://felipepenteado.com.br';

export const SITE_NAME = 'Felipe Penteado';

/** Every indexable route: the Hub, then the Personas. */
export const ROUTES = ['/', ...PERSONAS.map(personaHref)] as const;

export type Route = (typeof ROUTES)[number];

/** A route's `meta` section in its dictionary (`hub.json`, `audio.json`, `dev.json`). */
export type RouteMeta = { title: string; description: string };

const OG_LOCALES: Record<Locale, string> = { en: 'en_US', pt: 'pt_BR' };

/** Matches the root layout's `title.template`. */
export function siteTitle(role: string): string {
  return `${SITE_NAME} · ${role}`;
}

/**
 * A route's metadata in the request's locale. The `og:image` comes from the
 * route's `opengraph-image`, and Twitter inherits title, description and
 * image from openGraph.
 */
export function routeMetadata(path: Route, meta: RouteMeta, locale: Locale): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: path,
      locale: OG_LOCALES[locale],
      title: siteTitle(meta.title),
      description: meta.description,
    },
  };
}
