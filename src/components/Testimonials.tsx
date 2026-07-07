'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useTestimonialModal } from './TestimonialModalProvider';
import type { ApprovedTestimonial } from '@/lib/testimonial';

export function Testimonials({ items }: { items: ApprovedTestimonial[] }) {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const { open } = useTestimonialModal();

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-mist to-background">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between gap-4 mb-12">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-3xl md:text-4xl font-medium tracking-tight"
          >
            {dict.testimonials.title}
          </motion.h2>

          <button
            type="button"
            onClick={open}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors active:scale-[0.98] shrink-0"
          >
            {dict.testimonials.cta}
          </button>
        </div>
      </div>

      {items.length > 0 &&
        (reduce ? (
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="marquee-wrapper overflow-hidden">
            <div className="marquee-track flex w-max gap-6 px-6">
              {[...items, ...items].map((item, i) => (
                <div key={`${item.id}-${i}`} className="w-80 shrink-0 md:w-96">
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>
          </div>
        ))}
    </section>
  );
}

function TestimonialCard({ item }: { item: ApprovedTestimonial }) {
  return (
    <div className="glass rounded-2xl p-6 h-full">
      <p className="text-ink/70 leading-relaxed mb-4">&ldquo;{item.message}&rdquo;</p>
      <p className="text-sm">
        <span className="font-medium">{item.author}</span>
        <span className="text-ink/40"> &mdash; {item.roleCompany}</span>
      </p>
    </div>
  );
}
