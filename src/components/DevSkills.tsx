'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { sectionIndex, skills } from '@/content/dev';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';
import { TiltCard } from './TiltCard';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// A block-mid Color block: one darker glass card per category, three to a
// row on desktop (cards in a row share its height), stacked on mobile. The
// items are outline pills, transparent like the Audio Gear's, so the glass
// stays on the card; an optional note under the name carries what isn't a
// name, so the pills stay untranslated.
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
            const categoryText = text.categories[category.id];
            const name = categoryText.name;
            const note = 'note' in categoryText ? categoryText.note : undefined;
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
                        <span className="inline-flex items-center h-8 px-3 rounded-full border border-ink/15 font-mono text-xs text-ink/80 hover:border-ink/30 transition-colors">
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
