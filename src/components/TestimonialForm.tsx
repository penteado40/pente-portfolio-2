'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { PaperPlaneTilt, Check, CircleNotch } from '@phosphor-icons/react';
import { submitTestimonial } from '@/lib/submitTestimonial';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function TestimonialForm({ onSuccessClose }: { onSuccessClose: () => void }) {
  const { dict } = useLocale();
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (status !== 'sent') return;
    const timer = setTimeout(onSuccessClose, 1500);
    return () => clearTimeout(timer);
  }, [status, onSuccessClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = new FormData(form);

    const result = await submitTestimonial({
      author: String(data.get('author') ?? ''),
      roleCompany: String(data.get('roleCompany') ?? ''),
      message: String(data.get('message') ?? ''),
    });

    if (result.ok) {
      setStatus('sent');
      form.reset();
    } else {
      setStatus('error');
    }
  }

  const buttonContent = {
    idle: { label: dict.testimonialForm.send, Icon: PaperPlaneTilt },
    sending: { label: dict.testimonialForm.sending, Icon: CircleNotch },
    sent: { label: dict.testimonialForm.sent, Icon: Check },
    error: { label: dict.testimonialForm.error, Icon: PaperPlaneTilt },
  }[status];

  return (
    <div>
      <h3 className="text-2xl font-medium tracking-tight mb-2">{dict.testimonialForm.title}</h3>
      <p className="text-ink/60 mb-6">{dict.testimonialForm.subtitle}</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="testimonial-name" className="sr-only">
            {dict.testimonialForm.namePlaceholder}
          </label>
          <input
            id="testimonial-name"
            name="author"
            type="text"
            required
            disabled={status === 'sending'}
            placeholder={dict.testimonialForm.namePlaceholder}
            className="w-full bg-white/5 border border-ink/15 rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="testimonial-role" className="sr-only">
            {dict.testimonialForm.rolePlaceholder}
          </label>
          <input
            id="testimonial-role"
            name="roleCompany"
            type="text"
            required
            disabled={status === 'sending'}
            placeholder={dict.testimonialForm.rolePlaceholder}
            className="w-full bg-white/5 border border-ink/15 rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="testimonial-message" className="sr-only">
            {dict.testimonialForm.messagePlaceholder}
          </label>
          <textarea
            id="testimonial-message"
            name="message"
            rows={4}
            required
            disabled={status === 'sending'}
            placeholder={dict.testimonialForm.messagePlaceholder}
            className="w-full bg-white/5 border border-ink/15 rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending' || status === 'sent'}
          className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium transition-all active:scale-[0.98] disabled:pointer-events-none ${
            status === 'sent'
              ? 'bg-success text-background'
              : status === 'error'
                ? 'bg-danger text-white hover:bg-danger-dark'
                : 'bg-accent text-white hover:bg-accent-dark'
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
    </div>
  );
}
