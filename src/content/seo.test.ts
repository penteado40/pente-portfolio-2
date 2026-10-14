import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeMetadata, ROUTES, SITE_URL, siteTitle } from './seo.ts';

const meta = { title: 'Systems Developer', description: 'Back-end that nobody notices.' };

test('the full title puts the name before the role', () => {
  assert.equal(siteTitle('Systems Developer'), 'Felipe Penteado · Systems Developer');
});

test('a route gets its title, description and a canonical pointing at itself', () => {
  const metadata = routeMetadata('/dev', meta, 'en');
  assert.equal(metadata.title, 'Systems Developer');
  assert.equal(metadata.description, 'Back-end that nobody notices.');
  assert.deepEqual(metadata.alternates, { canonical: '/dev' });
});

// Metadata merges shallowly, so a layout's openGraph replaces its parent's
// whole object: each route has to carry every field itself.
test('openGraph is complete, with the full title and the request locale', () => {
  assert.deepEqual(routeMetadata('/dev', meta, 'pt').openGraph, {
    type: 'website',
    siteName: 'Felipe Penteado',
    url: '/dev',
    locale: 'pt_BR',
    title: 'Felipe Penteado · Systems Developer',
    description: 'Back-end that nobody notices.',
  });
  assert.equal(routeMetadata('/', meta, 'en').openGraph?.locale, 'en_US');
});

test('the site lists the Hub and every persona, on the production domain', () => {
  assert.deepEqual(ROUTES, ['/', '/audio', '/dev']);
  assert.equal(SITE_URL, 'https://felipepenteado.com.br');
});
