'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { sectionIndex, skills } from '@/content/dev';
import { Chip } from './Chip';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';
import { TiltCard } from './TiltCard';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type CategoryText = DevDictionary['skills']['categories'];

// A block-mid Color block: one darker glass card per category, three to a
// row on desktop (cards in a row share its height), stacked on mobile. The
// items are Chips in the card's tone; an optional note under the name
// carries what isn't a name, so the Chips stay untranslated.
export function DevSkills() {
  const { dict } = useLocale<DevDictionary>();
  const reduce = useReducedMotion();
  const text = dict.skills;

  return (
    <section id="skills" className="bg-block-mid py-[72px] md:py-[120px]">
      <Container>
        <SectionHeader index={sectionIndex('skills')} label={dict.nav.skills} title={text.title} />

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {skills.map((category, i) => {
            const { name, note } = text.categories[category.id as keyof CategoryText] as {
              name: string;
              note?: string;
            };
            return (
              <motion.li
                key={category.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: EASE_OUT }}
              >
                <TiltCard className="glass glass-block-deep h-full flex flex-col gap-4 p-5 md:p-7 rounded-[22px]">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-highlight">
                      {name}
                    </h3>
                    {note && <p className="text-[13px] md:text-sm leading-[1.5] text-ink/70">{note}</p>}
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {category.items.map((item) => (
                      <li key={item}>
                        <Chip tone="block-deep">{item}</Chip>
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
