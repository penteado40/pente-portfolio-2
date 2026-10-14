// The Personas, in the order the Hub and the Navbar's selector show them.
// Each lives at its own route (see docs/adr/0002).
export const PERSONAS = ['audio', 'dev'] as const;

export type PersonaId = (typeof PERSONAS)[number];

export function personaHref(id: PersonaId): `/${PersonaId}` {
  return `/${id}`;
}

/** The persona names and the chip's accessible name, from `common.json`'s `navbar`. */
export type PersonaSwitchCopy = {
  personas: Record<PersonaId, string>;
  /** Contains `{persona}`, replaced by the destination's name. */
  switchTo: string;
};

export type PersonaOption = {
  id: PersonaId;
  label: string;
  href: `/${PersonaId}`;
  current: boolean;
  /** Accessible name of the compact "go to" chip that leads here. */
  switchLabel: string;
};

/**
 * What a persona's Navbar offers for switching: every persona for the
 * segmented selector, and the one the compact "go to" chip points at.
 */
export function personaSwitch(current: PersonaId, copy: PersonaSwitchCopy) {
  const options: PersonaOption[] = PERSONAS.map((id) => ({
    id,
    label: copy.personas[id],
    href: personaHref(id),
    current: id === current,
    switchLabel: copy.switchTo.replace('{persona}', copy.personas[id]),
  }));
  // With two personas, "the other one" is the only destination.
  const destination = options.find((option) => !option.current)!;
  return { options, destination };
}
