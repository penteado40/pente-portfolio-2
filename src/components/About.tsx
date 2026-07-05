'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';

export function About() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            className="lg:col-span-2"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="/photos/pente-portrait.jpg"
                alt="Felipe Penteado"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            className="lg:col-span-3 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
              {dict.about.title}
            </h2>
            <p className="text-ink/60 leading-relaxed max-w-[55ch]">
              {dict.about.p1}
            </p>
            <p className="text-ink/60 leading-relaxed max-w-[55ch]">
              {dict.about.p2}
            </p>
            <p className="text-ink/60 leading-relaxed max-w-[55ch]">
              {dict.about.p3}
            </p>

            <blockquote className="border-l-2 border-accent pl-6 mt-8">
              <p className="text-ink/80 italic leading-relaxed">
                &ldquo;{dict.about.quote}&rdquo;
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
