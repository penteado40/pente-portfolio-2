'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';

export function Skills() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section
      id="skills"
      className="py-24 md:py-32 bg-gradient-to-b from-mist to-background"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-medium tracking-tight mb-12"
        >
          {dict.skills.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dict.skills.categories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`glass rounded-2xl p-6 ${
                i === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <h3 className="text-sm font-mono text-accent tracking-wider mb-4">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm text-ink/70 bg-surface/70 border border-ink/10 px-4 py-2 rounded-full hover:bg-surface hover:border-ink/25 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
