'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { EASE_OUT } from './easing';
import { pill } from './pill';
import { useMagnetic } from './useMagnetic';
import { carouselWindow } from './carouselWindow';

type YoutubeProduction = {
  title: string;
  description: string;
  tags: string[];
  embedType: 'youtube';
  embedId: string;
  views?: string;
};

// aria-disabled, not disabled: a disabled button drops focus to the body
// when the row reaches its end under a keyboard user.
const arrow =
  'flex items-center justify-center w-11 h-11 rounded-full border border-ink/20 bg-ink/8 text-ink hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press aria-disabled:border-ink/10 aria-disabled:bg-transparent aria-disabled:text-ink/30 aria-disabled:pointer-events-none';

// The YouTube mixes as a finite row of glass cards: three in view from md
// up, one 292px card with the next peeking on a phone. The arrows step a
// whole view and stop at either end; nothing is duplicated to wrap around.
// The row is a plain scroll-snap track, so a swipe or a trackpad moves it
// too, and the counter and dots read their position back from the scroll.
export function ProductionsCarousel({ items }: { items: YoutubeProduction[] }) {
  const { dict } = useLocale<AudioDictionary>();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [pos, setPos] = useState({ first: 0, perView: 1 });
  const prevMagnet = useMagnetic<HTMLButtonElement>();
  const nextMagnet = useMagnetic<HTMLButtonElement>();

  useEffect(() => {
    const track = trackRef.current;
    const [a, b] = cardRefs.current;
    if (!track || !a) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      // The track is relative, so a card's offsetLeft counts from its edge
      // and the first one's is the track's side padding.
      const step = b ? b.offsetLeft - a.offsetLeft : a.offsetWidth;
      const inner = track.clientWidth - 2 * a.offsetLeft;
      // The slack absorbs subpixel widths: three cards plus two gaps can
      // measure a hair over the inner width.
      const perView = Math.max(1, Math.floor((inner + step - a.offsetWidth) / step + 0.01));
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      const first = atEnd ? items.length - perView : Math.round(track.scrollLeft / step);
      setPos((p) => (p.first === first && p.perView === perView ? p : { first, perView }));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener('scroll', schedule, { passive: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(track);
    return () => {
      track.removeEventListener('scroll', schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [items.length]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const card = cardRefs.current[index];
      const first = cardRefs.current[0];
      if (!track || !card || !first) return;
      track.scrollTo({
        left: card.offsetLeft - first.offsetLeft,
        behavior: reduce ? 'auto' : 'smooth',
      });
    },
    [reduce],
  );

  const view = carouselWindow(pos.first, pos.perView, items.length);
  const projects = dict.projects;

  return (
    <div>
      {/* relative: the track's vertical padding overlaps the header and the
          dots, and as a positioned element it paints above them. */}
      <div className="relative z-[1] flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6 mb-4 md:mb-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl md:text-[32px] font-medium tracking-[-0.03em] text-white">
            {projects.videosTitle}
          </h3>
          <p className="text-[15px] text-ink/72">{projects.videosLead}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="mr-1.5 font-mono text-xs md:text-[13px] text-ink/60">
            {view.label}
          </span>
          <motion.button
            {...prevMagnet}
            type="button"
            onClick={() => view.prev !== null && goTo(view.prev)}
            aria-disabled={view.prev === null}
            aria-label={projects.videosPrev}
            className={arrow}
          >
            <CaretLeft size={18} weight="bold" aria-hidden />
          </motion.button>
          <motion.button
            {...nextMagnet}
            type="button"
            onClick={() => view.next !== null && goTo(view.next)}
            aria-disabled={view.next === null}
            aria-label={projects.videosNext}
            className={arrow}
          >
            <CaretRight size={18} weight="bold" aria-hidden />
          </motion.button>
        </div>
      </div>

      {/* On a phone the row bleeds past the Container's gutter (px-4), so
          the next card peeks from the screen's edge; scroll-padding keeps the
          snapped card on the gutter. The vertical padding, taken back by the
          negative margin, is room for the cards' drop shadow and slide-up,
          which overflow-x would clip. */}
      <div
        ref={trackRef}
        className="relative flex gap-3 md:gap-5 -mx-4 px-4 scroll-px-4 md:mx-0 md:px-0 md:scroll-px-0 py-10 -my-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {items.map((project, i) => {
          const counted = project.views !== undefined && /\d/.test(project.views);
          return (
            <motion.article
              key={project.embedId}
              ref={(el: HTMLElement | null) => {
                cardRefs.current[i] = el;
              }}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE_OUT }}
              // Three across: the width leaves room for the two md:gap-5 gaps.
              className="glass shrink-0 snap-start flex flex-col gap-4 md:gap-3.5 w-[292px] md:w-[calc((100%-40px)/3)] rounded-[22px] p-3 pb-5"
            >
              <div className="aspect-video rounded-[14px] overflow-hidden bg-mist">
                <iframe
                  src={`https://www.youtube.com/embed/${project.embedId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="block w-full h-full border-0"
                  title={project.title}
                />
              </div>

              {/* The text sits 6px in from the embed's edge. */}
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-3 px-1.5">
                <h4 className="text-[17px] md:text-[19px] font-medium leading-[1.3] md:leading-[1.25] tracking-[-0.015em] text-white">
                  {project.title}
                </h4>
                {counted && (
                  <span className="flex-none font-mono text-xs text-highlight">
                    {project.views} {dict.stats.viewsLabel}
                  </span>
                )}
              </div>
              <p className="hidden md:block px-1.5 text-sm leading-[1.55] text-ink/65">
                {project.description}
              </p>
              <ul className="flex flex-wrap gap-1.5 px-1.5 mt-auto">
                {project.tags.map((tag) => (
                  <li key={tag} className={`${pill} border-ink/14 text-ink/80`}>
                    {tag}
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </div>

      <div className="relative z-[1] flex justify-center gap-0.5 mt-4 md:mt-5">
        {Array.from({ length: view.pages }, (_, p) => (
          <button
            key={p}
            type="button"
            onClick={() => goTo(view.pageStart(p))}
            aria-label={projects.videosGoTo.replace('{range}', view.pageRange(p))}
            aria-current={p === view.page ? 'true' : undefined}
            className="group flex items-center justify-center h-6 px-[3px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
          >
            <span
              className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                p === view.page ? 'w-[22px] bg-ink' : 'w-1.5 bg-ink/30 group-hover:bg-ink/50'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
