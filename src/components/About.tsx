'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { sectionIndex } from '@/content/audio';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { Container } from './Container';
import { SectionLabel } from './SectionHeader';
import { TiltCard } from './TiltCard';
import { EASE_OUT } from './easing';

const PORTRAIT = '/photos/pente-portrait.jpg';

// A Color block, laid out like the Dev About: the portrait card on the left
// from lg up, a 64px avatar beside the label below that. The first sentence
// is the title, and the quote sits in a block-mid glass pane.
export function About() {
  const { dict } = useLocale<AudioDictionary>();
  const reduce = useReducedMotion();
  const { about } = dict;

  return (
    <section id="about" className="bg-block-deep py-[72px] md:py-[120px]">
      <Container className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-[72px] items-start">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="hidden lg:block relative isolate aspect-[4/5] rounded-[28px] overflow-hidden bg-background shadow-card"
        >
          <Image
            src={PORTRAIT}
            alt={about.portraitAlt}
            fill
            sizes="(min-width: 1200px) 440px, 36vw"
            className="object-cover object-[50%_25%]"
          />
          <div aria-hidden className="absolute inset-0 portrait-fade" />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          className="flex flex-col gap-[18px] md:gap-[22px] lg:pt-2"
        >
          <div className="flex items-center gap-3.5">
            <div className="lg:hidden relative isolate size-16 shrink-0 rounded-full overflow-hidden border border-ink/14">
              <Image
                src={PORTRAIT}
                alt={about.portraitAlt}
                fill
                sizes="64px"
                className="object-cover object-[50%_25%]"
              />
            </div>
            <SectionLabel index={sectionIndex('about')} label={dict.nav.about} />
          </div>
          <h2 className="text-[34px] md:text-5xl leading-[1.05] md:leading-[1.02] font-medium tracking-[-0.035em] text-white">
            {about.title}
          </h2>
          {[about.p1, about.p2, about.p3].map((p) => (
            <p key={p} className="text-[15px] md:text-[17px] leading-[1.6] text-ink/72 max-w-[620px]">
              {p}
            </p>
          ))}

          <TiltCard className="glass glass-block-mid mt-2 p-6 md:p-8 rounded-[20px] md:rounded-[22px] max-w-[620px]">
            <blockquote>
              <span
                aria-hidden
                className="block -mb-3 md:-mb-4 font-serif text-6xl md:text-7xl leading-none text-highlight"
              >
                &ldquo;
              </span>
              <p className="text-lg md:text-2xl leading-snug font-medium tracking-[-0.02em] text-white">
                {about.quote}
              </p>
            </blockquote>
          </TiltCard>
        </motion.div>
      </Container>
    </section>
  );
}
