'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useTestimonialModal } from './TestimonialModalProvider';
import type { ApprovedTestimonial } from '@/lib/testimonial';

export function Testimonials({ items }: { items: ApprovedTestimonial[] }) {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const { open } = useTestimonialModal();

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-mist to-background">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between gap-4 mb-12">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-3xl md:text-4xl font-medium tracking-tight"
          >
            {dict.testimonials.title}
          </motion.h2>

          <button
            type="button"
            onClick={open}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors active:scale-[0.98] shrink-0"
          >
            {dict.testimonials.cta}
          </button>
        </div>
      </div>

      {items.length > 0 &&
        (reduce ? (
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <TestimonialsCarousel items={items} label={dict.testimonials.title} />
        ))}
    </section>
  );
}

const STEP_INTERVAL_MS = 4500;
const RESUME_DELAY_MS = 5000;
const SETTLE_DEBOUNCE_MS = 200;

function TestimonialsCarousel({
  items,
  label,
}: {
  items: ApprovedTestimonial[];
  label: string;
}) {
  const count = items.length;
  // Repeating the list lets "next"/"prev" always land on a real card, so the
  // last-to-first wrap can be a silent instant jump between identical-looking
  // clones instead of a visible snap-back. With few items, 3 copies can be
  // narrower than the viewport, which clamps scrollTo and breaks navigation —
  // so small lists get more copies to guarantee enough scrollable width.
  const copies = count > 0 && count <= 6 ? 8 : 3;
  const extended = count > 0 ? Array.from({ length: copies }, () => items).flat() : [];

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(count);
  const isInteractingRef = useRef(false);
  const lastInteractionRef = useRef(0);
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  // Cards use snap-center, so the valid snap point is the card's center
  // aligned to the track's center — not its left edge.
  const cardTarget = useCallback((card: HTMLDivElement, track: HTMLDivElement) => {
    return card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
  }, []);

  // With several small cards visible at once, "most visible" is ambiguous
  // (many cards tie near 100% visibility), so the current index is derived
  // geometrically from scroll position instead of via IntersectionObserver.
  const getNearestIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return activeIndexRef.current;
    const centerX = track.scrollLeft + track.clientWidth / 2;
    let nearest = activeIndexRef.current;
    let nearestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centerX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    return nearest;
  }, []);

  const goToExtended = useCallback(
    (index: number, instant = false) => {
      const card = cardRefs.current[index];
      const track = trackRef.current;
      if (!card || !track) return;
      activeIndexRef.current = index;
      track.scrollTo({ left: cardTarget(card, track), behavior: instant ? 'auto' : 'smooth' });
    },
    [cardTarget],
  );

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  const goNext = useCallback(() => {
    goToExtended(activeIndexRef.current + 1);
  }, [goToExtended]);

  const goPrev = useCallback(() => {
    goToExtended(activeIndexRef.current - 1);
  }, [goToExtended]);

  useEffect(() => {
    if (count === 0) return;
    activeIndexRef.current = count;
    goToExtended(count, true);
  }, [count, copies, goToExtended]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    const lastCopyStart = count * (copies - 1);
    const jumpBy = count * (copies - 2);

    let timeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const index = getNearestIndex();
        activeIndexRef.current = index;
        if (index < count) {
          activeIndexRef.current = index + jumpBy;
          goToExtended(index + jumpBy, true);
        } else if (index >= lastCopyStart) {
          activeIndexRef.current = index - jumpBy;
          goToExtended(index - jumpBy, true);
        }
      }, SETTLE_DEBOUNCE_MS);
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [count, copies, goToExtended, getNearestIndex]);

  useEffect(() => {
    if (count === 0) return;
    const interval = setInterval(() => {
      if (isInteractingRef.current) return;
      if (Date.now() - lastInteractionRef.current < RESUME_DELAY_MS) return;
      goNext();
    }, STEP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [count, goNext]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { startX: e.clientX, startScrollLeft: track.scrollLeft };
    isInteractingRef.current = true;
    track.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track) return;
    track.scrollLeft = drag.startScrollLeft - (e.clientX - drag.startX);
  };

  const endDrag = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    isInteractingRef.current = false;
    markInteraction();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      markInteraction();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      markInteraction();
      goPrev();
    }
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => {
          isInteractingRef.current = true;
        }}
        onMouseLeave={() => {
          isInteractingRef.current = false;
          markInteraction();
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="carousel-fade flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide px-6 cursor-grab active:cursor-grabbing select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-2xl"
      >
        {extended.map((item, i) => (
          <div
            key={`${item.id}-${Math.floor(i / count)}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="w-80 shrink-0 snap-center md:w-96"
          >
            <TestimonialCard item={item} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          markInteraction();
          goPrev();
        }}
        aria-label="Previous testimonial"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 glass p-2 rounded-full text-ink/70 hover:text-accent transition-colors"
      >
        <CaretLeft size={18} weight="bold" />
      </button>
      <button
        type="button"
        onClick={() => {
          markInteraction();
          goNext();
        }}
        aria-label="Next testimonial"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 glass p-2 rounded-full text-ink/70 hover:text-accent transition-colors"
      >
        <CaretRight size={18} weight="bold" />
      </button>
    </div>
  );
}

function TestimonialCard({ item }: { item: ApprovedTestimonial }) {
  return (
    <div className="glass rounded-2xl p-6 h-full">
      <p className="text-ink/70 leading-relaxed mb-4">&ldquo;{item.message}&rdquo;</p>
      <p className="text-sm">
        <span className="font-medium">{item.author}</span>
        <span className="text-ink/40"> &mdash; {item.roleCompany}</span>
      </p>
    </div>
  );
}
