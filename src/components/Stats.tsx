'use client';

import { useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { TiltCard } from './TiltCard';

export function Stats() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {dict.stats.items.map((stat, i) => (
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
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-mono text-ink">
                {stat.value}
              </div>
              <div className="text-sm text-ink/60 mt-2">{stat.label}</div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
