'use client';

import { Faders, Headphones, Waveform, type Icon } from '@phosphor-icons/react';
import { gearCategories, sectionIndex, type GearCategoryId } from '@/content/audio';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { CategoryCard } from './CategoryCard';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';

const GEAR_ICONS: Record<GearCategoryId, Icon> = {
  consoles: Faders,
  studio: Headphones,
  services: Waveform,
};

// A block-mid Color block like the Dev Stack: one CategoryCard per category,
// each with its icon, three to a row on desktop, stacked below that (a 2 + 1
// tablet row would leave a card alone).
export function Skills() {
  const { dict } = useLocale<AudioDictionary>();
  const text = dict.skills;

  return (
    <section id="skills" className="bg-block-mid py-[72px] md:py-[120px]">
      <Container>
        <SectionHeader index={sectionIndex('skills')} label={text.label} title={text.title} />

        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5">
          {gearCategories.map((id, i) => (
            <CategoryCard
              key={id}
              name={text.categories[id].name}
              icon={GEAR_ICONS[id]}
              items={text.categories[id].items}
              index={i}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
