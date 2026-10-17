'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { ArrowDown } from '@phosphor-icons/react';
import { Chip } from './Chip';
import { Container } from './Container';
import { SectionLabel } from './SectionHeader';
import { sectionIndex } from '@/content/dev';
import { TiltCard } from './TiltCard';
import { EASE_OUT } from './easing';

// Set in next.config.ts: empty until the Dev portrait is added to public/.
const photo = process.env.DEV_PORTRAIT_PHOTO;

// The portrait, or the persona glow standing in for it; `sizes` is the
// rendered width, for the photo.
function Portrait({ sizes, alt }: { sizes: string; alt: string }) {
  return photo ? (
    <Image src={photo} alt={alt} fill sizes={sizes} className="object-cover" />
  ) : (
    <div
      aria-hidden
      className="absolute -inset-[30%]"
      style={{ backgroundImage: 'var(--persona-glow)' }}
    />
  );
}

// A Color block: the portrait card on the left from lg up, a 64px avatar
// beside the label below that. The first sentence is the title; the quote
// sits in a block-mid glass pane, and Chips close it, the availability
// one leading to Contact.
export function DevAbout() {
  const { dict } = useLocale<DevDictionary>();
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
          <Portrait sizes="(min-width: 1200px) 440px, 36vw" alt={about.portraitAlt} />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          className="flex flex-col gap-[18px] md:gap-[22px] lg:pt-2"
        >
          <div className="flex items-center gap-3.5">
            <div className="lg:hidden relative isolate size-16 shrink-0 rounded-full overflow-hidden bg-background">
              <Portrait sizes="64px" alt={about.portraitAlt} />
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

          <ul className="flex flex-wrap gap-1.5 md:gap-2 mt-1 md:mt-2">
            {[about.location, ...about.languages].map((text) => (
              <li key={text}>
                <Chip tone="block-mid">{text}</Chip>
              </li>
            ))}
            <li>
              <Chip tone="block-mid" href="#contact" Icon={ArrowDown}>
                {about.availability}
              </Chip>
            </li>
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
