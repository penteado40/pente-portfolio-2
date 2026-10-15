'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { cvLink } from '@/content/cv';
import { cvLocales } from '@/content/dev';
import { ArrowDown, DownloadSimple } from '@phosphor-icons/react';
import { HeroCard } from './HeroCard';
import { PillButton } from './PillButton';
import { useMagnetic } from './useMagnetic';

// Set in next.config.ts: empty until the Dev hero photo is added to public/.
const photo = process.env.DEV_HERO_PHOTO;

const GLOW_DURATION = 1;

// The Audio Hero's card, with a request window beside the glass pane on
// desktop. Until the photo lands, the persona glow stands in for it, from
// the right on desktop and bleeding off the top right on mobile.
export function DevHero() {
  const { locale, dict } = useLocale<DevDictionary>();
  const reduce = useReducedMotion();
  const cvMagnet = useMagnetic<HTMLAnchorElement>();
  const cv = cvLink(locale, cvLocales);

  return (
    <HeroCard
      index={2}
      label={dict.navbar.personas.dev}
      meta={
        <>
          {dict.hero.location}
          <span className="hidden md:inline"> · {dict.hero.hiring}</span>
        </>
      }
      backdropClassName="inset-0"
      backdrop={
        photo ? (
          <Image
            src={photo}
            alt=""
            fill
            preload
            sizes="(min-width: 1600px) 1536px, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute -top-[20%] -right-[45%] w-[130%] md:top-1/2 md:right-0 md:-translate-y-1/2 md:translate-x-[15%] md:w-[min(70%,1000px)] aspect-square"
          >
            {/* The glow lands first; the pane follows once it is mostly in. */}
            <motion.div
              initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: GLOW_DURATION, ease: [0.23, 1, 0.32, 1] }}
              className="size-full rounded-full"
              style={{ backgroundImage: 'var(--persona-glow)' }}
            />
          </div>
        )
      }
      delay={photo ? 0 : GLOW_DURATION * 0.4}
      role={dict.hero.role}
      headline={dict.hero.headline}
      subtitle={dict.hero.subtitle}
      actions={
        <div className="flex flex-col md:flex-row md:flex-wrap gap-2.5">
          <PillButton href="#projects" Icon={ArrowDown} className="w-full md:w-auto">
            {dict.hero.ctaProjects}
          </PillButton>
          <motion.a
            {...cvMagnet}
            href={cv.href}
            download
            className="inline-flex items-center justify-center gap-2 h-[52px] px-[22px] rounded-full border border-white/20 text-white text-[15px] font-medium hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press"
          >
            {cv.fallback ? dict.hero.ctaCvFallback : dict.hero.ctaCv}
            <DownloadSimple size={16} weight="bold" aria-hidden />
          </motion.a>
        </div>
      }
      aside={<RequestWindow />}
    />
  );
}

// Decorative: a request to the events API the Projects section shows,
// left untranslated like the code it stands for.
function RequestWindow() {
  return (
    <div
      aria-hidden
      className="glass-dark w-[340px] px-5 py-[18px] rounded-[18px] font-mono text-[13px] leading-[1.75] text-white/75"
    >
      <div className="flex gap-1.5 mb-3">
        <span className="size-[9px] rounded-full bg-white/25" />
        <span className="size-[9px] rounded-full bg-white/25" />
        <span className="size-[9px] rounded-full bg-white/25" />
      </div>
      <div>
        <span className="text-highlight">POST</span> /events/:id/rsvp
      </div>
      <div className="text-white/50">{'{ "guests": 2, "attending": true }'}</div>
      <div className="mt-2">
        <span className="text-highlight">201</span> Created · 48ms
      </div>
    </div>
  );
}
