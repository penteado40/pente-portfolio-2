'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ChatCircleText } from '@phosphor-icons/react';
import { sectionIndex } from '@/content/audio';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import type { ApprovedTestimonial } from '@/lib/testimonial';
import { useTestimonialModal } from './TestimonialModalProvider';
import { Container } from './Container';
import { PillButton } from './PillButton';
import { SectionHeader } from './SectionHeader';
import { EASE_OUT } from './easing';

// The approved testimonials as 20px cards, three to a row on desktop. On a
// phone they become a row that scrolls sideways, 300px a card, with the
// next one peeking, and "Leave yours" moves under it at full width.
export function Testimonials({ items }: { items: ApprovedTestimonial[] }) {
  const { dict } = useLocale<AudioDictionary>();
  const reduce = useReducedMotion();
  const { open } = useTestimonialModal();
  const text = dict.testimonials;

  return (
    <section id="testimonials" className="py-[72px] md:py-[120px]">
      <Container>
        <SectionHeader
          index={sectionIndex('testimonials')}
          label={text.label}
          title={text.title}
          aside={
            <PillButton Icon={ChatCircleText} onClick={open}>
              {text.cta}
            </PillButton>
          }
          asideFromMd
        />

        {items.length > 0 && (
          // The list starts the entrance, not each card: on a phone the cards
          // past the edge never come into view until the row is scrolled.
          <motion.ul
            initial={reduce ? false : 'hidden'}
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            className="flex gap-3 -mx-4 px-4 scroll-px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-5 md:mx-0 md:px-0 md:overflow-visible"
          >
            {items.map((item, i) => (
              <motion.li
                key={item.id}
                variants={{ hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: EASE_OUT }}
                className="w-[300px] shrink-0 snap-start md:w-auto"
              >
                <TestimonialCard item={item} />
              </motion.li>
            ))}
          </motion.ul>
        )}

        <PillButton Icon={ChatCircleText} onClick={open} className="w-full mt-5 md:hidden">
          {text.ctaFull}
        </PillButton>
      </Container>
    </section>
  );
}

function TestimonialCard({ item }: { item: ApprovedTestimonial }) {
  // Array.from splits by code point, so a name opening with an accent or
  // an emoji keeps its whole first character.
  const initial = Array.from(item.author.trim())[0]?.toUpperCase();

  return (
    <figure className="h-full flex flex-col justify-between gap-6 md:gap-8 min-h-[240px] md:min-h-[280px] p-[22px] md:p-7 rounded-[20px] bg-mist border border-ink/8">
      <blockquote className="text-[17px] md:text-lg leading-[1.55] text-ink">
        &ldquo;{item.message.trim()}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid place-items-center size-10 shrink-0 rounded-full bg-block-mid text-highlight text-[13px] font-semibold"
        >
          {initial}
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">{item.author}</span>
          <span className="text-[13px] text-ink/60">{item.roleCompany}</span>
        </span>
      </figcaption>
    </figure>
  );
}
