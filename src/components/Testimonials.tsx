'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';

export function Testimonials() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const items = dict.testimonials.items;

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#f3f1ec] to-[#f8f7f4]">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-3xl md:text-4xl font-medium tracking-tight mb-12"
        >
          {dict.testimonials.title}
        </motion.h2>
      </div>

      {reduce ? (
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <TestimonialCard key={item.name + item.quote} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="marquee-wrapper overflow-hidden">
          <div className="marquee-track flex w-max gap-6 px-6">
            {[...items, ...items].map((item, i) => (
              <div key={`${item.name}-${i}`} className="w-80 shrink-0 md:w-96">
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function TestimonialCard({ item }: { item: { quote: string; name: string; role: string } }) {
  return (
    <div className="glass rounded-2xl p-6 h-full">
      <p className="text-stone-600 leading-relaxed mb-4">&ldquo;{item.quote}&rdquo;</p>
      <p className="text-sm">
        <span className="font-medium">{item.name}</span>
        <span className="text-stone-400"> &mdash; {item.role}</span>
      </p>
    </div>
  );
}
