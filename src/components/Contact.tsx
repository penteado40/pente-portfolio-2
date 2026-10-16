'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary, DevDictionary } from '@/i18n/types';
import type { LinkId } from '@/content/links';
import { ArrowUpRight, Check, CircleNotch } from '@phosphor-icons/react';
import { submitContact } from '@/lib/submitContact';
import { ChannelChip } from './ChannelChip';
import { Container } from './Container';
import { PillButton } from './PillButton';
import { SectionLabel } from './SectionHeader';
import { EASE_OUT } from './easing';

type Status = 'idle' | 'sending' | 'sent' | 'error';

type ContactProps = {
  /** Position on the page, for the "NN / Contact" label. */
  index: number;
  /** The persona's direct channels, as Chips under the text. */
  links: readonly LinkId[];
};

const field = 'flex flex-col gap-2 text-[13px] text-ink/70';
const input =
  'w-full rounded-[14px] border border-white/14 bg-white/4 px-4 py-3.5 text-base md:text-[15px] text-ink placeholder:text-ink/60 focus:outline-none focus:border-highlight focus:ring-2 focus:ring-highlight/30 transition-colors disabled:opacity-50';

// A Color block shared by both persona pages: the persona's question and
// its direct channels on the left, the form in a block-mid glass pane on
// the right from lg up; stacked below that.
export function Contact({ index, links }: ContactProps) {
  const { dict } = useLocale<AudioDictionary | DevDictionary>();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const { contact, contactForm: formText } = dict;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = new FormData(form);

    const result = await submitContact({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });

    if (result.ok) {
      setStatus('sent');
      form.reset();
    } else {
      setStatus('error');
    }
  }

  // Typing again after a send, or after an error, brings the button back.
  const onInput = () => {
    if (status === 'sent' || status === 'error') setStatus('idle');
  };

  const button = {
    idle: { label: formText.send, Icon: ArrowUpRight },
    sending: { label: formText.sending, Icon: CircleNotch },
    sent: { label: formText.sent, Icon: Check },
    error: { label: formText.error, Icon: ArrowUpRight },
  }[status];

  return (
    <section id="contact" className="bg-block-deep py-[72px] md:py-[120px]">
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-[72px] items-start">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="flex flex-col gap-4 md:gap-[22px]"
        >
          <SectionLabel index={index} label={dict.nav.contact} />
          <h2 className="text-[34px] md:text-5xl lg:text-[56px] leading-[1.05] md:leading-[1.02] font-medium tracking-[-0.035em] text-white">
            {contact.title}
          </h2>
          <p className="text-[15px] md:text-[17px] leading-[1.6] text-ink/72 max-w-[620px]">
            {contact.subtitle}
          </p>
          <ul className="flex flex-wrap gap-1.5 md:gap-2.5 md:mt-2">
            {links.map((id) => (
              <li key={id}>
                <ChannelChip id={id} tone="block-mid" tall />
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          onSubmit={handleSubmit}
          onInput={onInput}
          className="glass glass-block-mid flex flex-col gap-4 md:gap-[18px] p-5 md:p-8 rounded-[20px] md:rounded-[24px]"
        >
          <label className={field}>
            {formText.name}
            <input
              name="name"
              type="text"
              autoComplete="name"
              required
              disabled={status === 'sending'}
              placeholder={contact.namePlaceholder}
              className={input}
            />
          </label>
          <label className={field}>
            {formText.email}
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={status === 'sending'}
              placeholder={contact.emailPlaceholder}
              className={input}
            />
          </label>
          <label className={field}>
            {formText.message}
            <textarea
              name="message"
              required
              disabled={status === 'sending'}
              placeholder={contact.messagePlaceholder}
              className={`${input} min-h-[120px] md:min-h-[140px] resize-y`}
            />
          </label>

          <PillButton
            type="submit"
            Icon={button.Icon}
            busy={status === 'sending'}
            disabled={status === 'sending' || status === 'sent'}
            className="w-full md:w-auto md:self-start mt-1"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={status}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.15 }}
              >
                {button.label}
              </motion.span>
            </AnimatePresence>
          </PillButton>
          {/* The button's label shows the result; this reads it out. */}
          <p role="status" className="sr-only">
            {status === 'sent' ? formText.sent : status === 'error' ? formText.error : ''}
          </p>
        </motion.form>
      </Container>
    </section>
  );
}
