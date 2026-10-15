// The Personas, in the order the Hub and the Navbar's selector show them.
// Each lives at its own route (see docs/adr/0002).
export const PERSONAS = ['audio', 'dev'] as const;

export type PersonaId = (typeof PERSONAS)[number];

export type PersonaHref = `/${PersonaId}`;

export function personaHref(id: PersonaId): PersonaHref {
  return `/${id}`;
}

export type PersonaOption = {
  id: PersonaId;
  label: string;
  href: PersonaHref;
  current: boolean;
};

/**
 * The Navbar's segmented selector: every persona, with the current one marked.
 * `names` are the persona names from `common.json`'s `navbar.personas`.
 */
export function personaSwitch(
  current: PersonaId,
  names: Record<PersonaId, string>,
): PersonaOption[] {
  return PERSONAS.map((id) => ({
    id,
    label: names[id],
    href: personaHref(id),
    current: id === current,
  }));
}
