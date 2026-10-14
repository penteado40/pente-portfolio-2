'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { certifications } from '@/content/dev';
import { Navbar, type NavItem } from './Navbar';
import { usePersonaSwitch } from './usePersonaSwitch';
import {
  User,
  Briefcase,
  Certificate,
  Wrench,
  Code,
  Envelope,
} from '@phosphor-icons/react';

export function DevNavbar() {
  const { dict } = useLocale<DevDictionary>();
  const personas = usePersonaSwitch('dev');

  const items: NavItem[] = [
    { label: dict.nav.about, href: '#about', Icon: User },
    { label: dict.nav.experience, href: '#experience', Icon: Briefcase },
    // Not on the LP board's list; shows up only once there is a certification.
    ...(certifications.length > 0
      ? [{ label: dict.nav.certifications, href: '#certifications', Icon: Certificate }]
      : []),
    { label: dict.nav.projects, href: '#projects', Icon: Code },
    { label: dict.nav.skills, href: '#skills', Icon: Wrench },
    { label: dict.nav.contact, href: '#contact', Icon: Envelope },
  ];

  return <Navbar items={items} personas={personas} />;
}
