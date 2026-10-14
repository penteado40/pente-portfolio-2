'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { certifications } from '@/content/dev';
import { Navbar, type NavItem } from './Navbar';
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

  const items: NavItem[] = [
    { label: dict.nav.about, href: '#about', Icon: User },
    { label: dict.nav.experience, href: '#experience', Icon: Briefcase },
    ...(certifications.length > 0
      ? [{ label: dict.nav.certifications, href: '#certifications', Icon: Certificate }]
      : []),
    { label: dict.nav.skills, href: '#skills', Icon: Wrench },
    { label: dict.nav.projects, href: '#projects', Icon: Code },
    { label: dict.nav.contact, href: '#contact', Icon: Envelope },
  ];

  return <Navbar items={items} />;
}
