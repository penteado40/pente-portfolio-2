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
      className="py-24 md:py-32 bg-gradient-to-b from-[#f8f7f4] to-[#f3f1ec]"
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

        {spotifyItem && (
          <motion.article
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="glass rounded-2xl p-6 hover:shadow-xl hover:shadow-stone-900/5 transition-shadow duration-300 mb-6"
          >
            <div className="rounded-xl overflow-hidden mb-5 bg-stone-100">
              <iframe
                src={`https://open.spotify.com/embed/${spotifyItem.embedId}?utm_source=generator&theme=0`}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="border-0"
                title={spotifyItem.title}
              />
            </div>

            <h3 className="text-xl font-medium mb-2">{spotifyItem.title}</h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-4">
              {spotifyItem.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {spotifyItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-stone-400 bg-stone-100/80 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        )}

        <ProjectsCarousel items={youtubeItems} />

        {/* Productions */}
        <motion.h3
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-2xl font-medium tracking-tight mt-20 mb-8"
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

        {/* Other work */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-12"
        >
          <h4 className="text-sm font-mono text-stone-400 tracking-wider mb-4">
            {dict.projects.otherTitle}
          </h4>
          <div className="flex flex-wrap gap-2">
            {dict.projects.otherItems.map((item) => (
              <span
                key={item}
                className="text-sm text-stone-600 bg-white/60 border border-stone-200/60 px-4 py-2 rounded-full"
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
