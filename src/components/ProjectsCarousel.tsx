'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';

type YoutubeProject = {
  title: string;
  description: string;
  tags: string[];
  embedType: 'youtube';
  embedId: string;
  views?: string;
};

export function ProjectsCarousel({ items }: { items: YoutubeProject[] }) {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const index = cardRefs.current.findIndex((el) => el === mostVisible.target);
        if (index !== -1) setActiveIndex(index);
      },
      { root, threshold: 0.6 },
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  const goTo = useCallback(
    (index: number) => {
      const card = cardRefs.current[index];
      if (!card || !trackRef.current) return;
      trackRef.current.scrollTo({
        left: card.offsetLeft,
        behavior: reduce ? 'auto' : 'smooth',
      });
    },
    [reduce],
  );

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === items.length - 1;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="carousel-fade flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide px-6"
      >
        {items.map((project, i) => (
          <motion.article
            key={`${project.title}-${project.embedId}`}
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[i] = el;
            }}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            className="glass rounded-2xl p-6 hover:shadow-xl hover:shadow-black/30 transition-shadow duration-300 shrink-0 snap-center w-[85%] max-w-[1150px] sm:w-[70%] sm:max-w-[946px] md:w-[48%] md:max-w-[650px] lg:w-[38%] lg:max-w-[514px]"
          >
            <div className="rounded-xl overflow-hidden mb-5 bg-mist">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${project.embedId}`}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="border-0"
                  title={project.title}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-medium">{project.title}</h3>
              {'views' in project && (
                <span className="text-xs font-mono text-ink/40">
                  {project.views} {dict.stats.viewsLabel}
                </span>
              )}
            </div>
            <p className="text-ink/60 text-sm leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-ink/50 bg-mist px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      <button
        onClick={() => goTo(activeIndex - 1)}
        disabled={isFirst}
        aria-label="Previous project"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 glass p-2 rounded-full text-ink/70 hover:text-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <CaretLeft size={18} weight="bold" />
      </button>
      <button
        onClick={() => goTo(activeIndex + 1)}
        disabled={isLast}
        aria-label="Next project"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 glass p-2 rounded-full text-ink/70 hover:text-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <CaretRight size={18} weight="bold" />
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to project ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? 'w-4 bg-accent' : 'w-1.5 bg-ink/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
