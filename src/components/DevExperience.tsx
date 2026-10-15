'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { DevDictionary } from '@/i18n/types';
import { education, experience, formatGraduation, formatPeriod } from '@/content/dev';
import { Chip } from './Chip';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';
import { TiltCard } from './TiltCard';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type ExperienceText = DevDictionary['experience']['items'];
type EducationText = DevDictionary['experience']['education']['items'];

// One row per job between thin rules: period and company in a narrow column
// on the left (one mono line above the role on mobile), the role, context,
// bullets and stack Chips on the right. Education closes the section in two
// glass tiles over the persona glow, outside the timeline.
export function DevExperience() {
  const { dict } = useLocale<DevDictionary>();
  const reduce = useReducedMotion();
  const text = dict.experience;

  return (
    <section id="experience" className="py-[72px] md:py-[120px]">
      <Container>
        <SectionHeader index={2} label={dict.nav.experience} title={text.title} />

        <ol className="border-b border-white/10">
          {experience.map((job) => {
            const { role, context, bullets } = text.items[job.id as keyof ExperienceText];
            const period = formatPeriod(job, text.current, text);
            const current = job.end === null;
            return (
              <motion.li
                key={job.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 md:gap-12 py-6 md:py-9 border-t border-white/10"
              >
                <div className="flex flex-wrap gap-x-2 md:flex-col md:gap-2 font-mono text-xs md:font-sans md:text-[15px] text-ink/60">
                  <span className={`md:font-mono md:text-[13px] ${current ? 'text-highlight' : ''}`}>{period}</span>
                  <span aria-hidden className="md:hidden">
                    ·
                  </span>
                  <span>{job.company}</span>
                </div>

                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-xl md:text-2xl font-medium tracking-[-0.02em] text-white">{role}</h3>
                    <p className="text-[15px] leading-[1.55] text-ink/60">{context}</p>
                  </div>
                  <ul className="flex flex-col gap-2 md:gap-2.5">
                    {bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="relative pl-[18px] md:pl-5 text-[15px] leading-[1.55] text-ink/72 before:absolute before:left-0 before:top-[10px] before:w-2 before:h-px before:bg-highlight"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <ul className="flex flex-wrap gap-1.5 mt-1">
                    {job.stack.map((tag) => (
                      <li key={tag}>
                        <Chip>{tag}</Chip>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <div className="mt-12 md:mt-[72px]">
          <h3 className="mb-4 md:mb-5 font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-highlight">
            {text.education.title}
          </h3>
          <div className="relative isolate">
            <div
              aria-hidden
              className="absolute -inset-y-5 md:-inset-y-8 inset-x-0 md:inset-x-[4%] -z-10 persona-ambient"
            />
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              {education.map((entry) => {
                const { course, detail } = text.education.items[entry.id as keyof EducationText];
                return (
                  <li key={entry.id}>
                    <TiltCard className="glass h-full flex flex-col gap-2 md:gap-3 p-5 md:px-8 md:py-7 rounded-[20px]">
                      <span className="font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase text-ink/75">
                        {detail}
                      </span>
                      <span className="text-[19px] md:text-2xl font-medium tracking-[-0.02em] text-white">
                        {course}
                      </span>
                      <span className="text-[13px] md:text-[15px] text-ink/75">
                        {entry.institution} · {formatGraduation(entry, text.education.expected, text)}
                      </span>
                    </TiltCard>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
