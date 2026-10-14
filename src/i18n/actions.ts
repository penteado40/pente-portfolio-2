'use server';

import { cookies } from 'next/headers';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, isLocale } from './locale';

/**
 * Stores the visitor's choice; setting a cookie here re-renders the route in
 * the same roundtrip. Anything that isn't a `Locale` is ignored, since a
 * Server Action can be called with arbitrary input.
 */
export async function setLocaleCookie(locale: unknown) {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });
}
