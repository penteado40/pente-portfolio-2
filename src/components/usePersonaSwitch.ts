'use client';

import { Code, Waveform, type Icon } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { personaSwitch, type PersonaId, type PersonaOption } from '@/content/personas';

// The same icons as the Hub's persona cards.
const ICONS: Record<PersonaId, Icon> = { audio: Waveform, dev: Code };

export type PersonaLink = PersonaOption & {
  Icon: Icon;
  /** Accessible name of the compact "go to" chip that leads here. */
  switchLabel: string;
};

export type PersonaSwitch = { options: PersonaLink[]; destination: PersonaLink };

/** The Navbar's `personas` prop, for the persona being rendered. */
export function usePersonaSwitch(current: PersonaId): PersonaSwitch {
  const { dict } = useLocale();
  const { options, destination } = personaSwitch(current, dict.navbar.personas);
  const withIcon = (option: PersonaOption): PersonaLink => ({
    ...option,
    Icon: ICONS[option.id],
    switchLabel: dict.navbar.switchTo[option.id],
  });
  return { options: options.map(withIcon), destination: withIcon(destination) };
}
