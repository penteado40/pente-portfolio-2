'use client';

import Image from 'next/image';
import { Certificate } from '@phosphor-icons/react';
import { useReducedMotion } from 'motion/react';
import type { Certification } from '@/content/certification';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';
import { TiltCard } from './TiltCard';
import { EASE_OUT } from './easing';

type CertificationsProps = {
  /** The persona's own list; empty renders nothing. */
  items: readonly Certification[];
  /** Position on the persona's page, shown as "04 / Certifications". */
  index: number;
  /** The section's name in the label, the Navbar's. */
  label: string;
  /** Defaults to the label, for a persona whose copy has no title of its own. */
  title?: string;
};

// Shared by the personas, each passing its own list. A persona hides the
// Navbar anchor on its own while its list is empty.
//
// One glass card per certification: the badge on a white square on top, the
// name, issuer and year below. On mobile the cards are a row that scrolls
// sideways, 220px each and bleeding into the gutters; from md up they sit in
// a grid, four across from lg, left to right.
export function Certifications({ items, index, label, title = label }: CertificationsProps) {
  const reduce = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <section id="certifications" className="py-[72px] md:py-[120px]">
      <Container>
        <SectionHeader index={index} label={label} title={title} />

        <ul className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-5 md:overflow-visible md:mx-0 md:px-0 md:pb-0">
          {items.map((item, i) => (
            <li key={`${item.title}-${item.year}`} className="flex-none w-[220px] md:w-auto">
              <TiltCard
                as="article"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE_OUT }}
                className="glass h-full flex flex-col gap-3.5 md:gap-[18px] p-2 pb-[18px] md:p-2.5 md:pb-[22px] rounded-[20px] md:rounded-[22px]"
              >
                <div className="relative aspect-square rounded-xl md:rounded-[14px] bg-white overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 768px) 33vw, 220px"
                      className="object-contain p-3"
                    />
                  ) : (
                    <Certificate aria-hidden size={56} className="text-background" weight="fill" />
                  )}
                </div>
                <div className="flex flex-col gap-1 md:gap-1.5 px-2.5 md:px-3">
                  <h3 className="text-base md:text-lg font-medium tracking-[-0.015em] text-white">{item.title}</h3>
                  <p className="text-[13px] md:text-sm text-ink/65">{item.issuer}</p>
                  <span className="mt-0.5 md:mt-1 font-mono text-xs md:text-[13px] text-highlight">{item.year}</span>
                </div>
              </TiltCard>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
