'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useTransform,
  useScroll,
  useReducedMotion,
} from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { ArrowDown } from '@phosphor-icons/react';
import { Container } from './Container';
import { PillButton } from './PillButton';
import { SectionLabel } from './SectionHeader';

// A photo card inside the content column, like the Hub's persona cards: the
// persona's tint over the studio photo, a glass pane at the bottom. The
// Navbar floats over it and expands once the card (`data-hero`, see
// useInHero) is scrolled past. The card starts below the island, and on
// desktop the label row sits lower still, clear of the expanded island. On
// short phones the card shrinks to keep the CTA above the fold.
export function Hero() {
  const { dict } = useLocale<AudioDictionary>();
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  // With reduced motion the entrance keeps its fade but drops the slide.
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="pt-[76px] md:pt-24 pb-2 md:pb-8">
      <Container wide>
        <div
          ref={cardRef}
          data-hero
          className="relative isolate flex flex-col justify-between gap-6 min-h-[min(640px,calc(100svh-92px))] md:min-h-[760px] p-4 md:p-8 rounded-3xl md:rounded-[28px] overflow-hidden bg-background text-white shadow-card"
        >
          {/* On desktop the photo starts 15% in from the left and fades in there:
              narrower, so less zoomed, and the face moves right, clear of the
              text pane. */}
          <motion.div
            className="absolute inset-y-0 left-0 md:left-[15%] right-0 md:mask-l-from-75% -z-10"
            style={reduce ? undefined : { scale: imgScale }}
          >
            <Image
              src="/photos/photo_12.jpg"
              alt={dict.hero.photoAlt}
              fill
              preload
              sizes="(min-width: 1600px) 1310px, 100vw"
              className="object-cover object-[55%_40%] md:object-[50%_40%]"
            />
          </motion.div>
          <div aria-hidden className="absolute inset-0 -z-10 persona-card-tint" />

          <div className="flex items-center justify-between px-1 pt-1 md:px-0 md:pt-[72px]">
            <SectionLabel index={1} label={dict.navbar.personas.audio} tone="ink" />
            <span className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase">
              {dict.hero.city}
              <span className="hidden md:inline"> · {dict.hero.country}</span>
            </span>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="glass flex flex-col gap-3 md:gap-4 max-w-[680px] p-5 md:p-8 rounded-[18px] md:rounded-[22px]"
          >
            <motion.p
              variants={item}
              className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-highlight"
            >
              {dict.hero.role}
            </motion.p>
            <motion.h1
              variants={item}
              className="text-[34px] md:text-6xl leading-[1.04] md:leading-[1.02] font-medium tracking-[-0.04em]"
            >
              {dict.hero.headline}
            </motion.h1>
            <motion.p
              variants={item}
              className="text-[15px] md:text-[17px] leading-[1.55] md:leading-relaxed text-white/80"
            >
              {dict.hero.subtitle}
            </motion.p>
            <motion.div variants={item} className="mt-1 md:mt-2">
              <PillButton href="#projects" Icon={ArrowDown} className="w-full md:w-auto">
                {dict.hero.cta}
              </PillButton>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
