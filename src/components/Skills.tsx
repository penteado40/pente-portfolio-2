'use client';

import { Faders, Headphones, Waveform, type Icon } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { sectionIndex, type GearCategoryId } from '@/content/audio';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';
import { TiltCard } from './TiltCard';
import { EASE_OUT } from './easing';

const GEAR_ICONS: Record<GearCategoryId, Icon> = {
  consoles: Faders,
  studio: Headphones,
  services: Waveform,
};

// A block-mid Color block laid out like the Dev Stack: one neutral glass card
// per category, showing the block through it, three to a row on desktop with
// the row's height, stacked on mobile. The name and a stroke icon in highlight
// top each card; the items are plain pills taking the card's color.
export function Skills() {
  const { dict } = useLocale<AudioDictionary>();
  const reduce = useReducedMotion();
  const text = dict.skills;

  return (
    <section id="skills" className="bg-block-mid py-[72px] md:py-[120px]">
      <Container>
        <SectionHeader index={sectionIndex('skills')} label={text.label} title={text.title} />

        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5">
          {text.categories.map((category, i) => {
            const CategoryIcon = GEAR_ICONS[category.id as GearCategoryId];
            return (
              <motion.li
                key={category.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE_OUT }}
              >
                <TiltCard className="glass h-full flex flex-col gap-4 p-5 md:p-7 rounded-[22px]">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-highlight">
                      {category.name}
                    </h3>
                    <CategoryIcon size={22} weight="light" aria-hidden className="shrink-0 text-highlight" />
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
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
          })}
        </ul>
      </Container>
    </section>
  );
}
