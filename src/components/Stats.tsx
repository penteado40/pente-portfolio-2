'use client';

import { useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { Container } from './Container';
import { TiltCard } from './TiltCard';

// Five glass cards in a row on desktop; two columns on mobile, the last one
// across the whole row. A persona glow sits behind them so the glass has a
// color to show over Onyx.
export function Stats() {
  const { dict } = useLocale<AudioDictionary>();
  const reduce = useReducedMotion();

  return (
    <section aria-label={dict.stats.title} className="pt-8 md:pt-6 pb-14 md:pb-24">
      <Container>
        <div className="relative isolate grid grid-cols-2 lg:grid-cols-5 gap-2.5 md:gap-4">
          <div aria-hidden className="absolute -inset-y-5 md:-inset-y-8 inset-x-0 md:inset-x-[4%] -z-10 persona-ambient" />
          {dict.stats.items.map((stat, i, items) => {
            // Mobile: the odd one out spans the row, value and label side by side.
            const wide = i === items.length - 1 && items.length % 2 === 1;
            return (
              <TiltCard
                key={stat.label}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`glass flex flex-col justify-between gap-3.5 md:gap-4 min-h-32 md:min-h-44 p-[18px] md:p-6 rounded-[20px] md:rounded-[22px] ${
                  wide ? 'max-lg:col-span-2 max-lg:min-h-0 max-lg:flex-row max-lg:items-center' : ''
                }`}
              >
                <span className="text-[38px] md:text-[52px] font-medium tracking-[-0.04em] leading-none text-ink">
                  {stat.value}
                </span>
                <span
                  className={`font-mono text-[11px] md:text-xs tracking-[0.1em] uppercase leading-normal text-ink/70 ${
                    wide ? 'max-lg:text-right' : ''
                  }`}
                >
                  {stat.label}
                </span>
              </TiltCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
