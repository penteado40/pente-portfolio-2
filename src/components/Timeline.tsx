'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const LINKS: Record<string, string> = {
  'UNASP-HT': 'https://unasp.br',
  'Ministerio VOX': 'https://www.instagram.com/ministerio_vox/',
  'Ministério VOX': 'https://www.instagram.com/ministerio_vox/',
  'Vocal Livre': 'https://www.vocallivre.com.br',
};

const LINK_RE = new RegExp(`(${Object.keys(LINKS).join('|')})`, 'g');

function linkify(text: string): ReactNode {
  const parts = text.split(LINK_RE);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    LINKS[part] ? (
      <a
        key={i}
        href={LINKS[part]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-highlight/60 underline-offset-2 hover:decoration-highlight transition-colors"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

// The dictionary lists the milestones newest first, the order of the mobile
// list: the year in a narrow mono column, thin rules between the rows. From md
// up the row is reversed into a horizontal timeline, oldest on the left, each
// milestone a dot on a thin line; the newest one is drawn in highlight.
export function Timeline() {
  const { dict } = useLocale<AudioDictionary>();
  const reduce = useReducedMotion();

  return (
    <section id="timeline" className="py-[72px] md:py-[120px]">
      <Container>
        {/* 01 is the Hero, 02 the About. */}
        <SectionHeader index={3} label={dict.nav.timeline} title={dict.timeline.title} />

        <ol className="flex flex-col md:flex-row-reverse md:gap-4 border-b border-white/10 md:border-b-0">
          {dict.timeline.items.map((entry, i) => {
            const latest = i === 0;
            return (
              <motion.li
                key={entry.year}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className={`relative grid grid-cols-[52px_1fr] gap-3 py-[18px] border-t border-white/10 md:flex-1 md:flex md:flex-col md:gap-3.5 md:pt-7 md:pb-0 ${
                  latest ? 'md:border-t-2 md:border-highlight' : 'md:border-ink/14'
                }`}
              >
                <span
                  aria-hidden
                  className={`hidden md:block absolute left-0 rounded-full ${
                    latest
                      ? '-top-[7px] size-3 bg-highlight'
                      : '-top-1.5 size-[11px] bg-background ring-2 ring-ink/40'
                  }`}
                />
                <span
                  className={`pt-[3px] md:pt-0 font-mono text-[13px] md:text-sm ${
                    latest ? 'text-highlight' : 'text-ink/60'
                  }`}
                >
                  {entry.year}
                </span>
                <div className="flex flex-col gap-1.5 md:gap-3.5">
                  <h3 className="text-[17px] md:text-xl font-medium md:tracking-[-0.02em] text-white">
                    {linkify(entry.title)}
                  </h3>
                  <p className="text-sm leading-[1.5] md:leading-[1.55] text-ink/65">
                    {linkify(entry.description)}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
