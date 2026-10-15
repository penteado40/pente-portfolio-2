import type { Icon } from '@phosphor-icons/react';
// The SSR build, so the Hub's server components can render these.
import { Code, Waveform } from '@phosphor-icons/react/dist/ssr';
import type { PersonaId } from '@/content/personas';

/** Each persona's icon, on its Hub card. */
export const PERSONA_ICONS: Record<PersonaId, Icon> = { audio: Waveform, dev: Code };
