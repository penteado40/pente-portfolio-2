'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';

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
        className="underline decoration-accent/60 underline-offset-2 hover:decoration-accent transition-colors"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export function Timeline() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section id="timeline" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-medium tracking-tight mb-16"
        >
          {dict.timeline.title}
        </motion.h2>

        <div className="relative max-w-3xl">
          <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/50 via-accent/20 to-transparent" />

          <div className="space-y-14">
            {dict.timeline.items.map((entry, i) => (
              <motion.div
                key={entry.year}
                initial={reduce ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex gap-8 md:gap-10 items-start"
              >
                <div className="relative z-10 mt-1 shrink-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/20">
                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="pb-2">
                  <span className="text-xs font-mono text-accent tracking-wider">
                    {entry.year}
                  </span>
                  <h3 className="text-lg font-medium mt-1">{linkify(entry.title)}</h3>
                  <p className="text-ink/60 text-sm leading-relaxed mt-1 max-w-[50ch]">
                    {linkify(entry.description)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
