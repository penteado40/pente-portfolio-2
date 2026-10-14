'use client';

import { useRef } from 'react';
import {
  motion,
  useTransform,
  useScroll,
  useReducedMotion,
} from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { cvLink } from '@/content/cv';
import { cvLocales } from '@/content/dev';
import { ArrowDown, DownloadSimple } from '@phosphor-icons/react';
import { useMagnetic } from './useMagnetic';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const GLOW_EASE_OUT = [0.23, 1, 0.32, 1] as const;
const GLOW_DURATION = 1;

// Split hero: text on the left, anchored to the bottom like the Audio Hero.
// The right column holds only the glow for now; the portrait will sit on top
// of it without changing the layout. On mobile the glow moves to the top
// right and bleeds off the edge.
export function DevHero() {
  const { locale, dict } = useLocale<DevDictionary>();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const projectsMagnet = useMagnetic<HTMLAnchorElement>();
  const cvMagnet = useMagnetic<HTMLAnchorElement>();
  const cv = cvLink(locale, cvLocales);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  // The glow lands first; the text follows in sequence once it is mostly in.
  const container = {
    hidden: {},
    show: {
      transition: { delayChildren: reduce ? 0 : GLOW_DURATION * 0.4, staggerChildren: 0.15 },
    },
  };

  // With reduced motion the entrance keeps its fade but drops the slide.
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE_OUT },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-end overflow-hidden"
    >
      {/* Scroll fade and growth on the outer layer, entrance on the inner one,
          so the two scales don't fight over the same transform. */}
      <motion.div
        aria-hidden
        style={{ opacity: contentOpacity, scale: reduce ? 1 : glowScale }}
        className="absolute -top-[20vw] -right-[35vw] size-[110vw] md:top-1/2 md:right-0 md:-translate-y-1/2 md:translate-x-[15%] md:size-[min(70vw,110dvh)] pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: GLOW_DURATION, ease: GLOW_EASE_OUT }}
          className="size-full rounded-full"
          style={{ backgroundImage: 'var(--persona-glow)' }}
        />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative w-full max-w-[1400px] mx-auto px-6 pb-16 md:pb-24 pt-24"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl md:max-w-[55%] space-y-5"
        >
          <motion.p
            variants={item}
            className="text-sm font-mono text-highlight tracking-wider"
          >
            {dict.hero.role}
          </motion.p>
          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[1.1] text-white"
          >
            {dict.hero.headline}
          </motion.h1>
          <motion.p
            variants={item}
            className="text-white/70 text-lg leading-relaxed max-w-[50ch]"
          >
            {dict.hero.subtitle}
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-3">
            <motion.a
              {...projectsMagnet}
              href="#projects"
              className="inline-flex items-center gap-2 bg-highlight text-background px-6 py-3 rounded-full text-sm font-medium hover:ring-2 hover:ring-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink press"
            >
              {dict.hero.ctaProjects}
              <ArrowDown size={16} weight="bold" />
            </motion.a>
            <motion.a
              {...cvMagnet}
              href={cv.href}
              download
              className="inline-flex items-center gap-2 bg-accent text-ink px-6 py-3 rounded-full text-sm font-medium hover:ring-2 hover:ring-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press"
            >
              {cv.fallback ? dict.hero.ctaCvFallback : dict.hero.ctaCv}
              <DownloadSimple size={16} weight="bold" />
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
