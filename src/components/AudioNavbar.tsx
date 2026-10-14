'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import { useTestimonialModal } from './TestimonialModalProvider';
import { Navbar } from './Navbar';
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
  const { dict } = useLocale();
  const { open: openTestimonialModal } = useTestimonialModal();

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
        { label: dict.testimonials.cta, Icon: ChatCircleText, onClick: openTestimonialModal },
      ]}
    />
  );
}
