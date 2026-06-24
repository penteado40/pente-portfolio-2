'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { PaperPlaneTilt } from '@phosphor-icons/react';

export function Contact() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">
            {dict.contact.title}
          </h2>
          <p className="text-stone-500 mb-8">{dict.contact.subtitle}</p>

          <form
            className="space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label
                htmlFor="name"
                className="sr-only"
              >
                {dict.contact.namePlaceholder}
              </label>
              <input
                id="name"
                type="text"
                placeholder={dict.contact.namePlaceholder}
                className="w-full bg-white/60 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="sr-only"
              >
                {dict.contact.emailPlaceholder}
              </label>
              <input
                id="email"
                type="email"
                placeholder={dict.contact.emailPlaceholder}
                className="w-full bg-white/60 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="sr-only"
              >
                {dict.contact.messagePlaceholder}
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder={dict.contact.messagePlaceholder}
                className="w-full bg-white/60 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors active:scale-[0.98]"
            >
              {dict.contact.send}
              <PaperPlaneTilt size={16} weight="bold" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
