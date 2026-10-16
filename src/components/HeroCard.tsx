'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useTransform,
  useScroll,
  useReducedMotion,
} from 'motion/react';
import { Container } from './Container';
import { SectionLabel } from './SectionHeader';
import { EASE_OUT } from './easing';

type HeroCardProps = {
  /** Position on the page and persona name, shown as "01 / AUDIO". */
  index: number;
  label: string;
  /** Mono text across from the label, top right. */
  meta: ReactNode;
  /** The photo, or what stands in for it, under the persona tint. */
  backdrop: ReactNode;
  /** Where the backdrop layer sits in the card (the whole card by default); it grows a little on scroll. */
  backdropClassName?: string;
  /** The mono line above the headline, in highlight. */
  eyebrow: string;
  headline: string;
  subtitle: string;
  actions: ReactNode;
  /** Shown to the right of the glass pane from lg up. */
  aside?: ReactNode;
  /** Seconds before the pane's entrance starts, to let the backdrop land first. */
  delay?: number;
};

// A photo card inside the content column, like the Hub's persona cards: the
// persona's tint over the backdrop, a glass pane at the bottom. The Navbar
// floats over it and expands once the card (`data-hero`, see useInHero) is
// scrolled past. The card starts below the island, and on desktop the label
// row sits lower still, clear of the expanded island. On short phones the
// card shrinks to keep the CTA above the fold.
export function HeroCard({
  index,
  label,
  meta,
  backdrop,
  backdropClassName = 'inset-0',
  eyebrow,
  headline,
  subtitle,
  actions,
  aside,
  delay = 0,
}: HeroCardProps) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const paneDelay = reduce ? 0 : delay;
  const container = {
    hidden: {},
    show: { transition: { delayChildren: paneDelay, staggerChildren: 0.15 } },
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
    <section className="pt-[76px] md:pt-24 pb-2 md:pb-8">
      <Container wide>
        <div
          ref={cardRef}
          data-hero
          className="relative isolate flex flex-col justify-between gap-6 min-h-[min(640px,calc(100svh-92px))] md:min-h-[760px] p-4 md:p-8 rounded-3xl md:rounded-[28px] overflow-hidden bg-background text-white shadow-card"
        >
          <motion.div
            className={`absolute -z-10 ${backdropClassName}`}
            style={reduce ? undefined : { scale: backdropScale }}
          >
            {backdrop}
          </motion.div>
          <div aria-hidden className="absolute inset-0 -z-10 persona-card-tint" />

          <div className="flex items-center justify-between px-1 pt-1 md:px-0 md:pt-[72px]">
            <SectionLabel index={index} label={label} tone="ink" />
            <span className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase">
              {meta}
            </span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="glass flex-1 flex flex-col gap-3 md:gap-4 min-w-0 max-w-[680px] p-5 md:p-8 rounded-[18px] md:rounded-[22px]"
            >
              <motion.p
                variants={item}
                className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-highlight"
              >
                {eyebrow}
              </motion.p>
              <motion.h1
                variants={item}
                className="text-[34px] md:text-6xl leading-[1.04] md:leading-[1.02] font-medium tracking-[-0.04em]"
              >
                {headline}
              </motion.h1>
              <motion.p
                variants={item}
                className="text-[15px] md:text-[17px] leading-[1.55] md:leading-relaxed text-white/80"
              >
                {subtitle}
              </motion.p>
              <motion.div variants={item} className="mt-1 md:mt-2">
                {actions}
              </motion.div>
            </motion.div>
            {aside && (
              <motion.div
                initial={item.hidden}
                animate={{ ...item.show, transition: { ...item.show.transition, delay: paneDelay + 0.6 } }}
                className="hidden lg:block shrink-0"
              >
                {aside}
              </motion.div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
