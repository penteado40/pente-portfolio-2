'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { sectionIndex, skills } from '@/content/dev';
import { CategoryCard } from './CategoryCard';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';

// A block-mid Color block: one CategoryCard per category, three to a row on
// desktop, two on tablet, stacked on mobile.
export function DevSkills() {
  const { dict } = useLocale<DevDictionary>();
  const text = dict.skills;

  return (
    <section id="skills" className="bg-block-mid py-[72px] md:py-[120px]">
      <Container>
        <SectionHeader index={sectionIndex('skills')} label={dict.nav.skills} title={text.title} />

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {skills.map((category, i) => {
            const categoryText = text.categories[category.id];
            return (
              <CategoryCard
                key={category.id}
                name={categoryText.name}
                note={'note' in categoryText ? categoryText.note : undefined}
                items={category.items}
                index={i}
              />
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
