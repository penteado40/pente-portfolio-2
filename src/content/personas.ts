// The Personas, in the order the Navbar's selector shows them. Each lives at
// its own route (see docs/adr/0002).
export const PERSONAS = ['audio', 'dev'] as const;

export type PersonaId = (typeof PERSONAS)[number];

export type PersonaOption = {
  id: PersonaId;
  label: string;
  href: `/${PersonaId}`;
  current: boolean;
};

/**
 * What a persona's Navbar offers for switching: every persona for the
 * segmented selector, and the one the compact "go to" chip points at.
 */
export function personaSwitch(current: PersonaId, labels: Record<PersonaId, string>) {
  const options: PersonaOption[] = PERSONAS.map((id) => ({
    id,
    label: labels[id],
    href: `/${id}`,
    current: id === current,
  }));
  // With two personas, "the other one" is the only destination.
  const destination = options.find((option) => !option.current)!;
  return { options, destination };
}
