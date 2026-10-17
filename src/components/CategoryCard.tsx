'use client';

import type { Icon } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { TiltCard } from './TiltCard';
import { EASE_OUT } from './easing';

type CategoryCardProps = {
  name: string;
  /** What isn't a name, under it, so the items stay untranslated. */
  note?: string;
  /** A stroke icon in highlight beside the name. */
  icon?: Icon;
  items: readonly string[];
  /** Position in the grid, staggering the entrance across a row of three. */
  index: number;
};

// One category of the Dev Stack or the Audio Gear, as a grid item: a neutral
// glass card showing the Color block through it, with the height of its row.
// The items are plain pills, not glass, with no fill of their own: a Charcoal
// fill would read grey over the tinted block, so they take the card's color.
export function CategoryCard({ name, note, icon: CategoryIcon, items, index }: CategoryCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.06, ease: EASE_OUT }}
    >
      <TiltCard className="glass h-full flex flex-col gap-4 p-5 md:p-7 rounded-[22px]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-highlight">{name}</h3>
            {CategoryIcon && <CategoryIcon size={22} weight="light" aria-hidden className="shrink-0 text-highlight" />}
          </div>
          {note && <p className="text-[13px] md:text-sm leading-[1.5] text-ink/70">{note}</p>}
        </div>
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item}>
              <span className="inline-block text-sm text-ink/70 border border-ink/10 px-4 py-2 rounded-full hover:bg-white/5 hover:border-ink/25 transition-colors cursor-default">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </TiltCard>
    </motion.li>
  );
}
