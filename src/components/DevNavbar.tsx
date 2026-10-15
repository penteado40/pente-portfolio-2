'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { certifications, devSections, type DevSection } from '@/content/dev';
import { Navbar } from './Navbar';
import { usePersonaSwitch } from './usePersonaSwitch';
import {
  User,
  Briefcase,
  Certificate,
  Wrench,
  Code,
  Envelope,
  type Icon,
} from '@phosphor-icons/react';

const icons: Record<DevSection, Icon> = {
  about: User,
  experience: Briefcase,
  certifications: Certificate,
  projects: Code,
  skills: Wrench,
  contact: Envelope,
};

export function DevNavbar() {
  const { dict } = useLocale<DevDictionary>();
  const personas = usePersonaSwitch('dev');

  // Certifications is not on the LP board's list; it shows up only once
  // there is one (see devSections).
  const items = devSections(certifications).map((id) => ({
    label: dict.nav[id],
    href: `#${id}`,
    Icon: icons[id],
  }));

  return <Navbar items={items} personas={personas} />;
}
