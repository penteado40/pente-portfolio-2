'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { ProjectsCarousel } from './ProjectsCarousel';
import { ProductionCard } from './ProductionCard';

type SpotifyProject = {
  title: string;
  description: string;
  tags: string[];
  embedType: 'spotify';
  embedId: string;
};
type YoutubeProject = {
  title: string;
  description: string;
  tags: string[];
  embedType: 'youtube';
  embedId: string;
  views?: string;
};

export function Projects() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();

  const spotifyItem = dict.projects.items.find(
    (p): p is SpotifyProject => p.embedType === 'spotify',
  );
  const youtubeItems = dict.projects.items.filter(
    (p): p is YoutubeProject => p.embedType === 'youtube',
  );

  return (
    <section
      id="projects"
      className="pt-24 md:pt-32 pb-12 md:pb-16 bg-gradient-to-b from-background to-mist"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-3xl md:text-4xl font-medium tracking-tight mb-12"
        >
          {dict.projects.title}
        </motion.h2>

        {/* Productions */}
        <motion.h3
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-2xl font-medium tracking-tight mb-8"
        >
          {dict.projects.productionsTitle}
        </motion.h3>

        <div className="productions-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {dict.projects.productions.map((prod, i) => (
            <motion.div
              key={prod.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            >
              <ProductionCard prod={prod} streamsLabel={dict.stats.streamsLabel} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-20 mb-20">
        <ProjectsCarousel items={youtubeItems} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {spotifyItem && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="rounded-xl overflow-hidden mb-24 bg-mist"
          >
            <iframe
              src={`https://open.spotify.com/embed/${spotifyItem.embedId}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="border-0"
              title={spotifyItem.title}
            />
          </motion.div>
        )}

        {/* Other work */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-12"
        >
          <h4 className="text-sm font-mono text-ink/40 tracking-wider mb-4">
            {dict.projects.otherTitle}
          </h4>
          <div className="flex flex-wrap gap-2">
            {dict.projects.otherItems.map((item) => (
              <span
                key={item}
                className="text-sm text-ink/70 bg-surface/70 border border-ink/10 px-4 py-2 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
