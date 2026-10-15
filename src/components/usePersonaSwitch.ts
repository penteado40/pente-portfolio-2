'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import { personaSwitch, type PersonaId, type PersonaOption } from '@/content/personas';

/** The Navbar's `personas` prop, for the persona being rendered. */
export function usePersonaSwitch(current: PersonaId): PersonaOption[] {
  const { dict } = useLocale();
  return personaSwitch(current, dict.navbar.personas);
}
