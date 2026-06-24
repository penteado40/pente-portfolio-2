'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { PaperPlaneTilt, Check, CircleNotch } from '@phosphor-icons/react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('https://formspree.io/f/mkoloerw', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const buttonContent = {
    idle: { label: dict.contact.send, Icon: PaperPlaneTilt },
    sending: { label: dict.contact.sending, Icon: CircleNotch },
    sent: { label: dict.contact.sent, Icon: Check },
    error: { label: dict.contact.error, Icon: PaperPlaneTilt },
  }[status];

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="glass-strong rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">
            {dict.contact.title}
          </h2>
          <p className="text-stone-500 mb-8">{dict.contact.subtitle}</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="sr-only">
                {dict.contact.namePlaceholder}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={status === 'sending'}
                placeholder={dict.contact.namePlaceholder}
                className="w-full bg-white/60 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                {dict.contact.emailPlaceholder}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={status === 'sending'}
                placeholder={dict.contact.emailPlaceholder}
                className="w-full bg-white/60 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">
                {dict.contact.messagePlaceholder}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                disabled={status === 'sending'}
                placeholder={dict.contact.messagePlaceholder}
                className="w-full bg-white/60 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium transition-all active:scale-[0.98] disabled:pointer-events-none ${
                status === 'sent'
                  ? 'bg-emerald-600 text-white'
                  : status === 'error'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-2"
                >
                  {buttonContent.label}
                  <buttonContent.Icon
                    size={16}
                    weight="bold"
                    className={status === 'sending' ? 'animate-spin' : ''}
                  />
                </motion.span>
              </AnimatePresence>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
