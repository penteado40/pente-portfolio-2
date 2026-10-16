'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { sectionIndex } from '@/content/audio';
import { Chip } from './Chip';
import { Container } from './Container';
import { ProductionCard } from './ProductionCard';
import { ProductionsCarousel } from './ProductionsCarousel';
import { SectionHeader } from './SectionHeader';
import { EASE_OUT } from './easing';

type SpotifyProduction = {
  title: string;
  description: string;
  tags: string[];
  embedType: 'spotify';
  embedId: string;
};
type YoutubeProduction = {
  title: string;
  description: string;
  tags: string[];
  embedType: 'youtube';
  embedId: string;
  views?: string;
};

export function Productions() {
  const { dict } = useLocale<AudioDictionary>();
  const reduce = useReducedMotion();

  const spotifyItem = dict.projects.items.find(
    (p): p is SpotifyProduction => p.embedType === 'spotify',
  );
  const youtubeItems = dict.projects.items.filter(
    (p): p is YoutubeProduction => p.embedType === 'youtube',
  );

  return (
    <section id="projects" className="pt-[72px] md:pt-[120px] pb-12 md:pb-16">
      <Container>
        <SectionHeader
          index={sectionIndex('projects')}
          label={dict.nav.projects}
          title={dict.projects.productionsTitle}
          aside={<p className="text-[15px] md:text-[17px] leading-[1.6] text-ink/72">{dict.projects.productionsLead}</p>}
        />

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-6">
          {dict.projects.productions.map((prod, i) => (
            <motion.li
              key={prod.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_OUT }}
            >
              <ProductionCard
                prod={prod}
                streamsLabel={dict.stats.streamsLabel}
                watchLabel={dict.projects.watch.replace('{title}', prod.title)}
              />
            </motion.li>
          ))}
        </ul>

        {spotifyItem && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="mt-14 md:mt-24"
          >
            <h3 className="mb-4 md:mb-6 text-2xl md:text-[32px] font-medium tracking-[-0.03em] text-white">
              {dict.projects.mixesTitle}
            </h3>
            {/* The embed lays itself out compact at phone width, where 380px fits three tracks under its header; 452px shows five from md up. */}
            <div className="rounded-[20px] overflow-hidden border border-ink/10 bg-mist">
              <iframe
                src={`https://open.spotify.com/embed/${spotifyItem.embedId}?utm_source=generator&theme=0`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block w-full h-[380px] md:h-[452px] border-0"
                title={dict.projects.mixesPlayerTitle}
              />
            </div>
          </motion.div>
        )}
      </Container>

      <div className="mt-20 mb-20">
        <ProductionsCarousel items={youtubeItems} />
      </div>

      <Container>
        {/* Other work */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mt-12"
        >
          <h3 className="mb-4 md:mb-[18px] font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-ink/60">
            {dict.projects.otherTitle}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {dict.projects.otherItems.map((item) => (
              <li key={item}>
                <Chip>{item}</Chip>
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
