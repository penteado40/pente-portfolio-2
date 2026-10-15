'use client';

import Image from 'next/image';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { ArrowDown } from '@phosphor-icons/react';
import { HeroCard } from './HeroCard';
import { PillButton } from './PillButton';

export function Hero() {
  const { dict } = useLocale<AudioDictionary>();

  return (
    <HeroCard
      index={1}
      label={dict.navbar.personas.audio}
      meta={
        <>
          {dict.hero.city}
          <span className="hidden md:inline"> · {dict.hero.country}</span>
        </>
      }
      // On desktop the photo starts 15% in from the left and fades in there:
      // narrower, so less zoomed, and the face moves right, clear of the
      // text pane.
      backdropClassName="inset-y-0 left-0 md:left-[15%] right-0 md:mask-l-from-75%"
      backdrop={
        <Image
          src="/photos/photo_12.jpg"
          alt={dict.hero.photoAlt}
          fill
          preload
          sizes="(min-width: 1600px) 1310px, 100vw"
          className="object-cover object-[55%_40%] md:object-[50%_40%]"
        />
      }
      eyebrow={dict.hero.role}
      headline={dict.hero.headline}
      subtitle={dict.hero.subtitle}
      actions={
        <PillButton href="#projects" Icon={ArrowDown} className="w-full md:w-auto">
          {dict.hero.cta}
        </PillButton>
      }
    />
  );
}
