'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';

export function Timeline() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section id="timeline" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-medium tracking-tight mb-16"
        >
          {dict.timeline.title}
        </motion.h2>

        <div className="relative max-w-3xl">
          <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-300 via-amber-400/40 to-transparent" />

          <div className="space-y-14">
            {dict.timeline.items.map((entry, i) => (
              <motion.div
                key={entry.year}
                initial={reduce ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex gap-8 md:gap-10 items-start"
              >
                <div className="relative z-10 mt-1 shrink-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="pb-2">
                  <span className="text-xs font-mono text-amber-700 tracking-wider">
                    {entry.year}
                  </span>
                  <h3 className="text-lg font-medium mt-1">{entry.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed mt-1 max-w-[50ch]">
                    {entry.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
