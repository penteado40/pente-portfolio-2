'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { useTestimonialModal } from './TestimonialModalProvider';
import { Navbar } from './Navbar';
import { usePersonaSwitch } from './usePersonaSwitch';
import {
  User,
  MusicNotes,
  Clock,
  Certificate,
  GearSix,
  Envelope,
  ChatCircleText,
} from '@phosphor-icons/react';

export function AudioNavbar() {
  const { dict } = useLocale<AudioDictionary>();
  const { open: openTestimonialModal } = useTestimonialModal();
  const personas = usePersonaSwitch('audio');

  return (
    <Navbar
      items={[
        { label: dict.nav.about, href: '#about', Icon: User },
        { label: dict.nav.timeline, href: '#timeline', Icon: Clock },
        { label: dict.nav.certifications, href: '#certifications', Icon: Certificate },
        { label: dict.nav.projects, href: '#projects', Icon: MusicNotes },
        { label: dict.nav.skills, href: '#skills', Icon: GearSix },
        { label: dict.nav.contact, href: '#contact', Icon: Envelope },
      ]}
      actions={[
        { label: dict.nav.testimonial, Icon: ChatCircleText, onClick: openTestimonialModal },
      ]}
      personas={personas}
    />
  );
}
