'use client';

import type { Icon } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { personaSwitch, type PersonaId, type PersonaOption } from '@/content/personas';
import { PERSONA_ICONS } from './personaIcons';

export type PersonaLink = PersonaOption & { Icon: Icon };

export type PersonaSwitch = { options: PersonaLink[]; destination: PersonaLink };

/** The Navbar's `personas` prop, for the persona being rendered. */
export function usePersonaSwitch(current: PersonaId): PersonaSwitch {
  const { dict } = useLocale();
  const { options, destination } = personaSwitch(current, dict.navbar);
  const withIcon = (option: PersonaOption): PersonaLink => ({
    ...option,
    Icon: PERSONA_ICONS[option.id],
  });
  return { options: options.map(withIcon), destination: withIcon(destination) };
}
